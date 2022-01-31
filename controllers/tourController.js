/*
    In Controller.js V define the route handler functions
    Here V will perform the CRUD operations related to the tour
*/

const Tour = require('./../models/tourModel');
 
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));  

exports.getAllTours = async (req, res) => {

    try {
        // "find()" returns a promise
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime, 
            results: tours.length, 
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        // findById == Tour.find({_id: req.params.id})

        res.status(200).json({
            status: 'success', 
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
} 

exports.createTour = async (req, res) => {

    try {
        // 2 methods to create and save new doc to DB
        // M-1: Define a new tour and then save it
        // const newTour = new Tour({});
        // newTour.save()

        // M-2: call the "create()" on the model itself. 
        // the "create()" returns a promise but instead of handling promise V will use "async await"
        const newTour = await Tour.create(req.body);
        // Here "req.body" this is the data that will be passed by the user

        res.status(201).send({
            status: 'success',
            data: {
                tour: newTour
            } 
        });
    } catch (err) {
        // Think about the error V can get from the try block
        // As defined in the schema, here validation err can come
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
}
//  use try-catch with async-await 


exports.updateTour = async (req, res) => {

    try {

        /*
            Params list:
            1st argument: which doc V wants to update
            2nd arg: from whom to update with
            3rd arg: "new: true" will return the new updated doc
            4th arg: "runValidators: true" will again run the validators which V have used o our model. Ex: if V put "price": "save price" then as V have again run the Validator so mongoose will again check if the sent doc is corrent or not which is here for "price" it needs to be a number
        */
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // runValidators: true
        });
        // Here V R using "patch" req in postman but if V will use "put" req then V need to provide the whole Schema with values in the postman and it will replace the whole Tour object in DB. So B sure when providing the filed only which needs to be updated then use "patch" and if usign "post" then provide the whole JSON in postman

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {

    try {
        // In delete operation V don't send any data to the client in the delete operation
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Enter a valid ID'
        })
    }

}
