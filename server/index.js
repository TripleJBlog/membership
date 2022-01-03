// this will find the .env file at the root of your project
// and parse the entries into key/value pairs on the `process.env` object
require("dotenv").config();

const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-url-encoded
app
  .use(bodyParser.urlencoded({ extended: true }))
  // application/json
  .use(bodyParser.json())
  .use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app
  .get("/", (req, res) => res.send("Hello world! Happy New Year!!!"))
  .post("/api/users/register", (req, res) => {
    // for sign up

    const user = new User(req.body);
    user.save((err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
      });
    });
  });

app.post("/api/users/login", (req, res) => {
  // looking for requested email from DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "There is no user information with the email",
      });
    }

    // If there is email, validate password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "Password doesn't match",
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  console.log(req.user);
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
