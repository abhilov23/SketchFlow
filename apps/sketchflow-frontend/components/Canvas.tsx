import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";

export function Canvas({
    roomId,
    socket
}:{
    roomId : string;
    socket : WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);   


        useEffect(()=>{

        if(canvasRef.current){
            initDraw(canvasRef.current, roomId, socket);
            
        }

    }, [canvasRef, roomId]);


    return (
        <div className="w-dvw h-dvh bg-[rgb(34,37,36)] overflow-hidden relative">
        <canvas ref={canvasRef} width={1800} height={800} className="block mx-auto"></canvas>

        <div className="fixed bottom-4 right-4 flex gap-2">
        <button className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition">Rectangle</button>
        <button className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition">Circle</button>
  </div>
  </div>

    )

}