let { output } = require('../../utils');
const connectCollection = require('../../Utils/connectCollection');


exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   const colUsers = connectCollection('users');

   if (method == "OPTIONS") {
      return output('hola')
   }

   if (method == "POST") {

      let { email } = p;
      try {

         await colUsers.updateOne({ email }, { $set: { password: p.password } });

         return output(1);

      } catch (error) { console.log(error); }
   }
}