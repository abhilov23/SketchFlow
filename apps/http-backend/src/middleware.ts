import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "./config";


export function middleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, JWT_SECRET)

    if(decoded){
        //@ts-ignore Todo: fix this
     req.userId = decoded.userId;
    }else{
        res.status(401).json({message: "Not authenticated"})
    }
}