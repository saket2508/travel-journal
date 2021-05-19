const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//REGISTER A USER
router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({username: req.body.username})
    if(userExists){
      res.status(200).json({message:"Sorry. That username is already taken.", success:false})
    }
    else{
      //generate new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save()
      res.status(200).json({user: user._id, username: user.username, message:"user created successfully", success: true})
    }
    } catch (err) {
      console.log(err)
      res.status(500).json({error: err, message:"error creating user", success: false})
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(200).json({message: "Wrong username or password", success: false})

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )
    !validPassword && res.status(200).json({message: "Wrong username or password", success: false})

    //send response
    res.status(200).json({ user:user._id, username: user.username, message:"User signed in", success: true })
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;