const express = require('express');
const diagnosticController = require('../controllers/diagnostic-controller');

const router = express.Router();

router.get('/diagnostics', diagnosticController.getDiagnostics);

router.post('/diagnostics', diagnosticController.addDiagnostic);

router.post('/diagnostics/chatbot', diagnosticController.receiveAnswer);

module.exports = router;