const Sequelize = require('sequelize');
const sequelize = require('../database');
const Diagnostic = require('./Diagnostic');

const Patient = sequelize.define('patient', {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    sex: {
        type: Sequelize.ENUM,
        values: ['M', 'F'],
        allowNull: false
    },
    email: {
        type: Sequelize.STRING
    },
    telephone: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    identification_number: {
        type: Sequelize.STRING,
        unique: true
    },
    observations: {
        type: Sequelize.STRING
    }
});

Patient.hasMany(Diagnostic);

module.exports = Patient;