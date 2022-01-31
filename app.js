
const express = require("express");
const dotenv = require('dotenv');

// Locate the path of env file
// dotenv.config({path: './config.env'});
// // logging out env vars
// console.log(process.env);
  
// requiring "morgan" => 3rd party middleware
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// *************** 1) MIDDLEWARES  ***************   ***************
// ***************   ***************   ***************   ***************

// using morgan => this will return all the details about the req made the user
// app.use(morgan('dev'));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

module.exports = app;    








































