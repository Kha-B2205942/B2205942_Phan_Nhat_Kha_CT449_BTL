const app = require("./app");
require('dotenv').config(); // Tải các biến môi trường từ tệp .env
const config = require("./config/index.js");
const MongoDB = require("./utils/mongodb.util");

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Connected to the database!");

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}` );
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}
startServer();
