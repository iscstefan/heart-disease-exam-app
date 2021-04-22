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

//chatbot
const getAnswerFromChatBot = function (question) {
    return new Promise(function (resolve, reject) {

        const { spawn } = require('child_process');
        const pyprog = spawn('python', ['./python_scripts/chatbot.py', question]);

        pyprog.stdout.on('data', async function (data) {
            console.warn()
            const answer = data.toString();
            resolve(answer.substring(0, answer.length - 2));
        });

        pyprog.stderr.on('data', (data) => {
            reject({ name: 'py script error', message: data.toString() })
        });
    });
}

const receiveAnswer = async (req, res, next) => {
    try {
        if (!('question' in req.body)) {
            res.status(400).json({ message: 'malformed request' })
            return;
        }

        const answer = await getAnswerFromChatBot(req.body.question)
        console.warn({ answer: answer })

        res.status(201).json({ answer: answer });
    } catch (err) {
        if (err.name === 'py script error') {
            console.warn(err.message)
            res.status(500).json({ message: err.name });
        }
        else
            next(err)
    }
}

//chatbot

const addDiagnostic = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length !== 13) {
            res.status(400).json({ message: 'malformed request' })
            return;
        }

        const features = []

        for (let prop in req.body) {
            if (isNaN(req.body[prop])) {
                res.status(400).json({ message: 'malformed request' })
                return;
            }

            features.push(req.body[prop])
        }

        console.log(features);

        //!!!!!!!!!!!!!!!!
        //Nu salvez in BD !!
        // const diagnostic = Diagnostic.build(req.body);

        //pyhton script call
        const prediction = await runScript(features)
        //output
        console.warn({ prediction: prediction })

        // await diagnostic.save();

        res.status(201).json({ prediction: prediction });
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
    getDiagnostics,
    receiveAnswer
}