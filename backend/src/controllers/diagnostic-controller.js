const Diagnostic = require("../models/Diagnostic");

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

const addDiagnostic = async (req, res, next) => {
    try {
        const diagnostic = Diagnostic.build(req.body);
        const features = []

        for(let prop in req.body) {
            features.push(req.body[prop])
        }

        //pyhton script call
        diagnostic.prediction = await runScript(features)
        //output
        console.warn({prediction: diagnostic.prediction})

        await diagnostic.save();

        res.status(201).json({ message: 'created' });
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
        const diagnostics = await Diagnostic.findAll({ attributes: { exclude: ['patientId'] } });
        res.status(200).json(diagnostics);

    } catch (err) {
        next(err)
    }
}

module.exports = {
    addDiagnostic,
    getDiagnostics
}