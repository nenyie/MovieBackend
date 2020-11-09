const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const moviesRoutes = require('./api/routes/movies');
const actorsRoutes = require('./api/routes/actors');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));

//connection to database
const url = 'mongodb://localhost:27017/moviesdb'
mongoose.connect(url ,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, db){

});
const db = mongoose.connection
db.once('open', _ => {
    console.log('database connected:', url)
})
db.on('error', err => {
    console.log('connection error:', err)
})

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//route configuration
app.use('/movies', moviesRoutes);
app.use('/actors', actorsRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Headers", 
                "Origin, X-requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "it works"
//     });
// });

module.exports = app;