const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "bernarditasaleforce@gmail.com", //generated ethereal user
            pass: "fllpelkxclonbkhy", //generated ethereal pasword
        },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com.com>', // sender address
        to: data.to, //list of receivers
        subject: data.subject, //Subject line
        text: data.text, // Plain text body
        html: data.html // html body
    });

    console.log("Mensage sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //Preview only available sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

});

module.exports = sendEmail;