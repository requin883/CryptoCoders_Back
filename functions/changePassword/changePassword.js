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

       try {
           
        let { email,oldPassword, newPassword } = p;
        let user = await colUsers.find({ email }).toArray();

        if (oldPassword == user[0].password){

            await colUsers.updateOne({ email }, {$set:{password:newPassword}});
            return output(1)
        } else { return output(0)}

         

      } catch (error) {console.log(error);}
   }
}