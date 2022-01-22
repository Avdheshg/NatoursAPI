const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
 
const cars = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`)); 
// console.log(cars);

// M-1
// app.get('/api/v1/cars', (req, res) => {
//     // console.log("V will send the data at this route");
//     // res.status(200).send("V will send the data at this route");

//     res.status(200).json({  
//         status: 200,
//         length: cars.length,
//         cars: cars
//     });

// });

// app.post('/api/v1/cars', (req, res) => {
//     // res.status(200).send("User can sendd the data to this route");

//     // console.log(req.body);

//     const newCar = req.body;
//     const newId = cars[cars.length-1].id + 1;
//     // newCar.id = newId;
//     // console.log(newId);

//     // const newCar = Object.assign({id: newId, newObj});
    
//     // console.log("Combined");
//     // console.log(newCar);

//     cars.push(newCar);

//     fs.writeFile(`${__dirname}/dev-data/data.json`, JSON.stringify(cars), err => {
        
//         res.status(201).send({
//             status: "seccuess",
//             data: {
//                 newCar
//             }
//         });
//     });  

// });      

// app.get('/api/v1/cars/:id', (req, res) => {

//     // const queryCar = cars[req.params.id];
//     // console.log(queryCar);

//     const queryCarId = req.params.id * 1;
//     const queryCar = cars.find(el => el.id === queryCarId);
//     // console.log(queryCar);  

//     if (queryCarId > cars.length) {
//         res.status(404).send({
//             message: "Nothing matching found for the id"
//         });
//     } else {

//         res.status(200).send({
//             status: 'success',
//             data: {
//                 queryCar
//             }
//         });
//     }

// });


// ============= M-2 ==========================================================================================
const getAllCars =  (req, res) => {
    // console.log("V will send the data at this route");
    // res.status(200).send("V will send the data at this route");

    res.status(200).json({  
        status: 200,
        length: cars.length,
        cars: cars
    });
}

// app.get('/api/v1/cars', getAllCars);

// =====
const createCar = (req, res) => {
    const newCar = req.body;
    cars.push(newCar);

    fs.writeFile(`${__dirname}/dev-data/data.json`, JSON.stringify(cars), err => {
        
        res.status(201).send({
            status: "seccuess",
            data: {
                newCar
            }
        });
    });  
}

// app.post('/api/v1/cars', createCar);

// =====
const getCar = (req, res) => {
    const queryCarId = req.params.id * 1;
    const queryCar = cars.find(el => el.id === queryCarId);

    if (queryCarId > cars.length) {
        res.status(404).send({
            message: "Nothing matching found for the id"
        });
    } else {

        res.status(200).send({
            status: 'success',
            data: {
                queryCar
            }
        });
    }
}

// app.get('/api/v1/cars/:id', getCar);


// ============= M-3 ==========================================================================================
app
    .route('/api/v1/cars')
    .get(getAllCars)
    .post(createCar);

app
    .route('/api/v1/cars/:id')
    .get(getCar);



const port = 3000;
app.listen(port, () => {
    console.log("Server is ruuning at the port 3000");
})






















