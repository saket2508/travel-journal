require('dotenv').config()
const router = require("express").Router()
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwtGenerator = require('../utils/jwtGenerator')

const User = require("../models/User")
const validate = require('../middleware/validate')
const authorize = require('../middleware/authorize')

const maxAge = 7*24*3600*1000


// GET auth status
router.get("/auth", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({mesage: "Server error"});
  }
})

// GET user info
router.get("/info", authorize, async (req, res) => {
  try {
    const user_id = req.user
    const user = await User.findById({_id: user_id})
    if(user){
      const {username, email} = user
      res.status(200).json({success: true, user: {username, email}, message: 'Fetched user info'})
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({mesage: "Server error"});
  }
})

//POST register a user
router.post("/register", validate ,async (req, res) => {
  try {
    const { username, email, password } = req.body
    const userExists = await User.findOne({email: email})
    if(userExists){
      res.status(401).json({message:"User already exists", success:false})
    }
    else{
      //generate new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);

      //create new user
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      //save user and generate jwt token
      const user = await newUser.save()
      const token = jwtGenerator(user._id)

      // store jwt in httpOnly cookie
      res.cookie('travel_journal_jwt', token, { httpOnly: true, maxAge: maxAge })

      res.status(200).json({success: true, message: "User registered"})
    }
  } catch (err) {
      console.log(err)
      res.status(500).json({error: err, message:"Server Error", success: false})
  }
})

//POST log in user
router.post("/login", validate, async (req, res) => {
  try {
    //find user
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if(!user){
      res.status(401).json({message: "Incorrect username or password", success: false})
    }
    //validate password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    )
    if(!validPassword){
      res.status(401).json({message: "Incorrect username or password", success: false})
    }
    // Generate JWT token and store it in an HTTP only cookie
    const token = jwtGenerator(user._id)
    res.cookie('travel_journal_jwt', token, { httpOnly: true, maxAge: maxAge })

    res.status(200).json({ message:"User signed in", success: true})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error: err, message:"Server Error", success: false})
  }
})

router.get('/logout', async(req, res) => {
  try {
    res.cookie('travel_journal_jwt', '', { maxAge: 1 })
    res.status(201).json("User signed out")
  } catch (error) {
    res.status(500).json("Server Error")
  }
})


module.exports = router;