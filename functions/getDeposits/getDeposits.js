let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');


exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   
   let client = await connectDB()
   const colUsers = client.db().collection('users');
  
   if (method == "OPTIONS"){
      return output('hola')
   }

   if (method == "GET"  ) {

      let { email } = p;
      try {

         let user = await colUsers.find({ email }).toArray();
         return output(user[0].deposits);

      } catch (error) {console.log(error);}
   }
}