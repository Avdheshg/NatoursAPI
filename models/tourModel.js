// Everything which is related to the Model will be here

const mongoose = require('mongoose');

// defining a Schema
const tourSchema = new mongoose.Schema({
    // here in the curly braces V R passing the schema as object
    // "unique": will take care that all the tour's name must be unique
    name: {
        type: String,
        required: [true, 'A tour must have a name'],    // this is k/a "validator"
        unique: true,
        trim: true   // this only works on "String"
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    }, 
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    // here in ratings V R not defining the "required" bcoz these will not be provided by the user instead they will be calculated by the average rating of a tour
    ratingsAverage: {
        type: Number,
        default: 4.5
    }, 
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must hava a price']
    },
    // If the company gives a discount on any tour
    // V R not using the Schema options here Bcoz this field is not mandatory i.e tour can have a discount or it didn't
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    // this is the name of cover image. V R storing only the name of the cover image but V can also save the whole image in DB but it is not a good idea. So in the DB V only save the name and V will save the whole image somewhere in the file system
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    // as V have multiple images for a tour V will save their names into an array
    images: [String],
    createdAt: {
        type: Date,    // "Date" is an data type in JS
        default: Date.now(),
        select: false    // now "createdAt" will not be delivered to the user with the response
    },
    // these R the different dates at which a tour starts
    startDates: [Date]
});

// Defining a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


























