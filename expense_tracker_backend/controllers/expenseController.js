const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");




exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();    //unmanged transaction
    try {
        const expenseamount = req.body.expsenseAmount;
        const description = req.body.description;
        const category = req.body.category;



        const insertData = await Expense.create({
            expenseamount: expenseamount,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction: t });
        //console.log(insertData);


        const oldAmount = req.user.totalExpense;
        const newAmount = parseFloat(oldAmount) + parseFloat(expenseamount);
        //console.log(newAmount);
        const updateUser = await User.update({ totalExpense: newAmount }, {
            where: {
                id: req.user.id,
            },
            transaction: t
        });

        await t.commit();
        //throw new Error();
        res.status(201).json({ message: "Eepense Added", data: insertData.toJSON() });



    } catch (error) {
        if (t) {
            await t.rollback();
            res.status(401).json({ error: "Eepense Not Added" });
        }

        console.log(error);
    }
};

// exports.deleteExpense = async(req,res,next)=>{
//     try{
//         console.log(req.params);
//     }
//     catch(error){
//         console.log(error);
//     }
// }

exports.getExpense = async (req, res, next) => {
    try {

        const expenseData = await Expense.findAll({ where: { userId: req.user.id } });
        if (expenseData) {
            //console.log(req.user.ispremiumuser);
            res.status(200).json({ message: "Data Found", data: expenseData });
        }
    }
    catch (error) {
        console.log(error);
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();    //unmanged transaction
    try {
        const expenseId = req.params.id;
        //console.log(expenseId);


        const expenseDetails = await Expense.findOne({ where: { id: expenseId } ,transaction:t});
        const expenseamount = parseFloat(expenseDetails.expenseamount);


        const oldAmount = req.user.totalExpense;
        const newAmount = parseFloat(oldAmount) - parseFloat(expenseamount);
        //console.log(newAmount);
        const updateUser = await User.update({ totalExpense: newAmount }, {
            where: {
                id: req.user.id
            },
            transaction:t
        });

        const deleteData = await Expense.destroy({ where: { id: expenseId, userId: req.user.id },transaction:t });

        await t.commit();
        //throw new Error();
        res.status(200).json({ message: "Deleted successfully" });
       
            
        
    }
    catch (error) {
        if(t){
            await t.rollback();
            res.status(404).json({ message: "record not found" });
        }
        console.log(error);
    }

};


//   exports.isPremiuemUser = (req,res,next)=>{
//     try{
//         //console.log(req.user.ispremiumuser);
//         res.status(200).json({ isPremiumuser:req.user.ispremiumuser});

//     }catch(error){
//         console.log(error);
//     }

//   };