const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
   res.status(200).json({
       message: 'actors were fetched'
   })
});


router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'actors were created',
        
    })
 });
 
 
 router.get('/:actorsId', (req, res, next) => {
    res.status(200).json({
        message: 'actors were fetched with an id',
        actorsId: req.params.actorsId
    })
 });
 
 router.delete('/:actorsId', (req, res, next) => {
    res.status(200).json({
        message: 'actors were deleted',
        actorsId: req.params.actorsId
    })
 });
 

module.exports = router;