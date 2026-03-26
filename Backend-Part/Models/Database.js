require('dotenv').config();
const mongoose = require('mongoose');

const mongo = process.env.MONGO;

mongoose.connect(mongo, { family: 4 })  // ← add here
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    console.log("Database: auth-db");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error("Connection String:", mongo);
    process.exit(1);
  });

module.exports = mongoose;