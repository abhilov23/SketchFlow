import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { useState } from "react";


type Shape = "circle" | "rect" | "pencil";


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
        <Topbar selectedTool={selectedTool}/>
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

        <IconButton activated={selectedTool === "pencil"}  icon={<Pencil/>} onClick={()=>{
            setSelectedTool("pencil");
        }}></IconButton>
        <IconButton  activated={selectedTool === "rect"}  icon={<RectangleHorizontalIcon/>} onClick={()=>{
            setSelectedTool("rect");
        }}></IconButton>
        <IconButton activated={selectedTool === "circle"} icon={<Circle/>} onClick={()=>{
            setSelectedTool("circle");
        }}></IconButton>
        </div>
    </div>
}