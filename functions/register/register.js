let connectDB = require ('../connectDB/connectDB')
let { output } = require('../../utils')
let bcrypt = require('bcrypt')


exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
     } = event;


    let client = await connectDB()
    const colUsers = client.db().collection('users');

    if(method == "POST"){
    
            try {
             
             let salt = await bcrypt.genSalt(10);
             let hash = await bcrypt.hash(p.password, salt)
                
             await colUsers.insertOne({ 
                    
                    email:p.email,
                    names:p.names,
                    lastnames: p.lastnames,
                    address: p.address,
                    password:hash,
                    verify:false
                    
            })

            return output(1)
                
                
            } catch (error) {
                
                console.log(error)
            }
            
        

        


            
    }

}
