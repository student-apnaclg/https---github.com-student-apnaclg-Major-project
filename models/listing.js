const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
title: {
    type: String,
    required: [true,"Title is required"],
},
description: String,
image: {
    filename:String,
    url:String,  
},
price: Number,
location: String,
country: String,
reviews:[
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    },
geometry:{
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
},
// category:{
//     type:String,
//     enum:["Trending","Rooms","Iconic cities","Mountains","Castle","Amazing pools","Beachfront","New","Camping","Farms","Arctic"]
// }
});

// Listing Schema ke ander hi Post Mongoose Middleware ko create
//  Krenge jisse listing ke sat sat Reviews bi delete ho jay

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;