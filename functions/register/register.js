const connectDB = require("../connectDB/connectDB");
const { output } = require("../../utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
//const { transporter, accountVerOpt } = require('../../Utils')
exports.handler = async (event) => {
  let { httpMethod: method, queryStringParameters: p } = event;

  let client = await connectDB();
  const colUsers = client.db().collection("users");

  if (method == "OPTIONS") {
    return output("hola");
  }

  if (method == "POST") {
    try {

        let {email}=p
      let userData = await colUsers.find({ email }).toArray();
      
      
      if (userData.length == 0) {


            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(p.password, salt);

            const userToken = jwt.sign(
                {
                    email: p.email,
                    password: p.password,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
                );

                
            const user = await colUsers.insertOne({
            email: p.email,
            names: p.names,
            lastnames: p.lastnames,
            address: p.address,
            password: hash,
            verify: false,
            verToken: userToken,
            saldo: 0,
            });

            

            const transporter = nodeMailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PW,
            },
            });

            const accountVerOpt = (user, verLink) => {
            let { email, names } = user;
            return {
                from: "CryptoCoders",
                to: email,
                bbc: process.env.NODEMAILER_USER,
                subject: `Confirmacion de tu cuenta de CrytoCoders`,
                html: `<h2>${names}! Para poder activar la cuenta por favor ingresa en el siguiente link <a href=${verLink}>Activar cuenta</a></h2>`,
            };
            };

            const verLink = `${process.env.FRONT_URI}/activate-account/${userToken}`;

            transporter.sendMail(accountVerOpt(p, verLink));

            console.log('1')
            return output(1)

      } else {//está registrado
      
        var expiredFlag=false;
        try {
            let decoded = jwt.verify(userData[0].verToken,process.env.JWT_SECRET)
            
        } catch (error) {
            
            expiredFlag=true
        }
        //if (Date.now() >= decoded.exp * 1000) {expiredFlag=true}
        console.log(expiredFlag)
        
        if (userData[0].verify == false) {// registrado, pero no verificó el correo

                if(expiredFlag==true){ // registrado, pero no verificó el correo y el token se venció (ya pasó 1h)

                    let salt = await bcrypt.genSalt(10);
                    let hash = await bcrypt.hash(p.password, salt);
        
                    const userToken = jwt.sign(
                    {
                        email: p.email,
                        password: p.password,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                    );
        
                    const user = await colUsers.updateOne({email:p.email},{$set:
                    {names: p.names,
                    lastnames: p.lastnames,
                    address: p.address,
                    password: hash,
                    verify: false,
                    verToken: userToken,
                    saldo: 0,}
                    });
        
                    const transporter = nodeMailer.createTransport({
                    service: "gmail",
                    port: 587,
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PW,
                    },
                    });
        
                    const accountVerOpt = (user, verLink) => {
                    let { email, names } = user;
                    return {
                        from: "CryptoCoders",
                        to: email,
                        bbc: process.env.NODEMAILER_USER,
                        subject: `Confirmacion de tu cuenta de CrytoCoders`,
                        html: `<h2>${names}! Para poder activar la cuenta por favor ingresa en el siguiente link <a href=${verLink}>Activar cuenta</a></h2>`,
                    };
                    };
        
                    const verLink = `${process.env.FRONT_URI}/activate-account/${userToken}`;
        
                    transporter.sendMail(accountVerOpt(p, verLink));
                    console.log('2')
                    return output(2)

                } else {

                    console.log('3')
                    return output(3)
                }
            
                

        } else {
            console.log('4')
            return output(4)
        }

        
      }
    } catch (error) {
      console.log(error);
    }
  }
};
