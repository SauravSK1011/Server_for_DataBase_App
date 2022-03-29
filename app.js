const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

app.use(express.json());
dotenv.config({ path: "./config.env" });

app.use(require("./router/auth"));
const port = process.env.PORT || 3000;

require("./Db/conn");
app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`Started on port: ${port}`);
});
