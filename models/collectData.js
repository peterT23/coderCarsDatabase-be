const csv = require("csvtojson");
const fs = require("fs");
const mongoose = require("mongoose");
const Car = require("./Car.js");
require("dotenv").config();
const localMongoURI = process.env.MONGO_URI;
const atlasMongoURI = process.env.ATLASMONGO_URI;

mongoose.set("strictQuery", true); // Sửa đổi cảnh báo strictQuery
const csvFilePath = "./data.csv";

const collectCars = async () => {
  try {
    //data from csv to json
    let carDatas = await csv().fromFile(csvFilePath);
    // collect and format data
    const collectedCarData = carDatas.map((carData) => {
      return {
        make: carData.Make,
        model: carData.Model,
        release_date: parseInt(carData.Year),
        transmission_type: carData["Transmission Type"].toUpperCase(),
        size: carData["Vehicle Size"],
        style: carData["Vehicle Style"],
        price: parseInt(carData.MSRP),
        isDeleted: false,
      };
    });

    const totalCars = collectedCarData.length;

    let returnCarData = {
      data: collectedCarData,
      totalCars,
    };

    //write data to local file
    fs.writeFileSync("db.json", JSON.stringify(returnCarData));

    return returnCarData;
  } catch (error) {
    console.error(error);
  }
};

//save data to mongodb compass (local database)
const saveDataToDb = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected ${uri}`);

    //save data to database
    let carData = fs.readFileSync("db.json", "utf-8");
    carData = JSON.parse(carData);
    await Car.insertMany(carData.data);
  } catch (error) {
    console.log(error);
  } finally {
    //Close the connection when done
    mongoose.connection.close();
  }
};

// saveDataToDb(localMongoURI);
saveDataToDb(atlasMongoURI);
