const { client } = require("./utils/mongodb.util");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await client.connect();
    console.log(" Connected to the database!");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error(" Failed to connect to the database!", err);
    process.exit(1);
  }
}

start();
