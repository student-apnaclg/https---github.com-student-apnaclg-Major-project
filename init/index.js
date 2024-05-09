const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// Basic connection code
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
await mongoose.connect(MONGO_URL);
}

// Initializing Database(and Sabse phele isa clean krenge agar isme koi data phele se h to)
const initDB = async () => {
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"6634773e123a3482d1c8f32f"}));
await Listing.insertMany(initData.data);
console.log("data was initialized");
};

initDB();

