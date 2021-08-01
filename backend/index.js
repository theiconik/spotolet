const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin:"*",
    methods:["GET","POST", "DELETE"]
  })
)
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("Listening on port 8800");
});
