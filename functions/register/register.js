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

    if(method == "OPTIONS"){

        return output('hola')
    }

    if (method == "POST") {

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


            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PW
                }
            });
            
            const accountVerOpt = (user, verLink) => {
                let { email, names } = user;
                return {
                    from: "CryptoCoders",
                    to: email,
                    bbc: process.env.NODEMAILER_USER,
                    subject: `Confirmacion de tu cuenta de CrytoCoders`,
                    html: `<h2>${names}! Para poder activar la cuenta por favor ingresa en el siguiente link <a href=${verLink}>Activar cuenta</a></h2>`
                }
            };


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
