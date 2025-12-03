const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/QuanLyMuonSach",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "my-secret-key-for-quanlymuonsach",
  }
};

module.exports = config;
