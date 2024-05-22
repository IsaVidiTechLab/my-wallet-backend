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

module.exports = router;