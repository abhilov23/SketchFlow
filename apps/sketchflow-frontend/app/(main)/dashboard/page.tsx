"use client";

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateRoomSchema } from "@repo/common/types"
import { ArrowUpRight, Check, Clock3, Copy, LayoutGrid, Loader2, LogOut, Plus, Search, Shapes, Trash2, Users } from "lucide-react"
import { HTTP_BACKEND } from "@/app/config"

type Room = { id: number; slug: string; name?: string; createdAt: string }
const boardColors = ["bg-[#eeeaff] text-[#7060cb]", "bg-[#fff1df] text-[#ad7235]", "bg-[#e4f4eb] text-[#4f8965]", "bg-[#fbe9e8] text-[#ba6e67]"]

export default function Dashboard() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchRooms = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${HTTP_BACKEND}/rooms`, { headers: { Authorization: token } })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) { localStorage.removeItem("token"); router.push("/signin"); return }
        throw new Error(data.message || "Failed to fetch boards")
      }
      setRooms(data.room || [])
      setErrors({})
    } catch (error) {
      console.error("Fetch rooms error:", error)
      setErrors({ general: "We couldn’t load your boards. Please try again." })
    } finally { setIsFetching(false) }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/signin")
    else {
      setIsAuthenticated(true)
      fetchRooms(token)
    }
  }, [fetchRooms, router])

  useEffect(() => {
    if (!isAuthenticated) return
    const token = localStorage.getItem("token")
    const interval = setInterval(() => { if (token) fetchRooms(token) }, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchRooms])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")
    const result = CreateRoomSchema.safeParse({ name })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { fieldErrors[String(err.path[0])] = err.message })
      setErrors(fieldErrors)
      setIsLoading(false)
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${HTTP_BACKEND}/room`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `${token}` }, body: JSON.stringify({ name }) })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) { localStorage.removeItem("token"); router.push("/signin"); return }
        throw new Error(data.message || "Failed to create board")
      }
      setSuccessMessage("Your board is ready.")
      setName("")
      if (token) await fetchRooms(token)
    } catch (error) { setErrors({ general: error instanceof Error ? error.message : "Failed to create board" }) }
    finally { setIsLoading(false) }
  }

  const handleDeleteRoom = async (slug: string) => {
    setErrors({})
    setSuccessMessage("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${HTTP_BACKEND}/room/${encodeURIComponent(slug)}`, { method: "DELETE", headers: { Authorization: `${token}` } })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) { localStorage.removeItem("token"); router.push("/signin"); return }
        throw new Error(data.message || "Failed to delete board")
      }
      setRooms((current) => current.filter((room) => room.slug !== slug))
      setSuccessMessage("Board deleted.")
    } catch (error) { setErrors({ general: error instanceof Error ? error.message : "Failed to delete board" }) }
  }

  const handleCopySlug = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/canvas/${encodeURIComponent(slug)}`)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch {}
  }

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/signin") }
  const filteredRooms = useMemo(() => rooms.filter((room) => (room.name || room.slug).toLowerCase().includes(search.toLowerCase())), [rooms, search])

  if (!isAuthenticated) return <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#f5f3f8]"><div className="flex items-center gap-3 text-sm text-[#77737f]"><Loader2 className="h-5 w-5 animate-spin text-violet-600" />Getting your space ready…</div></div>

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#f5f3f8] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-violet-700"><Shapes className="h-3.5 w-3.5" /> YOUR SKETCHFLOW</div><h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#292638] sm:text-4xl">Your ideas live here.</h1><p className="mt-2 text-sm text-[#827e8a]">A little space to get things moving.</p></div>
          <button onClick={handleLogout} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e1e9] bg-white px-4 text-xs font-semibold text-[#696572] transition hover:border-rose-200 hover:text-rose-600"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-2xl border border-white bg-white p-6 shadow-[0_12px_35px_-25px_rgba(55,43,94,0.22)] sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Plus className="h-5 w-5" /></div>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-[#292638]">Start a fresh board</h2><p className="mt-1 text-sm leading-6 text-[#898591]">Give your next idea a place to land.</p>
            <form onSubmit={handleCreateRoom} className="mt-6 space-y-3"><label htmlFor="board-name" className="text-xs font-semibold text-[#55515e]">Board name</label><input id="board-name" type="text" placeholder="e.g. Spring launch ideas" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-[#e9e6ed] bg-[#fdfcfe] px-4 text-sm text-[#292638] outline-none transition placeholder:text-[#b1adb7] focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" />{errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}<button type="submit" disabled={isLoading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#292638] text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{isLoading ? "Making your board…" : "Create board"}</button></form>
            {errors.general && <div role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700">{errors.general}</div>}{successMessage && <div role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700"><Check className="h-4 w-4" />{successMessage}</div>}
            <div className="mt-7 rounded-xl bg-[#f8f6fb] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-[#5f596e]"><Users className="h-4 w-4 text-violet-600" /> Made for thinking together</div><p className="mt-2 text-xs leading-5 text-[#8a8692]">Create a board, sketch your thoughts, and share it with the people who make it better.</p></div>
          </aside>

          <section className="min-w-0 rounded-2xl border border-white bg-white p-5 shadow-[0_12px_35px_-25px_rgba(55,43,94,0.22)] sm:p-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2"><LayoutGrid className="h-4 w-4 text-violet-600"/><h2 className="text-lg font-semibold tracking-tight text-[#292638]">Your boards</h2><span className="rounded-md bg-[#f4f1f8] px-2 py-0.5 text-[11px] font-semibold text-[#817b8c]">{rooms.length}</span></div><p className="mt-1 text-xs text-[#96929d]">Pick up where your ideas left off.</p></div>{rooms.length > 0 && <label className="relative block w-full sm:w-52"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#aaa6b0]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a board" className="h-9 w-full rounded-lg border border-[#eeebf1] bg-[#fdfcfe] pl-9 pr-3 text-xs outline-none focus:border-violet-300" /></label>}</div>
            {isFetching ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#898591]"><Loader2 className="h-4 w-4 animate-spin text-violet-600"/>Loading boards…</div> : rooms.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#e8e4ed] bg-[#fdfcfe] px-5 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><LayoutGrid className="h-5 w-5"/></div><h3 className="mt-4 text-sm font-semibold text-[#514d5a]">Your first board is a blank page.</h3><p className="mt-1 max-w-xs text-xs leading-5 text-[#96929d]">Create one whenever an idea needs room to grow.</p></div> : filteredRooms.length === 0 ? <div className="flex min-h-48 flex-col items-center justify-center text-center"><Search className="h-5 w-5 text-[#aaa6b0]"/><p className="mt-3 text-sm font-medium text-[#696572]">No boards match “{search}”</p><button onClick={() => setSearch("")} className="mt-2 text-xs font-semibold text-violet-700">Clear search</button></div> : <div className="grid gap-4 sm:grid-cols-2">{filteredRooms.map((room, index) => { const createdAt = new Date(room.createdAt); const color = boardColors[index % boardColors.length]; return <article key={room.slug} className="group overflow-hidden rounded-xl border border-[#eeebf1] bg-white transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5"><button onClick={() => router.push(`/canvas/${encodeURIComponent(room.slug)}`)} className={`relative flex h-28 w-full items-center justify-center overflow-hidden ${color}`} aria-label={`Open ${room.name || room.slug}`}><div className="absolute inset-0 opacity-45" style={{ backgroundImage: "radial-gradient(currentColor 0.7px, transparent 0.7px)", backgroundSize: "16px 16px" }}/><div className="relative flex items-center gap-3"><Shapes className="h-7 w-7 opacity-60"/><span className="h-px w-9 bg-current opacity-40"/><span className="flex h-9 w-12 items-center justify-center rounded-lg border border-current/20 bg-white/70"><ArrowUpRight className="h-4 w-4"/></span></div><span className="absolute right-3 top-3 rounded-md bg-white/70 px-2 py-1 text-[9px] font-semibold opacity-70">BOARD {String(index + 1).padStart(2, "0")}</span></button><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-[#3b3745]">{room.name || room.slug}</h3><p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#a19da8]"><Clock3 className="h-3 w-3"/>{createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div><div className="flex shrink-0 items-center gap-1"><button onClick={() => handleCopySlug(room.slug)} aria-label="Copy board link" title="Copy link" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#898591] hover:bg-violet-50 hover:text-violet-700">{copiedSlug === room.slug ? <Check className="h-4 w-4 text-emerald-600"/> : <Copy className="h-4 w-4"/>}</button><button onClick={() => handleDeleteRoom(room.slug)} aria-label="Delete board" title="Delete board" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#aaa6b0] hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4"/></button></div></div></div></article> })}</div>}
          </section>
        </div>
      </div>
    </div>
  )
}
