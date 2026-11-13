if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
// console.log(process.env); //to access env key-value process.env

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const { MongoStore } = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//setting up connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // wanderlust is DB name
const dbUrl=process.env.ATLASDB_URL

//calling main function
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json()); // to parse json data from request body
app.use(express.urlencoded({extended: true}));
// app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);  // to include ejs-mate module
app.use(express.static(path.join(__dirname,"public"))); //to use styling from public folder, if we want to use same styling in all views no need to change in all views,just update in biolerplate code

const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("Error in MONGO SESSION STORE",err);
});

//session options
const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()* 7*24*60*60*1000,   
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
}

// root api
// app.get("/", (req, res) => {
//   res.send("hi i am root");
// });


//middleware
app.use(session(sessionOptions))
app.use(flash())

//user authentication using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // using passport-local-mongoose plugin to authenticate user
//authenticate() -> generates a function that is used to authenticate users using their username and password, generates fun tat is used in passport local strategy to authenticate user, it will check if username and password are correct or not

passport.serializeUser(User.serializeUser()); // serializeUser() -> generates a function that is used to serialize user, it will store user id in session
passport.deserializeUser(User.deserializeUser()); // deserializeUser() -> generates a function that is used to deserialize user, it will get user id from session and find user in DB

//middleware for displaying flash msg
app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  // console.log(res.locals.success)
  res.locals.currUser=req.user; // since in navbar.ejs we cant directly access req.user, using local (currUser) we can do it
  next();
})



app.use("/listings", listingRouter); // using listings router for all routes starting with /listings
app.use("/listings/:id/reviews", reviewRouter); // using reviews router for all routes starting with /listings/:id
app.use("/", userRouter); // using user router for all routes starting with /user

app.use((req,res,next)=>{    //for all other invalid redirects which are not defined
  next( new ExpressError(404, "Page Not Found") );
})   

//middleware for error handling
app.use((err, req, res, next) => {
  let {statusCode=500, message = "Something went wrong!"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
})


app.listen(8080, () => {
  console.log("server listening to port 8080");
});



// this is just for testing sample data
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 5000,
//     location: "Bangalore, Karnataka",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful with testing");
// });