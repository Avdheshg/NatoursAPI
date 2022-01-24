/*
    In Controller.js V define the route handler functions
*/

const fs = require("fs");
 
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Defining a param MW
// In param MW V have 4 parameters, 3 params same as in normal MW (i.e req, res, next), 1 extra param is on which this param MW is used. Here it is used on id so in the below definition val==id
// this param MW will ensure that the id given must be less than length of the tours
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

// creating a new MW function for checking the data sent by the user is valid or not 
exports.checkdBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price and detected by the MW function'
        });
    }
    next();
}   

exports.getAllTours = (req, res) => {

    // V wants to find at which time this req was made
    console.log("getAllTours() req is made at: " + req.requestTime);

    // after sending the "res.json/send" V complete/end the req, res cycle
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime, 
        results: tours.length, 
        data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1; 
    const tour = tours.find(el => el.id === id);

    // this will be handled by the "param MW"
    // if (!tour) {   // no tour found for the given id
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: "Invalid ID"
    //     });
    // }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
} 

exports.createTour = (req, res) => {
   const newId = tours[tours.length-1].id + 1;

   const newTour = Object.assign({id: newId}, req.body);

   tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).send({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
}

exports.updateTour = (req, res) => {
    // this will be handled by the "param MW"
    // if (req.params.id * 1 > tours.length) {
    //     return res.json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     });
    // }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour will be here>'
        }
    });
}

exports.deleteTour = (req, res) => {
    // this will be handled by the "param MW"
    // if (req.params.id * 1 > tours.length) {
    //     return res.json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     });
    // }

    // 204 => no content
    res.status(204).json({
        status: 'success',
        data: {
            tour: '<Deleted>'
        }
    });
}
