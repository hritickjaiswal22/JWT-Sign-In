const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

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

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await User.create({
      username,
      password: encryptedPassword,
    });

    console.log(result);

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

app.listen(9999);
