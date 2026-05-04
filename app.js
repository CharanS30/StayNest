const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");


//setting up connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // wanderlust is DB name

//calling main function
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
// app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);  // to include ejs-mate module
app.use(express.static(path.join(__dirname,"public"))); //to use styling from public folder, if we want to use same styling in all views no need to change in all views,just update in biolerplate code

// root api
app.get("/", (req, res) => {
  res.send("hi i am root");
});

//Index Route
app.get("/listings", async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//NEW route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs",{listing});

});

//Create Route
app.post("/listings",async (req,res)=>{
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

//Update Route
app.put("/listings/:id", async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
})


//Delete Route
app.delete("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
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
