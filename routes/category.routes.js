const router = require("express").Router();
const Category = require("../models/Category.model");
const mongoose = require("mongoose");

// GET /categories/:catId
router.get("/categories/:catId", (req, res) => {
    const { catId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Category.findById(catId)
      .then((category) => {
        console.log("Retrieved category ->", category);
        res.json(category);
      })
      .catch((error) => {
        console.error("Error while retrieving category ->", error);
        res.status(500).send({ error: "Failed to retrieve category" });
      });
  });

// GET /categories
router.get("/categories", (req, res) => {
    console.log(req.payload)
    Category.find({ userId: req.payload._id })
        .then((category) => {
            console.log("retrived category", category)
            res.json(category)
        })
        .catch((err) => {
            console.log(err, "error retrieving category")
            res.status(500).json({ message: "Error retrieving category" })
        })
})

// POST /categories
router.post("/categories", (req, res) => {
    const { userId, catName } = req.body;
    const newCategory = { userId, catName };

    Category.create(newCategory)
        .then(() => {
            res.json(newCategory)
        })
        .catch((err) => {
            console.log(err, "error creating category")
            res.status(500).json({ message: "Error creating category" })
        })

})

// PUT /categories/:catId
router.put("/categories/:catId", (req, res, next) => {
    const { catId } = req.params
    const { userId, catName } = req.body;
    const newRequestBody = { userId, catName };

    Category.findByIdAndUpdate(catId, newRequestBody, { new: true })
        .then((updatedCategory) => {
            res.status(200).json(updatedCategory)
        })
        .catch((err) => {
            next(err)
        })
})

// DELETE /categories/:catId
router.delete("/categories/:catId", (req, res, next) => {
    const { catId } = req.params;
    Category.findByIdAndDelete(catId)
        .then(() => {
            res.status(204).json( {message: "Category deleted"})
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router;