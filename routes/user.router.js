
const { Router } = require("express")
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const userRouter = Router();
const jwt = require("jsonwebtoken")
require("dotenv").config();


// user/signup
userRouter.post("/signup", async (req, res) => {
    console.log(req.body)
    const {email, password} = req.body;
    const userPresent = await UserModel.findOne({email})
    
    if(userPresent?.email){
        return res.send("User already exist");
    }
    else{
        try{
            bcrypt.hash(password, 4, async function(err, hash) {
                const user = new UserModel({email,password:hash})
                await user.save()
                res.send("Sign up successfull")
            });
           
        }
       catch(err){
            console.log(err)
            res.send("Something went wrong, pls try again later")
       }
    }
    
})

// user/login
userRouter.post("/login", async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email})

        if(!user) {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        const isPassMatch = await bcrypt.compare(password, user[0].password);
        if(!isPassMatch) {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        const token = jwt.sign({ userID:  user[0]._id}, process.env.KEY, {
            expiresIn: "7d"
        });

        res.status(200).json({Success: true, message: "Login Success","token" : token})

    }
    catch{
        res.send("Something went wrong in Login, please try again later")
    }
})


module.exports = { userRouter }


