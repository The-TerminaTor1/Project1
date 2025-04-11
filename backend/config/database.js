const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    const mongoURI =
      "mongodb+srv://admin1:admin1@cluster0.te9ltpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToMongo;