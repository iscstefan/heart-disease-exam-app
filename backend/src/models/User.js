const Sequelize = require('sequelize');
const sequelize = require('../database');
const Patient = require('./Patient');

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    googleId: {
        type: Sequelize.STRING,
        unique: true
    },
    token: {
        type: Sequelize.STRING
    }
});

User.prototype.validToken = function (token) {
    return this.token === token;
}

User.hasMany(Patient);

module.exports = User;