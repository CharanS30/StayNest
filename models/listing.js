const mongoose = require("mongoose");
const schema = mongoose.Schema;

// defining the schema
const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    //setting default value
    default:
      "https://unsplash.com/photos/an-aerial-view-of-a-beach-with-boats-in-the-water-bS6bgSp1f64",
    set: (v) =>  // set for user when sending no image url
      v === ""
        ? "https://unsplash.com/photos/an-aerial-view-of-a-beach-with-boats-in-the-water-bS6bgSp1f64"
        : v,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
