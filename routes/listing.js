const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // INDEX ROUTE
  .get(wrapAsync(listingController.index))
  // CREATE ROUTE
  .post(
    validateListing,
    isLoggedIn,
    upload.single("listing[img]"),

    wrapAsync(listingController.createListing)
  );

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

//  EDIT PAGE ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  // DELETE ROUTE
  .post(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
  // SHOW ROUTE
  .get(wrapAsync(listingController.showListing))
  // UPDATE ROUTE
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[img]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );

module.exports = router;
