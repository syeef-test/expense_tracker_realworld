const sequelize = require("../util/database");

const User = require("../models/userModel");
const forgotPassword = require("../models/forgotPasswordModel");

const bcrypt = require("bcryptjs");

const uuid = require("uuid");

const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDING_BLUE_API_KEY;

exports.forgotPassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        //console.log(req.body.email);
        const userDetails = await User.findOne({
            where: { email: req.body.email },
            transaction:t
        });

        const uuid_data = uuid.v4();
        const createRequest = await forgotPassword.create({ id: uuid_data, userId: userDetails.id },{ transaction: t });

        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: process.env.SENDER_EMAIL,
            name: process.env.SENDER_NAME,
        };
        const receivers = [
            {
                email: req.body.email,
            },
        ];

        await t.commit();   //above tra worked send email

        const link = `<a href='http://127.0.0.1:3000/password/resetpassword/${uuid_data}'>Click Here</a>`;
        const sendMail = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset Password at Expense Tracker",
            htmlContent: `<h1>Expense Tracker App</h1>
        <p>Click here to reset your password</p>
        ${link}`,
            params: {
                email: req.body.email,
            },
        });

        

        if (sendMail) {
            //console.log(sendMail);
            res.status(200).json({ message: "Reset Email Link Sent To Your Email",success:true});
        }

    } catch (error) {
        if (t) {
            await t.rollback();
            return res.status(401).json({ message: "Reset Email  Unsuccesful , No User exist with this email Id",success:false});
        }
        console.log(error);
    }
};

exports.checkPasswordLinkStatus = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        //console.log(req.params.uuid);
        const uuid = req.params.uuid;
        const data = await forgotPassword.findOne({
            where: { id: uuid },
            transaction:t
        });
        //console.log(data);
        if (data) {
            
            //console.log("link active",data.isactive);
            if (data.isactive) {
                const a = await forgotPassword.update(
                    { isactive: false },
                    { where: { id: uuid },transaction: t },
                );
                //console.log(a);
                await t.commit();
                res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="http://127.0.0.1:3000/password/updatepassword/${uuid}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
                res.end();
            }
        }
    } catch (err) {
        if (t) {
            await t.rollback();
            res.status(401).json({ message: "No Email Link Send",success:false});
        }
        console.log(err);
    }
};
exports.updatepassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
       const newpassword = req.query.newpassword;
       const reqpasswordid = req.params.resetpasswordid;

       const forgotpasswordData = await forgotPassword.findOne({where:{id:reqpasswordid},transaction:t});
       if(forgotpasswordData){
            const userData = await User.findOne({where:{id:forgotpasswordData.userId},transaction:t});
            if(userData){
                const saltrounds = 10;
                bcrypt.hash(newpassword, saltrounds, async (err, hash) => {
                    const updateUserData = await User.update({password: hash},{where:{id:userData.id},transaction:t});
                    await t.commit();
                    res.status(201).json({message: 'Successfuly update the new password',success:true});
                });
            }else{
                return res.status(404).json({ error: 'No user Exists', success: false});
            }
       }
    } catch (err) {
        if (t) {
            await t.rollback();
            return res.status(403).json({ message:'Some error occured please try again leter', success: false } );
        }
       
        console.log(err);
    }
};
