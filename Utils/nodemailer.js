const { createTransport } = require("nodemailer");

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PW
    }
});

const resetPwOptions = (user, resetLink) => {
    let { email, names } = user;
    return {
        from: "CryptoCoders",
        to: email,
        bbc: process.env.NODEMAILER_USER,
        subject: `Reinicio de contraseña`,
        html: `<h2>${names}!Para poder cambiar tu contraseña por favor ingresa en el siguiente link <a href=${resetLink}>Reiniciar Contraseña</a></h2>`
    }
};

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

module.exports = { transporter, resetPwOptions ,accountVerOpt };