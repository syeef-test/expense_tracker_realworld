const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.addExpense = async (req, res, next) => {
  try {
    const expenseamount = req.body.expsenseAmount;
    const description = req.body.description;
    const category = req.body.category;

    const insertData = await Expense.create({
        expenseamount:expenseamount,
        description:description,
        category:category,
        userId:req.user.id
    });
    console.log(insertData);

    const userDetails = await User.findOne({where:{id:req.user.id}});
    const oldAmount = userDetails.totalExpense;
    const newAmount = parseFloat(oldAmount)+parseFloat(expenseamount);
    //console.log(newAmount);
    const updateUser = await User.update({totalExpense:newAmount},{
        where:{
            id:req.user.id
        }
    });

    if(insertData){
        res.status(201).json({ message: "Eepense Added", data: insertData.toJSON() });
    }else{
        res.status(401).json({ error: "Eepense Not Added"});
    }

  } catch (error) {
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
    try{
        
       const expenseData = await Expense.findAll({where:{userId:req.user.id}});
       if(expenseData){
        //console.log(req.user.ispremiumuser);
        res.status(200).json({ message: "Data Found", data: expenseData});
       }
    }
    catch(error){
        console.log(error);
    }
}

exports.deleteExpense = async(req, res, next) => {
    try{
        const expenseId = req.params.id;
        //console.log(expenseId);
        

        const expenseDetails  = await Expense.findOne({where:{id:expenseId}});
        const expenseamount = parseFloat(expenseDetails.expenseamount);

        const userDetails = await User.findOne({where:{id:req.user.id}});
        const oldAmount = userDetails.totalExpense;
        const newAmount = parseFloat(oldAmount)-parseFloat(expenseamount);
        //console.log(newAmount);
        const updateUser = await User.update({totalExpense:newAmount},{
            where:{
                id:req.user.id
            }
        });

        const deleteData = await Expense.destroy({where:{id:expenseId,userId:req.user.id}});
        
        if(deleteData){
            res.status(200).json({ message: "Deleted successfully" });
        }else{
            res.status(404).json({ message: "record not found" });
        }
    }
    catch(error){
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