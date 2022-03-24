const dotenv=require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
dotenv.config({path:'./config.env'})

app.use(require('./router/auth'))

const port=process.env.port;

require("./Db/conn")
app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`Started on port: ${port}`);
});
