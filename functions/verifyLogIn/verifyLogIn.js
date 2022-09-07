const { output } = require("../../utils");
let connectDB = require('../connectDB/connectDB');
let bcrypt = require('bcrypt')


exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;


    let client = await connectDB()
    const colUsers = client.db().collection('users');

    if(method == "GET"){

        
        let flag;
        let { email, password } = p;
        let user = await colUsers.find({ email}).toArray();
        let flagPassword= await bcrypt.compare(password,user[0].password)

        if(flagPassword){flag=1} else {flag==0}
        
        return output(flag)

    }

}