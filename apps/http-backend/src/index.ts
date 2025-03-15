import express from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "./config";


const app = express();

app.post('/signup',(req, res)=>{
   //apply zod validation here
})


app.post('/signin',(req, res)=>{
   
    const userid = 1;
    jwt.sign({
        userid
    }, JWT_SECRET)
})



app.listen(3001);