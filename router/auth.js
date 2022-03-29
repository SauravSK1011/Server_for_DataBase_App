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
  const { name, email, phone, work, passward, cpassward, address } = req.body;
  if (
    (!name || !email || !phone || !work || !passward || !cpassward, !address)
  ) {
    res.status(412).send("Fill all fields");
  }
  try {
    const userexist = await User.findOne({ email: email });
    if (userexist) {
      return res.status(422).send({ errer: "User Already Exist" });
    }
    if (passward != cpassward) {
      return res.status(422).send({ errer: "Password does not matched" });
    }

    const user = new User({
      name,
      email,
      phone,
      work,
      passward,
      cpassward,
      address,
    });

    const usersaved = await user.save();
    if (usersaved) {
      res.status(201).send("Account Created");
    }
  } catch (e) {
    res.status(404).send("Error" + e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, passward } = req.body;

    let ismatch = false;
    if (!email || !passward) {
      res.status(422).send("Fill all fields");
    }
    const userexist = await User.findOne({ email: email });
    if (!userexist) {
      return res.status(422).send("Invalid credentials");
    } else {
      try {
        ismatch = await bcrypt.compare(passward, userexist.passward);
      } catch (e) {
        console.log(e);
      }

      if (ismatch) {
        const token = await userexist.generatetoken();
        res.cookie("Token", token, {
          httpOnly: true,
        });

        userexist.tokens = userexist.tokens.concat({ token: token });
        await userexist.save();

        return res.status(201).json({ Massage: "Welcome", Data: userexist });
      } else {
        return res.status(401).send("Invalid credentials");
      }
    }
  } catch (e) {
    res.send(e);
  }
});
router.post("/update", async (req, res) => {
  const { name, email, phone, work } = req.body;
  if (!name || !email || !phone || !work) {
    res.status(412).send("Fill all fields");
  }
  try {
    const userexist = await User.findOne({ email: email });
    const result = await User.findByIdAndUpdate(
      { _id: userexist._id },
      {
        $set: {
          name: name,
          phone: phone,
          work: work,
        },
      }
    );
    const updateduser = await User.findOne({ email: email });
    return res.status(201).json({ Massage: "Update Done", Data: updateduser });

  } catch (e) {
    res.status(404).send("Error" + e);
  }
});
router.post("/addaddress", async (req, res) => {
  try {
    const { email, address } = req.body;
    if (!email || !address) {
      res.status(422).send("Fill all fields");
    }
    const userexist = await User.findOne({ email: email });
    try {
      const result = await User.findByIdAndUpdate(
        { _id: userexist._id },
        {
          $set: {
            address: address,
          },
        }
      );
      const updateduser = await User.findOne({ email: email });
      return res.status(201).json({ Massage: "Done", Data: updateduser });

    } catch (e) {
      console.log(e);

      return res.status(401).json({ Massage: "ERROR", Data: userexist });
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

module.exports = router;
