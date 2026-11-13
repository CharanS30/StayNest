const User=require("../models/user");
//create signup form
module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//signup logic
module.exports.signup=async (req,res)=>{
    try{
        let {username, email,password}= req.body;
        const newUser=new User({username,email});
        const registeredUser= await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err)=>{  // auto login when sign up
            if (err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");  
        }); 
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


//create login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

//login logic
module.exports.login=async (req,res,next)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); //in passport , when ever u do login, passport by default reset redirectUrl, hence store it in locals( they can be accessed anywhere, passport cant delete it)
};

//logout logic
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ //err is a callback function, while logging out if it fails(may be due to passport middleware not working) then what to do, sets req.user to undefined
        if (err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};