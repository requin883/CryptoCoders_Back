const jwt = require('jsonwebtoken');
const connectCollection = require('../../Utils/connectCollection');

exports.handler = async (event) => {
    let { httpMethod: method, queryStringParameters: p } = event;
    let { token } = p;
    const colUsers = connectCollection('users');

    try{
    if (method == "GET"){
        if (!token){
            return({
                statusCode:403,
                body:JSON.stringify({message:"No se recibió el token"})
            })
        }
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return({
                statusCode:403,
                body:JSON.stringify({message:"No se recibió el token"})
            })
        }
        
        const email = decoded.email;

        colUsers.updateOne({email},{$set:{verify:true}});

        return({
            statusCode:200,
            body:JSON.stringify({message:"Cuenta verificada"})
        })

    }
    }catch(err){
        console.log(err);
    }


}