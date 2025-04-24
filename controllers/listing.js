const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing is unavailable");
    res.redirect("/listings");
  } else {
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let result = listingSchema.validate(req.body);

  let url = req.file.path;
  let filename = req.file.filename;
  let { listing } = req.body;

  const list = new Listing(listing);
  list.owner = req.user;
  list.img = { url, filename };
  list.geometry = response.body.features[0].geometry;
  await list.save();
  req.flash("success", "New Listing Created.");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing is unavailable");
    res.redirect("/listings");
  } else {
    let originalImageUrl = listing.img.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/h_300,w_250/e_blur:200"
    );

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  console.log(1);
  console.log(req.body);

  let { id } = req.params;
  let updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updated.img = { url, filename };
    await updated.save();
  }
  req.flash("success", "Listing Edited");
  console.log(updated);
  res.redirect(`/listings/${id}`);
};
