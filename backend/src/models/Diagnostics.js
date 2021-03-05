const Sequelize = require('sequelize');
const sequelize = require('../database');

const Diagnostic = sequelize.define('diagnostic', {
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    sex: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:1
        }
    },
    cp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:3
        }
    },
    trestbps: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    chol: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fbs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:1
        }
    },
    restecg: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:1
        }
    },
    thalach: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    exang: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:1
        }
    },
    slope: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min:0,
            max:2
        }
    },
    ca: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:2
        }
    },
    thal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:1,
            max:3
        }
    },
    prediction: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min:0,
            max:1
        }
    }

});


module.exports = Diagnostic;