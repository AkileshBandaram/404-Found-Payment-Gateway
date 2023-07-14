const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dynamoose = require("dynamoose");
require("dotenv").config();
const aws = dynamoose.aws.sdk;
aws.config.update({
  accessKeyId: process.env.AK,
  secretAccessKey: process.env.SAK,
  region: process.env.REGION,
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// ARDEMOS ROUTES
const PaymentRoute = require("./api/routes/payment");
// END Of ARDEMOS ROUTES
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/payment", PaymentRoute);
app.use((req, res, next) => {
  const error = new Error("Route Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;