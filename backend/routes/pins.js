const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json({pin: savedPin, success:true, message:"Pin created successfully"});
  } catch (err) {
    res.status(500).json({err: err, success:false, message:"Error creating pin"});
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json({pins: pins, success:true, message:"Pins retrieved"});
  } catch (err) {
    res.status(500).json({err: err, success:false, message:"Error retrieving pins"});
  }
});

module.exports = router;