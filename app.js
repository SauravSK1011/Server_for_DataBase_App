const dotenv=require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
dotenv.config({path:'./config.env'})

app.use(require('./router/auth'))
// const corsOptions = {
//   origin: "http://localhost:3000",

//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const port=process.env.PORT||3000;


require("./Db/conn")
app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`Started on port: ${port}`);
});
