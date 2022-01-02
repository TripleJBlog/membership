// this will find the .env file at the root of your project
// and parse the entries into key/value pairs on the `process.env` object
require("dotenv").config();

const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app
  .get("/", (req, res) => res.send("Hello world!"))
  .listen(port, () => console.log(`Example app listening on port ${port}!`));
