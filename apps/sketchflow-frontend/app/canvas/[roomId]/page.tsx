"use client"
import { useEffect, useRef } from "react";
export default function Canvas(){
   const canvasRef = useRef<HTMLCanvasElement>(null);
   
    useEffect(()=>{

     if(canvasRef.current){
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        if(!ctx){
            console.log("Canvas not supported");
            return;
        }
        ctx.strokeRect(25, 25, 100, 100);
        
     }

   }, [canvasRef])



    return <> 
    <div className="w-dvw h-dvh bg-white">
    <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
    </>
}