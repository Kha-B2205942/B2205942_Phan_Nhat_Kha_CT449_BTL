const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = {
  client,
  getDb: (dbName = "QuanLyMuonSach") => client.db(dbName)
};
