const express = require("express");
const BookModel = require("../model/book.model")
const bookRouter = express.Router();

bookRouter.post("/addBook", async(req,res) => {
    const data = req.body
    try{
        const user = new BookModel(data)
        await user.save()
        res.status(200).send({"msg": "New Book is added."})
    }catch(error){
        console.log(error);
        res.status(404).send({"msg": "Fail to add new book."})
    }
})

bookRouter.get("/books", async (req, res) => {
    try {
        const { user_id } = req.query;
        const user = await UserModel.findById(user_id);
        let allBooks = [];
        if (user.role.includes('VIEW_ALL')) {
            allBooks = await BookModel.find();
        } else if (user.role.includes('VIEWER')) {
            allBooks = await BookModel.find({ user_id });
        }
        res.status(200).send(allBooks);
    } catch (error) {
        res.status(404).send({ error: 'Internal Server Error' });
    }
});

// bookRouter.get("/viewall", async (req,res) => {
//     try{
        
//     }
// })

bookRouter.patch("/updateBook/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const data = req.body
        const updateBook = await BookModel.findByIdAndUpdate({_id: id}, data);
        res.status(200).send({ msg: "Book updated successfully." });
    }catch(error){
        res.status(404).send({ msg: 'Internal Server Error' });
    }
})

bookRouter.delete("/deleteBook/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const deletedBook = await BookModel.findByIdAndDelete(id);
        res.status(200).send({ msg: "Book deleted successfully." });
    }catch(error){
        res.status(404).send({ msg: 'Internal Server Error' });
    }
});

module.exports = bookRouter