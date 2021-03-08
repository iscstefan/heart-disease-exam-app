const Diagnostic = require("../models/Diagnostic");

const addDiagnostic = async (req, res, next) => {
    try {
        const diagnostic = await Diagnostic.create(req.body);

        //cazul in care se introduce cheie externa deutilizator -> nu e permis
        await diagnostic.save()

        res.status(201).json({ message: "created" });

    } catch (err) {
        next(err)
    }
}

const getDiagnostics = async (req, res, next) => {
    try {
        const diagnostics = await Diagnostic.findAll({attributes: {exclude: ['patientId']}});
        res.status(200).json(diagnostics);

    } catch (err) {
        next(err)
    }
}

module.exports = {
    addDiagnostic,
    getDiagnostics
}