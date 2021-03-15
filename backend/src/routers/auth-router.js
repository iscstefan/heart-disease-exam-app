const express = require('express');
const authRouter = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config({})


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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('deserialize')

        const user = await User.findByPk(id);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err);
    }
});

authRouter.use(session({
    secret: process.env.session_secret, resave: true,
    saveUninitialized: true
}));
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { session: true }), (req, res) => {
    res.redirect(process.env.client_url)
})

authRouter.get('/checkauth', async (req, res, next) => {
    try {
        if (req.isAuthenticated())
            res.status(200).json({ id: req.user.id, email: req.user.email, token: req.user.token })
        else {
            res.status(401).json({ message: 'unauthorized' });
        }
    } catch (err) {
        next(err);
    }
})

authRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = authRouter;