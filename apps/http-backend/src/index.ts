
import express from "express";
import  jwt  from "jsonwebtoken";
import  JWT_SECRET  from "./config";
import { middleware } from "./middleware";
import {SignInSchema, CreateRoomSchema ,CreateUserSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";



const app = express();
app.use(express.json());


app.post('/signup',async (req, res)=>{
   
   const parsedData = CreateUserSchema.safeParse(req.body);
   if(!parsedData.success){
     res.json({
        message: "Incorrect Inputs"
    })
    return;
   }

   try {
    const user = await prismaClient.user.create({
        data:{
            email: parsedData.data?.username,
            password: parsedData.data?.password,
            name: parsedData.data?.name
        }
       })
    
       //db call
       res.json({
        userId: user.id
       })
   } catch (error) {
    res.json({
        message : "user already existed"
    })
   }
})


app.post('/signin',(req, res)=>{
    
    const data = SignInSchema.safeParse(req.body);
    if(!data.success){
      res.json({
         message: "Incorrect Inputs"
     })
     return;
    }
   
    const userid = 1;
   const token = jwt.sign({
        userid
    }, JWT_SECRET)

    res.json({
        token
    })
})




app.post("/room", middleware, (req, res)=>{
   
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
      res.json({
         message: "Incorrect Inputs"
     })
     return;
    }
   
   
    //db call
   res.json({
       roomId: 1
   })
})



app.listen(3001);