const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

// defining the schema
const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner:{
    type: schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});

listingSchema.post("findOneAndDelete", async (listing) => { //post middleware to delete all reviews associated with a listing when the listing is deleted
  if (listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
