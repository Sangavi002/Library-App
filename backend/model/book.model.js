const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: {type:String, required:true},
    author: {type:String, required:true},
    genre: {type:String, required:true},
    price: {type: Number, required: true},
    user_id: {type: String, required: true},
},{
    versionKey: false,
    timestamps: true
})

const BookModel = mongoose.model("book", bookSchema);

module.exports = BookModel