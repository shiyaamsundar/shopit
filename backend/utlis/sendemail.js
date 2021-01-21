const nodemailer = require('nodemailer');


const sendEmail=async options=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:' 17tucs221@skct.edu.in', 
          pass: 'shiyaam123456789',
        },
      });
  
      const mailOptions = {
        from : '17tucs221@skct.edu.in',
        to : options.email,
        subject : options.subject,
        text: options.message
      };
  
     await  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}

module.exports=sendEmail