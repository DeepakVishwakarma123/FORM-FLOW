
import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config({path:"\.env"})


//add original smtp server address to work with it
const transporter = nodemailer.createTransport({
  host: process.env.host,
  port: process.env.port,
  secure: true,
  auth: {
    user: process.env.user,
    pass: process.env.Password
  },
});

 




async function sendmail(htmlString) {
  const options = {
  from: process.env.fromemail,
  to: 'thisis@example.com',
  subject: 'new client reached',
  html: htmlString,
};
    try {
        let result=await transporter.sendMail(options);
        console.log("🤣 maile sended",result);
        
    } catch (error) {
        console.log("somethign happened",error);   
    }
}


export default sendmail