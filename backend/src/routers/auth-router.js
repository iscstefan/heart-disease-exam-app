const express = require('express');
const authRouter = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({
            where: {
                googleId: profile.id
            }
        });

        if (!user) {
            user = new User();

            user.googleId = profile.id;
            user.email = profile.emails[0].value;
        }

        const token = crypto.randomBytes(64).toString('hex');
        user.token = token;
        await user.save();

        done(null, user)
    } catch (err) {
        done(err);
    }
}))

authRouter.use(passport.initialize());

authRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    res.status(200).json({ token: req.user.token, id: req.user.id });
})

authRouter.post('/login', async (req, res, next) => {
    try {
        const credentials = req.body;
        const username = credentials.username;
        const password = credentials.password;

        if (!username && !password)
            res.status(401).json({ message: 'invalid credentials' });

        const user = await User.findOne({ where: { username: username } });

        if (user && await user.validPassword(password)) {
            const token = crypto.randomBytes(64).toString('hex');
            user.token = token;
            await user.save();
            res.status(200).json({ token: token, id: user.id });
        }
        else {
            res.status(401).json({ message: 'invalid credentials' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = authRouter;