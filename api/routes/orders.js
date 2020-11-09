const express = require('express');
const router = express.Router();
const  mongoose  = require('mongoose');
const Order = require('../models/order');
const Movie = require('../models/movie');


router.post('/', (req, res, next) => {
    product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
          return order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'order stored',
                        createdOrder: {
                            _id: result._id,
                            prouct: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: "http://localhost:4000/orders/" + doc._id
                        }
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'product not found',
                error: err
            })
        })
   
})

router.get("/", (req, res, next) => { 
    Order.find()
    .select('product quantity_id')
    .populate('movie', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.productId,
                        request: {
                            type: get,
                            url: "http://localhost:4000/orders/" + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

    router.get('/:orderId', (req, res, next) => {
        Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message: 'order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: ''
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })

    router.delete('/', (req, res, next) => {
        Order.remove({_id: req.params.orderId})
        .exec()
        .then()
        .catch()
    })
})




module.exports = router;