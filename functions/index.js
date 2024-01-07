const express = require("express");
const serverless = require("serverless-http")
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("../payment");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/.netlify/functions/api",paymentRoutes)

const port = process.env.PORT || 8000;
app.listen(port,()=>{console.log(`Listening to port ${port}`)});
module.exports.handler=serverless(app)