const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        requires:true,
    },
    description:String,
    image:{
        type:String,
        set:(v) =>
        v === ""
        ? "https://www.istockphoto.com/photo/bedroom-in-the-modern-empty-hotel-room-gm1282963974-380533782?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fbedroom&utm_medium=affiliate&utm_source=unsplash&utm_term=bedroom%3A%3A%3A"
        : v,
    },
    price:number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;