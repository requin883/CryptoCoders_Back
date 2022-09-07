let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');


exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   
   let client = await connectDB()
   const colUsers = client.db().collection('users');
  

   if (method == "GET") {

      let { email } = p;
      try {

         let user = await colUsers.find({ email }).toArray();
         let flag;
         if (user.length == 0) { flag = 0 } else { flag = 1 }
         return output(flag);

      } catch (error) {log(error);}
   }
}