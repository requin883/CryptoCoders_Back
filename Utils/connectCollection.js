const connectDB = require('../functions/connectDB/connectDB');

async function connectCollection(collection){

let client = await connectDB()
const newCollection = client.db().collection(collection);

return newCollection

}

module.exports = connectCollection