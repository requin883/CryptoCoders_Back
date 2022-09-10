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
    
      let { email, paymentReference } = p;
      try {
         
         //GETTING USER PAYMENTS
         let user = await colUsers.find({ email }).toArray();
         let userData = user[0];
         //let pagos= userData.payments;

         // BINANCE TOKENS
         const apiKey = 'tnRIEcXVqPJDo6zM1fMjO8F2mc1DkuEGanpPmOHW0zeQsHPZWNJtgTPwzZ86Z0b5'
         const apiSecret = 'MtM0sNU2D8wgZ0XIIjhuV716SGV2iaE4naXzVOOToapdAEUvT01birqoRmcv0gYu'
         const client = new Spot(apiKey, apiSecret)


          let call = {

            data: [ {
                
                    
                code: '000000',
                message: 'success',
                data: [
                  {
                    orderType: 'C2C',
                    transactionId: 'C_P_144702781155115009',
                    transactionTime: 1645219283603,
                    amount: '-140',
                    currency: 'USDT',
                    walletType: 2,
                    fundsDetail: [Array]
                  }
                ],
                success: true
              
                
            },

            {
                
                    
                    code: '000000',
                    message: 'success',
                    data: [
                      {
                        orderType: 'C2C',
                        transactionId: 'xd',
                        transactionTime: 1645219283603,
                        amount: '600',
                        currency: 'USDT',
                        walletType: 2,
                        fundsDetail: [Array]
                      }
                    ],
                    success: true
                  
                    
                },

                {
                    
                        
                        code: '000000',
                        message: 'success',
                        data: [
                          {
                            orderType: 'C2C',
                            transactionId: 'zd',
                            transactionTime: 1645219283603,
                            amount: '500',
                            currency: 'USDT',
                            walletType: 2,
                            fundsDetail: [Array]
                          }
                        ],
                        success: true
                      
                        
                    }]
          }

          
          
                


                let flagFound = false;
                
                let transferLen = call.data.length;
                let i=0,index=0;
                
                for(;i<transferLen;i++){

                  if(call.data[i].data[0].transactionId==paymentReference){index=i; flagFound=true};
                  
                }
                
                if(flagFound==false){return output(0)} // no se consiguió la transferencia
               
                let flagCurrency=true, flagState=true;
                if(call.data[index].success!=true){flagState=false};
                if(call.data[index].data[0].currency !='USDT' || call.data[index].data[0].currency !='BUSD'){flagCurrency=false};
                
                if(flagCurrency == false || flagState==false){

                  userData.payments.push(call.data[index])
                  userData.balance+=Number(call.data[index].data[0].amount)
                   await colUsers.updateOne({email:email},{$set:{payments:userData.payments, balance:userData.balance}})
                  return output(1)

                }

         return output(call.data[index]);

      } catch (error) {console.log(error);}


   }
}