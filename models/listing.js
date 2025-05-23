const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const wrapAsync = require("../utils/wrapAsync.js");

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  img: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post(
  "findOneAndDelete",
  wrapAsync(async (listing) => {
    if (listing) {
      let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
  })
);
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
