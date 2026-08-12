
import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config({path:"\.env"})


//add original smtp server address to work with it
const transporter = nodemailer.createTransport({
  host: process.env.host,
  port: 465,
  secure: true,
  auth: {
    user: process.env.demouser,
    pass: process.env.pass
  },
});

 




async function sendmail(htmlString,receiverEmailId) {
  const options = {
  from: "notify@formsave.store",
  to: `${receiverEmailId}`,
  subject: 'new submission',
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