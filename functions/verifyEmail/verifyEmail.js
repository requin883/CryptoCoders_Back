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

    if(method == "GET"){

        let flag;
        let { email } = p;
        let user = await colUsers.find({ email}).toArray();

        if(user[0].verify==false){flag=0} else { flag =1}
        return output(flag)

    }

    if(method == "POST"){

        let flag;
        let { email } = p;
        let user = await colUsers.find({ email}).toArray();

        if(user[0].verify==false){flag=0} else { flag =1}
        return output(flag)

    }

}