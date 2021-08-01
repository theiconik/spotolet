const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //Save user and send response
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).send(err);
  }
});

//LOGIN
router.post("/login", async (req,res) => {
   try{
      //Find user by username
      const user = await User.findOne({username: req.body.username});
      !user && res.status(404).json("Wrong username or password");

      //Validate password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      !validPassword && res.status(404).json("Wrong username or password");

      //Send response
      res.status(200).json({_id:user._id, username: user.username});
   } catch (err) {
      res.status(500).send(err);
   }
});

module.exports = router;
