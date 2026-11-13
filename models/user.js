const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new schema({
    email:{
        type: String,
        required: true,
        unique: true,
    }
    // not defining username and password as we will use passport-local-mongoose plugin to handle authentication and it will add username and password fields to the schema automatically
});

userSchema.plugin(passportLocalMongoose); // adding passport-local-mongoose plugin to userSchema to handle authentication
// this will create field , username , hashingpassword and salt automatically in userSchema and also add methods to userSchema to handle authentication
// lt automatically in userSchema and also add methods to userSchema to handle authentication
module.exports = mongoose.model("User", userSchema);