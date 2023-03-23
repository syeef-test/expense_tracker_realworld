const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController');



const Razorpay = require('razorpay');

const Order = require('../models/orderModel');


exports.purchasepremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({
                    order, key_id: rzp.key_id
                });
            }).catch(err => {
                throw new Error(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong in cont', error: err });
    }
};

exports.updateTransaction = async (req, res, next) => {
    try {
        const { payment_id, order_id, error_code } = req.body;
        //console.log(payment_id, order_id, error_code);

        const userId = req.user.id;

        const order = await Order.findOne({ where: { orderid: order_id } });
        if (order !== null) {
            if (error_code === null || error_code === undefined) {

                const promise1 = Order.update({ status: 'SUCCESFUL', paymentid: payment_id }, { where: { orderid: order_id } });
                const promise2 = req.user.update({ ispremiumuser: true });

                Promise.all([promise1, promise2]).then(() => {
                    return res.status(202).json({ success: true, message: 'Transaction Succesful',token:userController.generateAccessToken(userId,undefined,true)});
                }).catch(error => {
                    throw new Error(error);
                })

            } else {
                const orderData = await Order.update({ status: 'FAILED', paymentid: payment_id }, { where: { orderid: order_id } });
                return res.status(401).json({ success: false, message: 'Transaction Unsuccesful' });
            }

        }

    } catch (err) {
        throw new Error(err);
    }
}