const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoutes = require('./routes/users')
const pinRoutes = require('./routes/pins')

dotenv.config()

app.use(express.json())
app.use(cors())

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

app.get('/', (req, res) => { 
    res.send('Backend server running')
})
    
app.listen(port, () => {
    console.log('Backend server is running.')
})