const { MongoClient } = require("mongodb");

async function connectDB() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    return client;
}

module.exports = connectDB; 