const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const app = express();

//* Using midllewares
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

//* Connecting to mongodb
mongoose
  .connect("mongodb://localhost:27017/jwtLogin", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongodb connected"));

//* POST route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (password < 6) {
    return res.json({
      status: "Error",
      description: "Password must greater than 6 characters",
    });
  }

  if (username === "" || typeof username !== "string") {
    return res.json({
      status: "Error",
      description: "Username must be a String",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await User.create({
      username,
      password: encryptedPassword,
    });

    res.json({ message: "Success" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: error, description: "Already a user exist" });
    }
    res.json({ message: error });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({
      status: "Error",
      description: "Invalid username/password",
    });
  }

  if (await bcrypt.hash(password, user.password)) {
    const token = jwt.sign(
      {
        // * This token is public
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    return res.json({ status: "OK", data: token });
  }

  return res.json({ status: "Error" });
});

app.post("/api/changePassword", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.json({ status: "Error", error });
  }

  res.json({ status: "OK" });
});

app.listen(9999);
