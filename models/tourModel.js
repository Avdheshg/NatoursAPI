// Everything which is related to the Model will be here

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    // here in the curly braces V R passing the schema as object
    // "unique": will take care that all the tour's name must be unique
    name: {
        type: String,
        required: [true, 'A tour must have a name'],    // this is k/a "validator"
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    }, 
    price: {
        type: Number,
        required: [true, 'A tour must hava a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


























