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

   if (method == "POST"  ) {

      let { email } = p;
      try {

          await colUsers.updateOne({ email }, {$set:{password:p.password}});

         return output(1);

      } catch (error) {console.log(error);}
   }
}