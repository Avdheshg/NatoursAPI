/*
    this is a script which will save the data from JSON to MDB
    It will only run once at the start only
*/

const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

// grabbing the TourModel bcoz V will use it as a Model for the data coming from JSON file
const Tour = require('./../../models/tourModel');

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


// Reading JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//  Import data into DB
// This function doesn't require any arg
const importData = async () => {
    try {
        await Tour.create(tours);   // V R using "create()" on "Tour" model
        console.log('Data successfully loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit();   // this will exit from the process o/w it will continuously run in cmd 
}

// Deleting the whole data
const deleteData = async () => {
    try {
        await Tour.deleteMany();    // if arg is empty then it will delete all of the doc
        console.log('Complete data deleted successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit(); 
}

// These will run when V run "node dev-data/data/import-dev-data 3rdArg" in the cmd line
// here "3rdArg" === --import or --delete
// process.argv is an array
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// console.log(process.argv);























