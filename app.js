if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session=require("express-session");
// express-session can use and work only on devlopment level, 
// but not on production level for Production level use connect-mongo
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL; // database URL

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

// For Connect to Mongo(dbUrl -> ke throw mongoose connect krega pr
//  local system se nhi balki ATLAS Database se connect krega)
async function main() {
await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,// 7 days in miliseconds
        maxAge:7*24*60*60*1000,
        httpOnly:true,// For security purpose
    },
};

// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
//     });



app.use(session(sessionOptions));
app.use(flash());
//Flash ko route se phele use krna h(kuki flash ko route ki help se use krnge)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");// require directly in boilerplate(in flash.ejs)
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);// /listings jha pr bi aayaga wha pr hm apni listing ko use krenge
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing", async (req, res) => {
// let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
// });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found!"));
});

app.use((err,req,res,next)=>{
    // sabse phele error message ko deconstruct krenge
    let{statusCode = 500,message = "something went wrong!!"}=err;
    res.status(statusCode).render("error.ejs" ,{message});
    // res.status(statusCode).send(message);
    // res.send("Something went wrong!");
});

app.listen(8080, () => {
console.log("server is listening to port 8080");
});