const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
// .. => Since going to parent directory
const listingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New Route
router.get("/new",isLoggedIn , listingController.renderNewForm);
 // New route Show route se upper rhega nhi to show route new route ko ek
// id samjega and properly work nhi krega

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updatListing))
.delete(
        isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing)
);

    // //Index Route
    // router.get("/", wrapAsync(listingController.index));
    
    // //New Route
    // router.get("/new",isLoggedIn , listingController.renderNewForm);
    
    // //Show Route
    // router.get("/:id", wrapAsync(listingController.showListing));
    
    // //Create Route
    // router.post("/",
    // isLoggedIn,
    // validateListing,
    // wrapAsync(listingController.createListing));
    
    //Edit Route
    router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));
    
    // //Update Route
    // router.put(
    //     "/:id",
    //     isLoggedIn,
    //     isOwner,
    //     validateListing, 
    //     wrapAsync(listingController.updatListing));
    
    // //Delete Route
    // router.delete(
    // "/:id",
    // isLoggedIn,
    // isOwner, 
    // wrapAsync(listingController.destroyListing));

module.exports=router;
