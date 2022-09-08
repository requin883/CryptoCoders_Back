const connectDB = require('../connectDB/connectDB');
const { output } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter, accountVerOpt } = require('../../Utils/nodemailer');
const connectCollection = require('../../Utils/connectCollection');


exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;
    
    const colUsers = await connectCollection('users');

    if (method == "POST" || method == "OPTIONS") {
        try {
            
            const userExists = await colUsers.findOne({email:p.email});

            if(userExists){
                return{
                    statusCode:403,
                    body:JSON.stringify({message:"User exists"})
                }
            }

            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(p.password, salt);

            const userToken = jwt.sign({
                email: p.email,
                password: p.password
            }, process.env.JWT_SECRET,
                { expiresIn: "1h" });
            const user = await colUsers.insertOne({

                email: p.email,
                names: p.names,
                lastnames: p.lastnames,
                address: p.address,
                password: hash,
                verify: false,
                verToken: userToken

            });

            const verLink = `${process.env.FRONT_URI}/activate-account/${userToken}`;

            transporter.sendMail(accountVerOpt(p, verLink));

            return ({
                statusCode: 200,
                body: JSON.stringify({ user })
            })

        } catch (error) {

            console.log(error)
        }

    }

}
