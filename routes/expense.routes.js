const router = require("express").Router();
const Expense = require("../models/Expense.model")
const mongoose = require("mongoose");

// GET /expenses/:expenseId

router.get("/expenses/:expenseId", (req,res) => {
    const {expenseId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

    Expense.findById(expenseId)
    .then((expense)=> {
        console.log("Retrived Expense", expense)
        res.json(expense)
    })
    .catch((err)=> {
        console.log("Error while fetching Expense", err)
        res.status(500).send({err:"Failed to retrived Expense"})
    })
})


// GET /expenses/

router.get("/expenses", (req, res) => {
    console.log(req.payload);

    Expense.find({userId:req.payload._id})
    .then((expenses)=> {
        console.log("Retrived Expenses", expenses)
        res.json(expenses)
    })
    .catch((err)=> {
        console.log("Error while fetching Expenses", err)
        res.status(500).send({err:"Failed to retrived Expenses"})
    })
})

// POST /expenses/

router.post("/expenses", (req, res) => {

    const {
        title,
        amount,
        date,
        catId,
        description,
        userId
    } = req.body;

    const newExpense = {
        title,
        amount,
        date,
        catId,
        description,
        userId
    }

    Expense.create(newExpense)
        .then(()=>{
            res.json(newExpense)
        })
        .catch((err)=>{
            console.log("Error while creating Expense",err)
            res.status(500)
        })
})

// PUT /expenses/:expenseId

router.put("/expenses/:expenseId", (req,res,next) => {
    const { expenseId } = req.params;

    const {
        title,
        amount,
        date,
        catId,
        description,
        userId
    } = req.body;

    const newExpense = {
        title,
        amount,
        date,
        catId,
        description,
        userId
    }

    Expense.findByIdAndUpdate(expenseId, newExpense , {new:true})
    .then((updatedExpense)=>{
        res.status(200).json(updatedExpense)
    })
    .catch((err)=>{
        next(err);
    })
})

// DELETE /expenses/:expenseId

router.delete("/expenses/:expenseId", (req,res,next)=>{
    const { expenseId } = req.params;

    Expense.findByIdAndDelete(expenseId)
    .then(() => {
        res.status(204).json( {message: "Expense deleted"})
    })
    .catch((err) => {
        next(err)
    })
})


router.get('/expenses/total/:year', async (req, res) => {
    const { year } = req.params;

  try {
    // Debug: Log the year parameter
    console.log(`Fetching expenses for the year: ${year}`);

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59); // Include the whole last day of the year

    // Debug: Log the date range
    console.log(`Date range: ${startDate} - ${endDate}`);

    // Aggregate the total expenses per month
    const expenses = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Debug: Log the aggregation result
    console.log('Aggregated expenses:', expenses);

    // Format the result to include all months
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthData = expenses.find(e => e._id === i + 1);
      return {
        month: i + 1,
        totalAmount: monthData ? monthData.totalAmount : 0
      };
    });

    // Debug: Log the final result
    console.log('Formatted result:', result);

    res.status(200).json(result);
  } catch (error) {
    // Debug: Log the error
    console.error('Error fetching total expenses:', error);
    res.status(500).json({ message: 'Error fetching total expenses', error });
  }
  });

  router.get('/expenses/:year/:month', async (req, res) => {
    const { year, month } = req.params;
  
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
  
      // Fetch expenses for the specified month and year
      const expenses = await Expense.find({
        date: {
          $gte: startDate,
          $lt: endDate
        }
      });
  
      // Calculate the total expense amount
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
      res.status(200).json({ totalAmount, expenses });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Error fetching expenses', error });
    }
  });

module.exports = router;