import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";
import { IconButton } from "./IconButton";
import { Circle, Minus, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { useState } from "react";


type Shape = "circle" | "rect" | "line" | "pencil";


export function Canvas({
    roomId,
    socket
}:{
    roomId : string;
    socket : WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);   
    const [selectedTool, setSelectedTool] = useState<Shape>("circle");

       useEffect(()=>{
        //@ts-ignore
        window.selectedTool = selectedTool;
       },[selectedTool])



        useEffect(()=>{

        if(canvasRef.current){
            initDraw(canvasRef.current, roomId, socket);
            
        }

    }, [canvasRef, roomId]);


    return (
        <div 
        style={{
            height: "100vh",
            overflow: "hidden"
        }}
        >
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="block mx-auto"></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
  </div>

    )

}

function Topbar({selectedTool, setSelectedTool}:{
    selectedTool : Shape;
    setSelectedTool : (tool: Shape) => void;
}){
   
    return <div 
    style={{
        position: "fixed",
        top:10,
        left:10,
    }}
    >
        <div className="flex gap-1">

        <IconButton activated={selectedTool === "line"}  icon={<Minus rotate={90}/>} onClick={()=>{
            setSelectedTool("line");
        }}></IconButton>
        <IconButton  activated={selectedTool === "rect"}  icon={<RectangleHorizontalIcon/>} onClick={()=>{
            setSelectedTool("rect");
        }}></IconButton>
        <IconButton activated={selectedTool === "circle"} icon={<Circle/>} onClick={()=>{
            setSelectedTool("circle");
        }}></IconButton>
        <IconButton activated={selectedTool === "pencil"} icon={<Pencil/>} onClick={()=>{
            setSelectedTool("pencil");
        }}></IconButton>
        </div>
    </div>
}