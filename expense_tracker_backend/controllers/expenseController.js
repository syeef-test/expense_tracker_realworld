const Expense = require("../models/expenseModel");

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
    if(insertData){
        res.status(201).json({ message: "Eepense Added", data: insertData.toJSON() });
    }else{
        res.status(401).json({ error: "Eepense Not Added"});
    }

  } catch (error) {
    console.log(error);
  }
};

exports.deleteExpense = async(req,res,next)=>{
    try{
        console.log(req.params);
    }
    catch(error){
        console.log(error);
    }
}

exports.getExpense = async (req, res, next) => {
    try{
        
       const expenseData = await Expense.findAll({where:{userId:req.user.id}});
       if(expenseData){
        console.log(expenseData);
        res.status(200).json({ message: "Data Found", data: expenseData });
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
