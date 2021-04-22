const Patient = require('../models/Patient');
const User = require('../models/User');
const Diagnostic = require('../models/Diagnostic')
const sequelize = require('../config.js');

const runScript = function (features) {
    return new Promise(function (resolve, reject) {

        const { spawn } = require('child_process');
        const pyprog = spawn('python', ['./python_scripts/logistic_regression.py', ...features]);

        pyprog.stdout.on('data', async function (data) {
            console.warn()
            resolve(data.toString()[1]);
        });

        pyprog.stderr.on('data', (data) => {
            reject({ name: 'py script error', message: data.toString() })
        });
    });
}

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
            include: [Patient],
            order: [
                [Patient, 'createdAt', 'DESC']
            ]
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

const addDiagnostic = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length !== 13) {
            res.status(400).json({ message: 'malformet request' })
            return;
        }

        const features = []

        for (let prop in req.body) {
            if (isNaN(req.body[prop])) {
                res.status(400).json({ message: 'malformet request' })
                return;
            }

            features.push(req.body[prop])
        }

        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patients = await user.getPatients({
                where: {
                    id: req.params.pid
                }
            });

            const patient = patients.shift();

            if (patient) {
                const diagnostic = Diagnostic.build(req.body);

                //pyhton script call
                diagnostic.prediction = await runScript(features)
                //output
                console.warn({ prediction: diagnostic.prediction })

                diagnostic.patientId = patient.id;
                await diagnostic.save();

                res.status(201).json({ prediction: diagnostic.prediction });

            } else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (err) {
        if (err.name === 'py script error') {
            console.warn(err.message)
            res.status(500).json({ message: err.name });
        }
        else
            next(err)
    }
}

const getDiagnostics = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patients = await user.getPatients({
                where: {
                    id: req.params.pid
                },
                include: [Diagnostic]
            });

            const patient = patients.shift();

            if (patient) {
                res.status(200).json(patient.diagnostics)
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

const getUserDiagnostics = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const [diagnostics] =
                await sequelize.query(`select diagnostics.id, diagnostics.age, diagnostics.sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, prediction, patients.id as patientId from diagnostics join patients on patients.id = diagnostics.patientId where patients.userId = ${req.params.uid} `);
            
            res.status(200).json(diagnostics);
            
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (err) {
        next(err);
    }
}

const deleteDiagnostic = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid);

        if (user) {
            const patients = await user.getPatients({
                where: {
                    id: req.params.pid
                },
                include: [Diagnostic]
            });

            const patient = patients.shift();

            if (patient) {
                const diagnostics = await patient.getDiagnostics({
                    where: {
                        id: req.params.did
                    }
                });

                const diagnostic = diagnostics.shift();

                if (diagnostic) {
                    await diagnostic.destroy();
                    res.status(200).json({ message: 'accepted' });

                } else {
                    res.status(404).json({ message: 'not found' });
                }
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
    grantAccess,
    getDiagnostics,
    getUserDiagnostics,
    addDiagnostic,
    deleteDiagnostic
}