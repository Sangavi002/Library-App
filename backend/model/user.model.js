const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    role: {type: [String], required: true, enum: ['CREATOR', 'VIEWER', 'VIEW_ALL']},
},{
    versionKey: false,
    timestamps: true
})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel