const express = require("express");
const UserModel = require("../model/user.model")
const userRouter = express.Router();
const auth = require("../middleware/auth.middleware")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistedTokenModel = require("../model/blacklisted.model");

userRouter.post("/register", async(req,res) => {
    const {username,email,password,role} = req.body
    try{
        bcrypt.hash(password,10,async function(err,hash){
            if(err){
                res.status(404).send({"msg": "Something went wrong."})
            }else{
                const user = new UserModel({username,email,password:hash,role})
                await user.save()
                res.status(200).send({"msg": "New user has been registerd."})
            }
        })
    }catch(error){
        res.status(404).send({"msg": "Registration is failed."})
    }
})

userRouter.post("/login", async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await UserModel.findOne({email});
        if(user){ 
            bcrypt.compare(password,user.password,function(err,result){
                if(err){
                    res.status(404).send({"msg": "Something went wrong."})
                }if(result){
                    let accessToken = jwt.sign({email: user.email,username: user.username, role: user.role},"masai",{expiresIn: "15s"})  
                    let refreshToken = jwt.sign({email: user.email,username: user.username, role: user.role},"masaischool",{expiresIn: "1d"}) 
                    let userRole = user.role
                    res.status(200).send({"msg": "Login successfully.","accessToken": accessToken,"refreshToken": refreshToken, "userRole": userRole, "userId": user._id}) 
                }else{
                    res.status(404).send({"msg": "Wrong password."})
                }
            })
            
        }else{
            res.status(200).send({"msg": "Wrong crendentails or you need to login first."}) 
        }
    }catch(error){
        console.log(req.user);
        res.status(404).send({"msg": "Login is failed."});
    }
})

userRouter.get("/logout", async(req,res) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        await BlacklistedTokenModel.create({ token });
        res.status(200).send({ "msg": "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).send({ "msg": "Internal Server Error" });
    }
})

module.exports = userRouter
