const { output } = require("../../utils");
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

    if(method == "POST"){

        ;
        let { token } = p;
        let user = await colUsers.find({ verToken:token}).toArray();
        let userData= user[0];

        if(user.length==0){return output(0)}

        if(userData.verify==true){return output(1)}

        userData.verify=true;
        await colUsers.updateOne({verToken:token},{$set:{verify:userData.verify}})

        return output(2)
        
        

    }


}