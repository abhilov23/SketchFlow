"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Shapes } from "lucide-react"
import { HTTP_BACKEND, WS_URL } from "@/app/config"
import { Canvas } from "./Canvas"

type Room = { id: number; slug: string }
type RoomState = { id: string; slug: string }

export function RoomCanvas({ roomSlug }: { roomSlug: string }) {
  const router = useRouter()
  const [room, setRoom] = useState<RoomState | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadRoom = async () => {
      try {
        const response = await fetch(`${HTTP_BACKEND}/room/${encodeURIComponent(roomSlug)}`)
        const data: { room: Room | null } = await response.json()
        if (!response.ok || !data.room) throw new Error("We couldn’t find that board.")
        if (!cancelled) setRoom({ id: String(data.room.id), slug: data.room.slug })
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We couldn’t load that board.")
      }
    }
    loadRoom()
    return () => { cancelled = true }
  }, [roomSlug])

  useEffect(() => {
    if (!room) return
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Sign in to open this board.")
      return
    }

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`)
    let closing = false
    ws.onopen = () => setSocket(ws)
    ws.onerror = () => setError("We couldn’t connect to the board right now.")
    ws.onclose = () => {
      if (!closing) {
        setSocket(null)
        setError("Connection to this board ended. Reload to reconnect.")
      }
    }

    return () => {
      closing = true
      ws.close()
      setSocket(null)
    }
  }, [room])

  if (error) {
    const needsSignIn = error.includes("Sign in")
    return <main className="flex min-h-screen items-center justify-center bg-[#f5f3f8] px-5"><div className="w-full max-w-md rounded-2xl border border-white bg-white p-8 text-center shadow-xl"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Shapes className="h-5 w-5" /></div><h1 className="mt-5 text-lg font-semibold text-[#292638]">{error}</h1><p className="mt-2 text-sm leading-6 text-[#827e8a]">{needsSignIn ? "Your boards are available after you sign in." : "Check the link or return to your board library."}</p><div className="mt-6 flex justify-center gap-3"><Link href={needsSignIn ? "/signin" : "/dashboard"} className="inline-flex h-10 items-center rounded-xl bg-[#292638] px-4 text-sm font-semibold text-white">{needsSignIn ? "Sign in" : "All boards"}</Link>{needsSignIn && <button onClick={() => router.push("/signup")} className="h-10 rounded-xl border border-[#e9e6ed] px-4 text-sm font-semibold text-[#5b5764]">Create account</button>}</div></div></main>
  }

  if (!room || !socket) return <main className="flex min-h-screen items-center justify-center bg-[#f5f3f8]"><div className="flex items-center gap-3 text-sm text-[#77737f]"><Loader2 className="h-5 w-5 animate-spin text-violet-600" />{room ? "Connecting to your board…" : "Opening your board…"}</div></main>

  return <Canvas roomId={room.id} boardName={room.slug} socket={socket} />
}
