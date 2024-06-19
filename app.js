const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const { AppError, sendResponse } = require("./helpers/utils");
require("dotenv/config");
// const mongoURI = process.env.MONGO_URI;
const atlasMongoURI = process.env.ATLASMONGO_URI;

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MONGODB
// mongoose.connect(process.env.MONGO_URI, () => {
// 	console.log('Connected to Database!');
// });

// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log(`DB connected ${mongoURI}`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
mongoose
  .connect(atlasMongoURI)
  .then(() => {
    console.log(`DB connected ${atlasMongoURI}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", indexRouter);
//check wrong router
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
