require('dotenv').config()

const GOOGLE_CALLBACK_URI = process.env.NODE_ENV === "production" ? process.env.GOOGLE_CALLBACK_URI_PROD : process.env.GOOGLE_CALLBACK_URI_DEV

module.exports = {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURI: GOOGLE_CALLBACK_URI
}