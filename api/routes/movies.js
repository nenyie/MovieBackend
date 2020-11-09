const express = require('express');
const router = express.Router();
const  mongoose  = require('mongoose');
const Movie = require('../models/movie');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
// const upload = multer({
//     dest: 'uploads/'
// });

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
});
const upload = multer({storage: storage});
//upload.single('movieImage')

router.get('/', (req, res, next) => {
    Movie.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            movies: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/movies' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    // res.status(200).json({
    //     message: 'Handling GET requests to ./movies'
    // });
});

router.post('/', upload.single('movieImage'), (req, res, next) => {
    console.log(req.file);
    const movie = new Movie ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        //movieImage: req.file.path
    });

    movie.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'created movie successfully',
            Createdmovie: {
                name: result.name,
                price: result.price,
                
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/movies' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
    });
    
});

router.get('/:productId', (req, res, next) => {
    //const id = req.params.productId;
    // if(id === 'special'){
    //     res.status(200).json({
    //         message: 'you discovered the special Id',
    //         id: id
    //     })
    // }else {
    //     res.status(200).json({
    //         message: 'you passed an id'
    //     });
    // }

    const id = req.params.productId;
    Movie.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("from database", doc);
        if(doc){
        res.status(200).json({
            movie: doc,
            request: {
                type: 'GET',
                url: 'http://localhost/movies'
            }
        });
        }else{
            res.status(404).json({message: 'no valid entry found for movies'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
   // Movie.update({_id: id}, { $set: { name: req.body.newName, price: req.body.newPrice}
   Movie.update({_id: id}, { $set: updateOps })
   .exec()
   .then(result => {
    console.log(result);
    res.status(200).json(result)
})
   .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
})



    // res.status(200).json({
    //     message: 'updated product'
    // })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Movie.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });




    // res.status(200).json({
    //     message: 'deleted product'
    // })
});


module.exports = router;