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

      let { sender,receiver, quantity } = p;
      try {
          
          let userReceiver = await colUsers.find({ email:receiver }).toArray();
          if (userReceiver.length == 0) { return output(0) } 
          let userReceiverData = userReceiver[0];
          
          let userSender = await colUsers.find({ email:sender }).toArray();
          let userSenderData = userSender[0];

          if(userSenderData.balance < quantity){return output(1)}
         
          if(sender==receiver){return output(2)}
        userReceiverData.balance+=Number(quantity)
        userSenderData.balance-=Number(quantity)
         
        await colUsers.updateOne({email:receiver},{$set:{ balance:userReceiverData.balance}})
        await colUsers.updateOne({email:sender},{$set:{ balance:userSenderData.balance}})
        
        return output(3)
      } catch (error) {console.log(error);}
   }
}