const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const userScama = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  work: {
    type: String,
    required: true,
  },
  passward: {
    type: String,
    required: true,
  },
  cpassward: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userScama.pre("save", async function (next) {
  console.log("Hi");
  // if (!this.isModified('password')) {  console.log("Hi")
  // return next();}

  this.passward = await bcrypt.hash(this.passward, 12);
  this.cpassward = await bcrypt.hash(this.cpassward, 12);
  // }
  next();
});
userScama.methods.generatetoken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens=this.tokens.concat({token:token});
    await this.save();
    return token;
  } catch (e) {console.log(e)}
};
const User = mongoose.model("USER", userScama);
module.exports = User;
