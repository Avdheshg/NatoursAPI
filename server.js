const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// logging out env vars
// console.log(process.env);

// replacing the password 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// making a connection to MongoDB
// ".connect()" will return a promise
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(connection => {
    // console.log(connection.connections);
    console.log('DB connection successful');
});

// In this file only leave the code which will make our connection with the DB

/*
    mongoose Model: It is like blue print V use to create docs(it's like classes in Java/JS)
    and to perform CRUD operation V need a mongoose model
    In order to create a model V need a Schema
*/

// Defining Schema
// const tourSchema = new mongoose.Schema({
//     // here in the curly braces V R passing the schema as object
//     // "unique": will take care that all the tour's name must be unique
//     name: {
//         type: String,
//         required: [true, 'A tour must have a name'],    // this is k/a "validator"
//         unique: true
//     },
//     rating: {
//         type: Number,
//         default: 4.5
//     }, 
//     price: {
//         type: Number,
//         required: [true, 'A tour must hava a price']
//     }
// });
// Now in "tourModel.js"

// Defining a model
// const Tour = mongoose.model('Tour', tourSchema);

// Creating a new doc using "Tour" as a model. This is similar of creating/instantiating a new object of a class
// const testTour = new Tour({
//     name: 'The park Camper',
//     // rating: 4.7,
//     price: 497
// });
// Here "testTour" is an instance of tour model

// saving the document "testTour" to the DB
// "save()" will return a promise
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => { 
//     console.log('ERROR :', err);
// });


















// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});        