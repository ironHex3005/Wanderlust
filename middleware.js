let Listing = require("./models/listing.js");
let Review = require("./models/review.js");

const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  return next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission to edit ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, rid } = req.params;
  let review = await Review.findById(rid);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission to delete ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// VALIDATION MIDDLEWARE FOR ADDING NEW LISTING
module.exports.validateListing = (err, req, res, next) => {
  if (err) {
    let { error } = listingSchema.validate(req.body);
    let { message } = error;
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

module.exports.validateReview = (err, req, res, next) => {
  if (err) {
    let { error } = reviewSchema.validate(req.body);
    let { message } = error;
    throw new ExpressError(400, message);
  } else {
    next();
  }
};
