
import express from "express";
import  jwt  from "jsonwebtoken";
import  JWT_SECRET  from "@repo/backend-common/config";
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
            //todo: Hash the password
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


app.post('/signin', async(req, res)=>{
    
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success){
      res.json({
         message: "Incorrect Inputs"
     })
     return;
    }
    

    //Todo: compare the hashed pws here
    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data?.username,
            password: parsedData.data?.password
        }
    })

    if(!user){
        res.json({
            message: "Not authorized"
        })
        return;
    }



   const token = jwt.sign({
        userid: user?.id
    }, JWT_SECRET)

    res.json({
        token
    })
})




app.post("/room", middleware,async (req, res)=>{
   
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
      res.json({
         message: "Incorrect Inputs"
     })
     return;
    }
    
    //@ts-ignore TODO: fix this
    const userId = req.userId;
    
    try {
          
    const room = await prismaClient.room.create({
        data:{
            slug:parsedData.data.name,
            adminId: userId
        }
    })

   
    //db call
   res.json({
       roomId: room.id
   })
    } catch (error) {
        res.status(411).json({
            message:"Room already exists with this name"
        })
    }
   

})



app.listen(3001);