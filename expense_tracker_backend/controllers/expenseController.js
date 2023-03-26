const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const downloadExpense = require("../models/expenseDownloadModel");
const sequelize = require("../util/database");

const S3Service = require("../services/s3services");
const UserServices = require("../services/userservices");

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction(); //unmanged transaction
  try {
    const expenseamount = req.body.expsenseAmount;
    const description = req.body.description;
    const category = req.body.category;

    const insertData = await Expense.create(
      {
        expenseamount: expenseamount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    //console.log(insertData);

    const oldAmount = req.user.totalExpense;
    const newAmount = parseFloat(oldAmount) + parseFloat(expenseamount);
    //console.log(newAmount);
    const updateUser = await User.update(
      { totalExpense: newAmount },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    await t.commit();
    //throw new Error();
    res
      .status(201)
      .json({ message: "Expense Added", data: insertData.toJSON() });
  } catch (error) {
    if (t) {
      await t.rollback();
      res.status(401).json({ error: "Expense Not Added",success:false});
    }

    console.log(error);
  }
};



exports.getExpense = async (req, res, next) => {
  try {
    
    const page =+ req.query.page || 1;
    
    const ITEMS_PER_PAGE = Number(req.query.expenseNumber) || 10;
    console.log(req.query.expenseNumber);
    
    let countExpenses;
    
    const expenseData = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      offset: (page-1)*ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE
    });
    
    countExpenses = expenseData.count;
    res.status(200).json({
      expenses:expenseData.rows,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE * page < countExpenses,
      nextPage:page + 1,
      hasPreviousPage:page > 1,
      previousPage:page - 1,
      lastPage:Math.ceil(countExpenses/ITEMS_PER_PAGE)
    })

  } catch (error) {
    console.log(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction(); //unmanged transaction
  try {
    const expenseId = req.params.id;
    //console.log(expenseId);

    const expenseDetails = await Expense.findOne({
      where: { id: expenseId },
      transaction: t,
    });
    const expenseamount = parseFloat(expenseDetails.expenseamount);

    const oldAmount = req.user.totalExpense;
    const newAmount = parseFloat(oldAmount) - parseFloat(expenseamount);
    //console.log(newAmount);
    const updateUser = await User.update(
      { totalExpense: newAmount },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    const deleteData = await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    await t.commit();
    //throw new Error();
    res.status(200).json({ message: "Deleted successfully",success:true});
  } catch (error) {
    if (t) {
      await t.rollback();
      res.status(404).json({ message: "record not found",success:false});
    }
    console.log(error);
  }
};



exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const isPremiuemuser = await User.findOne({ where: { id: userId } });

    if (isPremiuemuser.ispremiumuser) {
      const expenses = await UserServices.getExpenses(req);
      const stringifiedExpenses = JSON.stringify(expenses);
      //console.log(stringifiedExpenses);
      const filename = `Expense${userId}/${new Date()}.txt`;
      
      const fileURL = await S3Service.uploadToS3(stringifiedExpenses,filename);
      //console.log(fileURL);

      const databaseAddDetails = await downloadExpense.create({expenseurl:fileURL,userId:userId});
      //console.log(databaseAddDetails);

      const allDownloadRecords = await downloadExpense.findAll(
        {
          attributes: [
            "expenseurl",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("createdAt"),
                "%Y-%m-%d %H:%i:%s"
              ),
              "createdAt",
            ],
          ],
        },
        { where: { userId: userId } }
      );
      
      
      res.status(201).json({ data: allDownloadRecords, success: true });
      //res.status(201).json({fileURL,success:true});
      //res.status(201).json({message:"Download Link Generated"});
    } else {
      res.status(401).json({ message: "User is not Authorized",success:false});
    }
  } catch (error) {
    console.log(error);
    //res.status(500).json({ fileURL: "", success: false, error: error });
    res.status(500).json({ fileURL: "", success: false});
  }
};
