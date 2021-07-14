const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const jwtGenerator = require('./utils/jwtGenerator')
require('./oauth2/googleStrategy')

const maxAge = 7*24*3600*1000
const APP_REDIRECT_URI = process.env.NODE_ENV === "production" 
? 'https://mern-travel-journal.netlify.app' 
: 'http://localhost:3000'

const app = express()

// Routes
const userRoutes = require('./routes/users')
const pinRoutes = require('./routes/pins')


// Middleware
dotenv.config()
app.use(cors({ origin: true, credentials: true}))
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())

const port = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true, 
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

app.use("/api/users", userRoutes)
app.use("/api/pins", pinRoutes)

app.get('/api/oauth', passport.authenticate(
    'google', 
    {scope: [ 'email', 'profile' ]},    
))

app.get('/api/oauth/callback', passport.authenticate(
    'google', 
    {scope : [ 'email', 'profile' ]}
), (req, res) => {
    try {
        const token = jwtGenerator(req.user)
        res.cookie('travel_journal_jwt', token, { httpOnly: true, maxAge: maxAge })
        res.redirect(`${APP_REDIRECT_URI}`)
      } catch (error) {
        console.error(error.message)
        res.redirect(`${APP_REDIRECT_URI}/login`)
    }
})

app.get('/', (req, res) => { 
    res.send('Backend server running')
})
    
app.listen(port, () => {
    console.log('Backend server is running.')
})