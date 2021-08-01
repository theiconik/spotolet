const router = require("express").Router();
const Pin = require("../models/Pin");

//CREATE A PIN
router.post("/", async (req, res) => {
   const newPin = new Pin(req.body);
   try {
      const savedPin = await newPin.save();
      res.status(200).json(savedPin);
   } catch (err) {
      res.status(500).send(err);
   }
});

//GET ALL PINS
router.get("/", async (req, res) => {
   try {
      const pins = await Pin.find();
      res.status(200).json(pins);
   } catch (err) {
      res.status(500).send(err);
   }
});

//GET A SPECIFIC PIN
router.get("/:id", async (req, res) => {
   try {
      const pin = await Pin.findById(req.params.id);
      res.status(200).json(pin);
   } catch (err) {
      res.status(500).send(err);
   }
});

//DELETE A SPECIFIC PIN
router.delete("/:id", async (req, res) => {
   try {
      const pin = await Pin.findByIdAndRemove(req.params.id);
      res.status(200).json(pin);
   } catch (err) {
      res.status(500).send(err);
   }
});

module.exports = router;
