const nodemailer = require("nodemailer");

exports.sendEmail = async (message, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.smtpemail,
                pass: process.env.smtppasskey,
            },
            tls: {
                rejectUnauthorized: false
            }

        })

        const info = {
            from: process.env.smtpemail,
            to: email,
            subject: "Welcome to SMIT MAIL SERVICE",
            html: `
        <h1>${message}</h1>
        <p>your otp is : ${otp}</p>   
        `

        }

        transporter.sendMail(info, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                
            }
        })

    }
    catch (e) {
        console.log(e)
    }

}