
const express = require('express');

// const fs = require("fs");
const tourController = require('./../controllers/tourController');


const router = express.Router();

// router.param('id', tourController.checkID);

router
    .route('/')   
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

/* 
    Defining a default route for "top-cheap-price"
        the route for this can be "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price" (A)
        This will return all the best rated (in descending order of ratingsAverage and price)

        so making the query A, V need to fill some details so that V can TR the DB
        So for completing the query A, V need to make a MW before V call "getAllTours" route handler. This MW will fill all the queries
        This is also a good application of using a MW where V need to manipulate the query object
*/

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
// Here "aliasTopTours" is the required MW
/*
    What will happen when the above route('/top-5-cheap') will be called ?
        As soon as this route will hit then the MW "aliasTopTours" will run
        The MW function will fill all the predefined details to the query object before the "getAllTours" will run
        So as soon as the "getAllTours" will run, it will get the query object prefilled with the above details and the user don't need to fill any details
        
    Run "127.0.0.1:3000/api/v1/tours/top-5-cheap" in postman to execute the above route
*/


module.exports = router;


