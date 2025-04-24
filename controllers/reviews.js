let Listing = require("../models/listing.js");
let Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let { review } = req.body;

  let listing = await Listing.findById(id);

  let newReview = new Review(review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.rid);

  await Listing.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.rid },
  });

  res.redirect(`/listings/${req.params.id}`);
};
