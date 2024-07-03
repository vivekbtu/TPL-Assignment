const express = require("express");
const cors = require("cors")


const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.router");
const {projectRouter} = require("./routes/project.router");
const { Authentication } = require("./middleware/authentication");

const app = express();
app.use(express.json())
app.use(cors({
    origin : "*"
}))

require("dotenv").config();

app.get("/",(req,res)=>{
    res.send("Welcome to Our App")
})
app.use("/user",userRouter)

app.use(Authentication)

app.use("/project",projectRouter)

 
const PORT = process.env.PORT
app.listen(PORT,async()=>{
    try{
        await connection
        console.log(`Listening  http://localhost:${PORT}`)
    }
    catch(err){
        console.log(err)
    }
})