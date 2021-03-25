const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const users = require('./routers/user-router');
const cors = require('cors');
var session = require('express-session');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/auth-router')
const diagnosticRouter = require('./routers/diagnostic-router');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());



//to be deleted
app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true });
        res.status(201).json({ message: 'created' })
    } catch (error) {
        next(error);
    }
});

app.use(users);
app.use(authRouter);
app.use(diagnosticRouter);

app.use((err, req, res, next) => {
    console.warn(err);

    if (err.name === 'SequelizeValidationError') {
        res.status(422).json({ message: 'validation error' });
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(422).json({ message: 'unique constraint error' });
    } else {
        res.status(500).json({ message: 'server error' });
    }
})

app.listen(8080);