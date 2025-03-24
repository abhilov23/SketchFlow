"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "@/app/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId: string}){


    const [socket, setSocket] = useState<WebSocket | null>(null);
    
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMGE2ZDkyMy0wZDZiLTRhOGYtYTllYy03ZDc5ZmU1MmZlN2QiLCJpYXQiOjE3NDI2Njc1Nzd9.zpRaU4OdaZFg_w8seCOWwwN-LumcPySqIzKblorMPFk`);
        ws.onopen=()=>{
            setSocket(ws)
            const data = JSON.stringify(
                {
                type: "join_room",
                roomId
                }
            )
            console.log(data)
            ws.send(data)
        }
    }, [roomId])
   

   if(!socket){
     return <p>Connecting to Server...</p>  // Show loading spinner here if socket is not established yet.
   }

   return <> 
   <Canvas roomId={roomId} socket={socket}/>
     </>
}