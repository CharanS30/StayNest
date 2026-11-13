const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema }=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController= require("../controllers/listing.js")
const multer = require('multer');
const {storage}= require("../cloudConfig.js");
// const upload = multer({dest: 'uploads/'}) //where to store all files coming from form, creates folder auto , this is local storage(not much feisable)
const upload = multer({storage});

router.route("/") //mapping all route with same path but different methods like get, post
.get(wrapAsync(listingController.index))  //index route
.post(isLoggedIn,  //create route
      validateListing, // calling validateListing function to validate the data before saving in DB
      upload.single("listing[image]"),
      wrapAsync(listingController.createListing));


//NEW route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync( listingController.showListing)) //show route
.put( isLoggedIn, isOwner, //update route
  upload.single("listing[image]"),
  validateListing, // calling validateListing function to validate the data before saving in DB
  wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;


// //Index Route
// router.get("/", wrapAsync(listingController.index));  



//show route
// router.get("/:id", wrapAsync( listingController.showListing));

// //Create Route
// router.post("/", isLoggedIn,
//       validateListing, // calling validateListing function to validate the data before saving in DB
//       wrapAsync(listingController.createListing));



//Update Route
// router.put("/:id", isLoggedIn, isOwner, 
//   validateListing, // calling validateListing function to validate the data before saving in DB
//   wrapAsync(listingController.updateListing));


//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

