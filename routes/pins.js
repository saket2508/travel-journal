const router = require("express").Router()
const Pin = require("../models/Pin")

const authorize = require('../middleware/authorize')

//POST create a pin
router.post("/add", authorize, async (req, res) => {
  try {
    const user_id = req.user._id
    // Create a new pin
    const newPin = new Pin({
      user: user_id,
      place: req.body.place,
      memories: req.body.memories,
      long: req.body.long,
      lat: req.body.lat
    })
    const savedPin = await newPin.save();
    res.status(200).json({pin: savedPin, success:true, message:"Saved Pin"});
  } catch (err) {
    res.status(500).json({ success:false, error:"Server Error"});
  }
});

//get all pins
router.get("/", authorize, async (req, res) => {
  try {
    const user_id = req.user._id
    const pins = await Pin.find({user: user_id});
    res.status(200).json({pins: pins, success:true, message:"Pins retrieved"});
  } catch (err) {
    res.status(500).json({success:false, error:"Server Error"});
  }
});

module.exports = router;