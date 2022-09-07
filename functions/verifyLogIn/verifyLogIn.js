const { output } = require("../../utils");
let connectDB = require('../connectDB/connectDB');
let bcrypt = require('bcrypt')

//output: 0→ input password doesnt match user database password
//output: 1→ email exists and password is valid
//output: 2→ email doesnt exist

//independientemente se mostrará contraseña o email incorrecto sea 0 o 2

exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;



    let client = await connectDB()
    const colUsers = client.db().collection('users');

    if(method == "GET"|| method=="OPTIONS"){

        
        let { email, password } = p;
        let user = await colUsers.find({ email}).toArray();
        if (user.length==0){return output(2)}
        let flagPassword= await bcrypt.compare(password,user[0].password)
        return output(Number(flagPassword))

    }

}