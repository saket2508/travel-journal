const config = require('./config')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../models/User')


passport.use(new GoogleStrategy({
        clientID: config.clientID,
        clientSecret: config.secret,
        callbackURL: config.callbackURI,
        passReqToCallback: true,
    },
    async function(req, res, accessToken, refreshToken, profile, done){
        const { name, emails } = profile
        let user_name = name.givenName
        let user_email = emails[0].value
        let user = null
        // Check if user with this gmail id exists
        try{
            const userExists = await User.findOne({email: user_email})
            // If user does not exist, create a new document in the users collection
            if(!userExists){
                const newUser = new User({
                    username: user_name,
                    email: user_email
                })
                user = await newUser.save()
            }
            // Else get user from the DB
            else{
                user = userExists
            }
            return done(null, user._id)
        } catch(err){
            console.error(err.message)
            return done(err, user)
        }
    }
))

passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((obj, cb) => {
    cb(null, obj)
})