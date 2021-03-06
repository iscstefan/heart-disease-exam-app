const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();

//users
router.get('/users', userController.getUsers);

router.post('/users', userController.addUser);


//grant user access
router.use('/users/:uid', userController.grantAccess);


//router.put('/users/:uid', userController.updateUser);

//router.delete('/users/:uid', userController.deleteUser);


//user's patients
// router.get('/users/:uid/patients', userController.getPatients);

// router.post('/users/:uid/patients', userController.addPatient);

// router.delete('/users/:uid/patients/:pid', userController.deletePatient);

// router.put('/users/:uid/patients/:pid', userController.updatePatient);

module.exports = router;