const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse, AppError } = require("../helpers/utils.js");
mongoose.set("strictQuery", false);

const carController = {};

carController.createCar = async (req, res, next) => {
  const info = req.body;

  try {
    // YOUR CODE HERE
    //always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request", "Create Car Error");
    //mongoose query
    const created = await Car.create(info);
    sendResponse(res, 200, true, { data: created }, null, "Create Foo Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  const filter = {};

  try {
    // YOUR CODE HERE
    const { page, limit } = req.query;
    console.log("page", page, limit);
    const skip = (page - 1) * limit;

    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const documents = await Car.countDocuments({ isDeleted: false });
    const total = Math.ceil(documents / limit);
    sendResponse(res, 200, true, {
      message: "Get Car List Successfully!",
      cars,
      page,
      total,
    });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  const options = { new: true };
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  //you will also get updateInfo from req
  // empty target and info mean update nothing

  try {
    // YOUR CODE HERE
    const { id: targetId } = req.params;
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;

    const cars = await Car.findByIdAndUpdate(targetId, req.body, {
      new: true,
    });
    sendResponse(res, 200, true, {
      message: "Update Car List Successfully!",
      cars,
    });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

  // empty target mean delete nothing

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    // YOUR CODE HERE
    const { id: targetId } = req.params;
    const cars = await Car.findByIdAndDelete(targetId, options);
    sendResponse(res, 200, true, {
      message: "Delete Car List Successfully!",
      cars,
    });
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
