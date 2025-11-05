const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });

module.exports = { client };
