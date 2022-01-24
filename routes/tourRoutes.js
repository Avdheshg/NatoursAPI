/*
    In routes.js => V only define functions which are related to the routes.
    Rest of the code will be in controller.js
*/

// const fs = require("fs");
const tourController = require('./../controllers/tourController');
// Here "tourController" object contains all the methods which have been imported from or send by "tourController.js"

const express = require('express');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// const getAllTours = (req, res) => {

//     // V wants to find at which time this req was made
//     console.log("getAllTours() req is made at: " + req.requestTime);

//     // after sending the "res.json/send" V complete/end the req, res cycle
//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime, 
//         results: tours.length, 
//         data: {
//             tours
//         }
//     });
// };

// const getTour = (req, res) => {
//     const id = req.params.id * 1; 
//     const tour = tours.find(el => el.id === id);

//     if (!tour) {   // no tour found for the given id
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         });
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// } 

// const createTour = (req, res) => {
//    const newId = tours[tours.length-1].id + 1;

//    const newTour = Object.assign({id: newId}, req.body);

//    tours.push(newTour);

//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).send({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// }

// const updateTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: '<Updated tour will be here>'
//         }
//     });
// }

// const deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     // 204 => no content
//     res.status(204).json({
//         status: 'success',
//         data: {
//             tour: '<Deleted>'
//         }
//     });
// }

const router = express.Router();

// using "param MW" => this MW works only for the route which has parameters. Here the param is id, this will not run for any user route bcoz this MW function id defined here only for tour Router. The real application of "param MW" is in the "tourController.js" where V will reduce the code repeated for checking the invalid id entered by the user
// router.param('id', (req, res, next, val) => {
//     // console.log(`Tour id is ${val}`);
//     next();
// });
router.param('id', tourController.checkID);

router
    .route('/')   
    .get(tourController.getAllTours)
    .post(tourController.checkdBody, tourController.createTour);
// here "tourController.checkdBody" is a MW function which will check if the body send by the user is valid or not before adding it to the file. This is k/a chaining multiple MW functions for a same route. It is defined in tourController.js

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;


