const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


//signup route
router.route("/signup")
.get( userController.renderSignUpForm)  
.post( wrapAsync(userController.signup)); 


//login route
router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.login);// passport.authenticate() -> middleware that generates a function that is used to authenticate users using their username and password, it will check if username and password are correct or not and present in DB and failureflash to send a flash msg.


//logout route
router.get("/logout", userController.logout);

module.exports=router;

// //signup route
// router.get("/signup",userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.signup));


// login route
// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.login);// passport.authenticate() -> middleware that generates a function that is used to authenticate users using their username and password, it will check if username and password are correct or not and present in DB and failureflash to send a flash msg.
