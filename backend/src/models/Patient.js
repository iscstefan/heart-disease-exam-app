const Sequelize = require('sequelize');
const sequelize = require('../database');
const Diagnostic = require('./Diagnostics');

const Patient = sequelize.define('patient', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
    },
    telehpone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    observations: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 700]
        }
    }
});

Patient.hasMany(Diagnostic);

module.exports = Patient;