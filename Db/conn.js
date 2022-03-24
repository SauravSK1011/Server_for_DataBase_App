const mongoose = require("mongoose");
const DB =process.env.DB;

mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });