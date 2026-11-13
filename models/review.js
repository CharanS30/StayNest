const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type: schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Review", reviewSchema);
                                //name of model is Review and schema is reviewSchema, so mongoose will create collection name as reviews in DB
                                // one to many relationship between listing and review, so we will add reference of review in listing schema, so that we can populate reviews in listing when we fetch listing from DB