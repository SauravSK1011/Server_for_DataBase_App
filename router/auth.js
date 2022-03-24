const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/userSchama");
require("../Db/conn");

router.get("/", (req, res) => {
  res.send("Hello This is Home Page");
});

router.get("/about", (req, res) => {
  res.send("This is about Page");
});

router.get("/contact", (req, res) => {
  res.send("This is contact Page");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, passward, cpassward } = req.body;
  if (!name || !email || !phone || !work || !passward || !cpassward) {
    res.status(422).send("Fill all fields");
  }
  try {
    const userexist = await User.findOne({ email: email });
    // console.log(userexist.email);
    if (userexist) {
      return res.status(422).send({ errer: "User Already Exist" });
    }
    if (passward != cpassward) {
      return res.status(422).send({ errer: "Password does not matched" });
    }

    const user = new User({ name, email, phone, work, passward, cpassward });

    const usersaved = await user.save();
    if (usersaved) {
      res.status(201).send("Account Created");
    }
  } catch (e) {}
});
router.post("/login", async (req, res) => {
  try {
    const { email, passward } = req.body;
    if (!email || !passward) {
      res.status(422).send("Fill all fields");
    }
    const userexist = await User.findOne({ email: email });
    if (!userexist) {
      return res.status(422).send({ errer: "Invalid credentials" });
    } else {
      const ismatch = bcrypt.compare(passward, userexist.passward);
      const token = await userexist.generatetoken();
      res.cookie("Token", token, {
        httpOnly: true,
      });
      if (ismatch) {
        return res.status(201).send({ massage: "Welcome" });
      } else {
        return res.status(401).send({ errer: "Invalid credentials" });
      }
    }
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;
