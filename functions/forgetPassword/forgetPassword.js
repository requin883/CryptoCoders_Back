const connectCollection = require('../../Utils/connectCollection');
const jwt = require('jsonwebtoken');
const {transporter, resetPwOptions } = require('../../Utils/nodemailer');

exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;

    const colUsers = await connectCollection('users');

    if (method == "POST" || method == "OPTIONS") {
        try {

            let {email} = p;

            const userExists = await colUsers.findOne({email});

            if(!userExists){
                return{
                    statusCode:403,
                    body:JSON.stringify({message:"User doesn't exist"})
                }
            }

            const resetToken = jwt.sign(
                {email,pw:userExists.password},
                process.env.JWT_SECRET,
                {expiresIn:"15m"});

            await colUsers.updateOne({email:email},{$set:{resetToken}});

            const resetLink = `${process.env.FRONT_URI}/reset-password/${resetToken}`;

            transporter.sendMail(resetPwOptions(userExists,resetLink));
            
            return ({
                statusCode: 200,
                body: JSON.stringify({userExists})
            })

        } catch (error) {

            console.log(error);
        }

    }

}