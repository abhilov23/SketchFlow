"use client"

import { useEffect, useState } from "react"
import { WS_URL } from "@/app/config"
import { Canvas } from "./Canvas"
import { Loader2 } from "lucide-react"

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication required")
      return
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = () => {
      setSocket(ws)
      ws.send(JSON.stringify({ type: "join_room", roomId }))
    }

    ws.onerror = () => {
      setError("Failed to connect to server")
    }

    ws.onclose = () => {
      if (!socket) setError("Connection closed")
    }
  }, [roomId])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!socket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Connecting to server...</p>
        </div>
      </div>
    )
  }

  return <Canvas roomId={roomId} socket={socket} />
}
