const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    landmark: {
      type: String,
      require: true,
      min: 3,
    },
    description: {
      type: String,
      require: true,
      min: 5,
    },
    contact: {
      type: String,
    },
    price: {
      type: String,
      require: true,
      min: 2,
    },
    lat: {
      type: Number,
      require: true,
    },
    long: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", pinSchema);
