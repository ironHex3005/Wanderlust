const mongoose = require("mongoose");
const { data } = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  newData = data.map((obj) => ({ ...obj, owner: "67fe03fe74344009c6d91d94" }));

  await Listing.insertMany(newData);
};

initDB();
