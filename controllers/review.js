const Listing= require("../models/listing");
const Review=require("../models/review");

//create Review
module.exports.createReview=async (req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author= req.user._id;

  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();

  // console.log("new review added");
  // res.send("new review added");
  
  req.flash("success","New review Created");
  res.redirect(`/listings/${listing._id}`);
}

//deleteReview  
module.exports.destroyReview=async (req,res)=>{
  let {id, reviewId}= req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull operator to remove reviewId from reviews array in listing
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}