const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express();

dotenv.config()

const port = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))
    
app.listen(port, () => {
    console.log('Backend server is running.')
})