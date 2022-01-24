/*
    In routes.js => V only define functions which are related to the routes.
    Rest of the code will be in controller.js
*/

const express = require('express');
const userController = require('./../controllers/userController');

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };
// // 500: internal server error

// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };


const router = express.Router();

router
.route('/')   
.get(userController.getAllUsers)
.post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;

