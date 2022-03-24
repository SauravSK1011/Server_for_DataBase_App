const mongoose = require("mongoose");
const DB =process.env.DB;

mongoose
  .connect("mongodb+srv://ssk:sauravsk@cluster0.jwwkv.mongodb.net/mernstack?retryWrites=true&w=majority", {
  })
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });