const Patient = require('../models/Patient');
const User = require('../models/User');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);

    } catch (err) {
        next(err);
    }
}

const grantAccess = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const user = await User.findByPk(req.params.uid);

        if (user) {
            if (user.validToken(token)) {
                next();
            }
            else {
                res.status(401).json({ message: 'unauthorized' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }

    } catch (err) {
        next(err);
    }
};

const addPatient = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patient = await Patient.create(req.body);
            patient.userId = user.id;
            await patient.save();
            res.status(201).json({ message: "created" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }

    } catch (err) {
        next(err);
    }
}

const getPatients = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid, {
            include: [Patient]
        });
        
        if (user) {
            res.status(200).json(user.patients);
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (err) {
        next(err);
    }
}

const deletePatient = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patients = await user.getPatients({
                where: {
                    id: req.params.pid
                }
            });

            const patient = patients.shift();

            if (patient) {
                await patient.destroy();
                res.status(200).json({ message: 'accepted' });

            } else {
                res.status(404).json({ message: 'not found' });
            }
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (err) {
        next(err);
    }
}

const updatePatient = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patients = await user.getPatients({
                where: {
                    id: req.params.pid
                }
            });

            const patient = patients.shift();

            if (patient) {
                await patient.update(req.body);
                res.status(200).json({ message: 'accepted' });

            } else {
                res.status(404).json({ message: 'not found' });
            }
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getUsers,
    addPatient,
    getPatients,
    deletePatient,
    updatePatient,
    grantAccess
}