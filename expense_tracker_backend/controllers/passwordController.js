const sequelize = require('../util/database');

const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDING_BLUE_API_KEY;


exports.forgotPassword = async(req,res,next)=>{
    try{
       
        

        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email:'kazisyeef@gmail.com',
            name:'Kazi'
        }
        const receivers = [
            {
                email:req.body.email,
            }
        ]

        const sendMail = await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:"Reset Password at Expense Tracker",
            textContent:`Reset Password at Expense Tracker for email {{params.email}}`,
            htmlContent:`<h1>Expense Tracker App</h1>
            <a href="https://google.com">Visit</a>`,params:{
                email:req.body.email
            }
        });
        if(sendMail){
            //console.log(sendMail);
            res.status(200).json({message:"Reset Email Link Sent To Your Email"});
        }else{
            return res.status(401).json({message: 'Reset Email  Unsuccesful'});
        }

    }catch(error){
        console.log(error);
    }
}