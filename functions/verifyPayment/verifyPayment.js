let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');
const { Spot } = require('@binance/connector')

exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   
   
   let client = await connectDB()
   const colUsers = client.db().collection('users');
  
   if (method == "OPTIONS"){ return output('hola')}

   if (method == "POST"  ) {
    
      let { email} = p;
      try {
         
         //GETTING USER PAYMENTS
         let user = await colUsers.find({ email }).toArray();
         let userData = user[0];
         //let pagos= userData.payments;

         // BINANCE TOKENS
         const apiKey = 'tnRIEcXVqPJDo6zM1fMjO8F2mc1DkuEGanpPmOHW0zeQsHPZWNJtgTPwzZ86Z0b5'
         const apiSecret = 'MtM0sNU2D8wgZ0XIIjhuV716SGV2iaE4naXzVOOToapdAEUvT01birqoRmcv0gYu'
         const client = new Spot(apiKey, apiSecret)


         let call = await client.payHistory({startTime:'1660177197000'})
        
                let flagFound = false;
                let {year,month,day,hours,minutes,seconds, quantity} = p;

                let date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`)
                let timestamp = date.getTime();
                
                let i=0,index=0;
                let payments=call.data.data;

                
                let admin = await colUsers.find({ email:'jesusdaniolob@gmail.com' }).toArray();
                let adminData = admin[0];

                let totalPaymentsLen=adminData.payments.length;
                let j=0;

                for(;j<totalPaymentsLen;j++){
                  if(adminData.payments[j].timestamp==timestamp && adminData.payments[j].quantity==quantity){return output(3)}
                }
                
                do{
                  
                  if(payments[i].transactionTime==timestamp && Number(payments[i].amount=quantity)){index=i; flagFound=true};
                  i++;

                }while(flagFound==false)

                  
                
                
                if(flagFound==false){return output(0)} // no se consiguió la transferencia
               
                let flagCurrency=true;
                
                if(payments[index].currency !='USDT' && payments[index].currency !='BUSD'  && payments[index].currency !='BNB' ){flagCurrency=false; return output(2)};
                
                if(flagCurrency == true && flagFound==true){
                  
                  
                  adminData.payments.push({timestamp:timestamp, quantity:quantity})
                  await colUsers.updateOne({email:'jesusdaniolob@gmail.com'},{$set:{payments:adminData.payments }})

                  userData.deposits.push(payments[index])
                  userData.balance+=Number(payments[index].amount)
                   await colUsers.updateOne({email:email},{$set:{deposits:userData.deposits, balance:userData.balance}})
                  return output(1)

                }

         

      } catch (error) {console.log(error);}


   }
}