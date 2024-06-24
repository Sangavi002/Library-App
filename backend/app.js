const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/db");
const userRouter = require("./route/user.route");
const BookModel = require("./model/book.model")
const UserModel = require("./model/user.model")
const cors = require('cors');
const bookRouter = require("./route/book.route");

const app = express();
const port= process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type'], 
}));

app.use("/user",userRouter);
app.use("/book",bookRouter);

app.get('/books', async (req, res) => {
    const { old, new: isNew, user_id } = req.query;
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const user = await UserModel.findById(user_id);
    let allBooks = [];

    let filterDict = {};

    try {
        if (old) {
            filterDict['createdAt'] = { $lte: tenMinutesAgo };
        } else if (isNew) {
            filterDict['createdAt'] = { $gt: tenMinutesAgo };
        }

        if (user.role.includes('VIEW_ALL')) {
            allBooks = await BookModel.find(filterDict);
        } else if (user.role.includes('VIEWER')) {
            filterDict['user_id'] = user_id;
            allBooks = await BookModel.find(filterDict);
        } 
        res.status(200).send(allBooks);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});

app.listen(port,async() => {
    try{
        await connection
        console.log(`Server is running on port ${port} and db is connected.`)
    }catch(err){
        console.log(err);
    }
})