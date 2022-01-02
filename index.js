// this will find the .env file at the root of your project
// and parse the entries into key/value pairs on the `process.env` object
require("dotenv").config();
const { User } = require("./models/User");

const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

// application/x-www-form-url-encoded
app
  .use(bodyParser.urlencoded({ extended: true }))
  // application/json
  .use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app
  .get("/", (req, res) => res.send("Hello world! Happy New Year!!!"))
  .post("/register", (req, res) => {
    // for sign up

    const user = new User(req.body);
    user.save((err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
      });
    });
  })
  .listen(port, () => console.log(`Example app listening on port ${port}!`));
