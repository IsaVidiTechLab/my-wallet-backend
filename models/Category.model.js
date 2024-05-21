const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    catName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

const Category = model('Category', categorySchema);
module.exports = Category;