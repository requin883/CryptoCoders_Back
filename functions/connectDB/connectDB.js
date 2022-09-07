const {MongoClient} = require("mongodb");

let url = 'mongodb+srv://cryptocoders:cryptocoders@cluster0.o2sbqjl.mongodb.net/?retryWrites=true&w=majority';

async function connectDB() 
{
const client = new MongoClient(url);
await client.connect();
return client;
}

module.exports = connectDB; 