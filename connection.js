const  mongoose = require("mongoose");

// mongoose.set("strictQuery",true)
module.exports.connectDB=async function connectDB(url){
   return await mongoose.connect(url)
}