//const Patient = require('../../models/Patient');
const User = require('../models/User');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

const addUser = async (req, res, next) => {
    try {
        await User.create(req.body);
        res.status(201).json({ message: 'created' });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(422).json({ message: 'username already taken' });
        }
        else {
            next(err);
        }
    }
}

const grantAccess = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const user = await User.findByPk(req.params.uid);
        
        if(user) {
            if(user.validToken(token)) {
                next();
            }
            else {
                res.status(401).json({message: 'unauthorized'});
            }
        }
        else {
            res.status(404).json({message: 'not found'});
        }

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers,
    addUser,
    grantAccess
}