import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/src/index";
import { middleware } from "./middleware";
import {CreateUserSchema, signInSchema, CreateRoomSchema} from "@repo/common/src/types";
import {prismaClient} from  "@repo/db/src/index"; 



 const app = express();

 app.post("/signup", (req, res) => {
    
     const parsedData = CreateUserSchema.safeParse(req.body);

     if(!parsedData.success){
         res.status(400).json(
          {
            message: "Incorrect Inputs"
          }
         );
         return;
     }
    
     try {

       //creating a user here....
     prismaClient.user.create({
      data:{
          email: parsedData.data?.username,
          password: parsedData.data?.password,
          name: parsedData.data?.name,
      }
     })

    //db call
     res.json({
        userId: "123"
     })
     } catch (error) {
    res.status(411).json({
      message: "User already exist"
    });
     }


 })

  app.post("/signin", (req, res) => {


    const data = signInSchema.safeParse(req.body);
     if(!data.success){
         res.status(400).json(
          {
            message: "Incorrect Inputs"
          }
         );
         return;
     }
    
    const userId = 1;
    const token  = jwt.sign({
        userId
    }, JWT_SECRET);
  })


  app.post("/room", middleware, (req, res) => {
    //db call
   const data = CreateRoomSchema.safeParse(req.body);
   
    if(!data.success){
      res.status(400).json(
       {
         message: "Incorrect Inputs"
       }
      );
      return;
    }


    res.json({
        roomId: 123
    })
  })




 app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
 });