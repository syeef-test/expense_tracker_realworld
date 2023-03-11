const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Razorpay = require('razorpay');

const Order = require('../models/orderModel');


exports.purchasepremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: "rzp_test_N0VU6kdK6Yy6Fy",
            key_secret: "8V0skZ0cfaKmgFfo9z3EIlCH"
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
        const { payment_id, order_id } = req.body;
        console.log(payment_id, order_id);


        // Order.findOne({ where: { orderid: order_id } }).then(order => {

        //     order.update({where:{ paymentid: payment_id, status: 'SUCCESFUL' }}).then(() => {
        //         req.user.update({ ispremiumuser: true }).then(() => {
        //             return res.status(202).json({ success: true, message: 'Transaction Succesful' });
        //         }).catch((err) => {
        //             throw new Error(err);
        //         });
        //     }).catch(err => {
        //         throw new Error(err);
        //     });
        // }).catch(err=>{
        //     throw new Error(err);
        // });

        const order = await Order.findOne({ where: { orderid: order_id } });
        if (order !== null) {
            const [orderData, userData] = await Promise.all([
                Order.update({ status: 'SUCCESFUL', paymentid: payment_id }, { where: { orderid: order_id } }),
                req.user.update({ ispremiumuser: true })
            ]);

            // console.log("order:",orderData);
            // console.log("user:",userData);
            if (orderData !== null && userData !== null) {
                return res.status(202).json({ success: true, message: 'Transaction Succesful' });
            }



        }




    } catch (err) {
        throw new Error(err);
    }
}