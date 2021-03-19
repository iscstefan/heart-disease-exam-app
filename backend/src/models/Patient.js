const Sequelize = require('sequelize');
const sequelize = require('../database');
const Diagnostic = require('./Diagnostic');

const Patient = sequelize.define('patient', {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [0, 100]
        }
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [0, 100]
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 100]
        }
    },
    telephone: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 40]
        }
    },
    address: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 200]
        }
    },
    identification_number: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 50]
        }
    },
    observations: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 500]
        }
    }
});

Patient.hasMany(Diagnostic);

module.exports = Patient;