const AuthController = require('../../controllers/AuthController')
const authController = new AuthController()

const RegistrationRequest = require('../../middlewares/RegistrationRequest')
const LoginRequest = require('../../middlewares/LoginRequest')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const expressSession = require('express-session')

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL || '/oauth/google/callback',
    }, async (req, accessToken, refreshToken, profile, done) => {
        let profileData = profile._json
        let authData = await authController.performOauth('google', profileData.sub, profileData)

        return done(null, authData)
    }
))

const responseFormatter = require('../../utils/response_formatter')

module.exports = (app, multipartParser) => {
    app.post('/register', [ RegistrationRequest, multipartParser.none(), ], authController.register)

    app.post('/login', [ LoginRequest, multipartParser.none(), ], authController.login)

    app.get('/oauth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }))

    app.get(process.env.GOOGLE_OAUTH_CALLBACK_URL || '/oauth/google/callback', passport.authenticate('google', {
        session: false,
    }), async (req, res, next) => {
        const authData = req.user
        const lang = authData.data && authData.data.user && authData.data.user.lang || 'en'
        req.i18n.changeLanguage(lang)

        if (authData.success) {
            return res.status(200).json(responseFormatter(true, 200, req.t('Login succeeded'), authData.data, {}))
        } else {
            return res.status(401).json(responseFormatter(false, 401, req.t('Login failed')))
        }
    })
}
