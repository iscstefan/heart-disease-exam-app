const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();

//users
router.get('/users', userController.getUsers);

//grant user access
router.use('/users/:uid', userController.grantAccess);

//router.put('/users/:uid', userController.updateUser);

//router.delete('/users/:uid', userController.deleteUser);


//user's patients
router.get('/users/:uid/patients', userController.getPatients);

router.post('/users/:uid/patients', userController.addPatient);

router.delete('/users/:uid/patients/:pid', userController.deletePatient);

router.put('/users/:uid/patients/:pid', userController.updatePatient);

//patient's diagnostics
router.get('/users/:uid/patients/:pid/diagnostics', userController.getDiagnostics);

router.post('/users/:uid/patients/:pid/diagnostics', userController.addDiagnostic);

router.delete('/users/:uid/patients/:pid/diagnostics/:did', userController.deleteDiagnostic);

module.exports = router;