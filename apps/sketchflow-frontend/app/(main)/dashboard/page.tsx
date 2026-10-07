"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateRoomSchema } from "@repo/common/types"
import { ArrowUpRight, Check, Clock3, Copy, LayoutGrid, Loader2, LogOut, Plus, Search, Shapes, Trash2, Users } from "lucide-react"
import { HTTP_BACKEND } from "@/app/config"

type Room = { id: number; slug: string; name?: string; createdAt: string }
const boardColors = ["bg-violet-50 text-violet-600", "bg-amber-50 text-amber-700", "bg-emerald-50 text-emerald-700", "bg-rose-50 text-rose-600"]

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
    if (!window.confirm(`Delete “${slug}” and its saved drawing history? This cannot be undone.`)) return
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

  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center bg-[#f8f8fa]"><div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" />Getting your space ready…</div></div>

  return (
    <div className="min-h-screen bg-[#f8f8fa] text-[#17171b] md:flex">
      <aside className="flex shrink-0 flex-col border-b border-[#e8e8ec] bg-white md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex h-16 items-center justify-between px-5 md:px-6">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5" aria-label="SketchFlow home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#242329] text-white"><Shapes className="h-4 w-4" /></span>
            <span className="text-sm font-semibold tracking-tight">SketchFlow</span>
          </button>
          <span className="rounded-md border border-[#e9e9ed] px-1.5 py-0.5 text-[10px] font-medium text-[#777780]">FREE</span>
        </div>
        <div className="hidden px-3 pt-5 md:block">
          <p className="px-3 pb-2 text-[11px] font-medium text-[#85858d]">Workspace</p>
          <button className="flex h-9 w-full items-center gap-2.5 rounded-md bg-[#f2f1f4] px-3 text-sm font-medium text-[#29282e]">
            <LayoutGrid className="h-4 w-4 text-[#67666f]" /> All boards
            <span className="ml-auto text-xs text-[#8b8a92]">{rooms.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 px-5 pb-4 md:hidden">
          <LayoutGrid className="h-4 w-4 text-primary" /><span className="text-sm font-medium">All boards</span>
          <span className="text-xs text-muted-foreground">{rooms.length}</span>
        </div>
        <div className="mt-auto hidden border-t border-[#ededf0] p-3 md:block">
          <div className="mb-2 flex items-center gap-2 rounded-md px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 text-xs font-semibold text-violet-700">SF</div>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">SketchFlow</p><p className="text-[11px] text-[#85858d]">Shared workspace</p></div>
          </div>
          <button onClick={handleLogout} className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm text-[#696971] transition hover:bg-[#f5f5f7] hover:text-[#232228]"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[#e8e8ec] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 text-sm"><span className="text-[#87868e]">Workspace</span><span className="text-[#c2c1c7]">/</span><span className="font-medium">All boards</span></div>
          <div className="flex items-center gap-3">
            <label className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#92919a]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search boards..." className="h-9 w-52 rounded-md border border-[#e6e6ea] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#9998a0] focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></label>
            <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eceaf1] text-[11px] font-semibold text-[#55515f] md:hidden" aria-label="Sign out">SF</button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-medium text-[#85858d]">Your creative workspace</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">All boards</h1><p className="mt-2 text-sm text-[#777780]">A home for ideas in progress and plans taking shape.</p></div>
            <button onClick={() => document.getElementById("board-name")?.focus()} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#242329] px-3.5 text-sm font-medium text-white transition hover:bg-[#38373f]"><Plus className="h-4 w-4" /> New board</button>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2"><h2 className="text-sm font-semibold">Recent boards</h2><span className="rounded-md bg-[#ecebf0] px-1.5 py-0.5 text-[10px] font-medium text-[#686771]">{rooms.length}</span></div>
                <label className="relative block w-full max-w-56 sm:hidden"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#92919a]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search boards..." className="h-9 w-full rounded-md border border-[#e6e6ea] bg-white pl-9 pr-3 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></label>
              </div>
              {errors.general && <div role="alert" className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.general}</div>}
              {successMessage && <div role="status" className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><Check className="h-4 w-4" />{successMessage}</div>}
              {isFetching ? <div className="flex min-h-56 items-center justify-center gap-2 rounded-lg border border-[#e8e8ec] bg-white text-sm text-[#777780]"><Loader2 className="h-4 w-4 animate-spin text-primary" />Loading boards…</div> : rooms.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#dedee4] bg-white px-5 text-center"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f0eef5] text-[#6352aa]"><LayoutGrid className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold">No boards yet</h3><p className="mt-1 max-w-xs text-xs leading-5 text-[#85858d]">Create a board to give your next idea a place to take shape.</p><button onClick={() => document.getElementById("board-name")?.focus()} className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-[#242329] px-3 text-xs font-medium text-white hover:bg-[#38373f]"><Plus className="h-3.5 w-3.5" /> Create your first board</button></div> : filteredRooms.length === 0 ? <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-[#e8e8ec] bg-white text-center"><Search className="h-5 w-5 text-[#92919a]" /><p className="mt-3 text-sm font-medium">No boards match “{search}”</p><button onClick={() => setSearch("")} className="mt-2 text-xs font-medium text-violet-700 hover:underline">Clear search</button></div> : <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">{filteredRooms.map((room, index) => { const createdAt = new Date(room.createdAt); const color = boardColors[index % boardColors.length]; return <article key={room.slug} className="group overflow-hidden rounded-lg border border-[#e6e6ea] bg-white transition hover:border-[#c9c4dc] hover:shadow-[0_8px_24px_-16px_rgba(35,32,50,.28)]"><button onClick={() => router.push(`/canvas/${encodeURIComponent(room.slug)}`)} className={`relative flex h-32 w-full items-center justify-center overflow-hidden ${color}`} aria-label={`Open ${room.name || room.slug}`}><div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(currentColor 0.7px, transparent 0.7px)", backgroundSize: "16px 16px" }} /><div className="relative flex items-center gap-3"><Shapes className="h-6 w-6 opacity-60" /><span className="h-px w-8 bg-current opacity-40" /><span className="flex h-8 w-10 items-center justify-center rounded-md border border-current/20 bg-white/70"><ArrowUpRight className="h-4 w-4" /></span></div><span className="absolute left-3 top-3 rounded bg-white/75 px-1.5 py-1 text-[9px] font-semibold text-[#56545e]">BOARD {String(index + 1).padStart(2, "0")}</span></button><div className="p-3.5"><div className="flex items-start justify-between gap-3"><button onClick={() => router.push(`/canvas/${encodeURIComponent(room.slug)}`)} className="min-w-0 text-left"><h3 className="truncate text-sm font-medium group-hover:text-violet-700">{room.name || room.slug}</h3><p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#85858d]"><Clock3 className="h-3 w-3" />{createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></button><div className="flex shrink-0 items-center gap-1"><button onClick={() => handleCopySlug(room.slug)} aria-label="Copy board link" title="Copy link" className="flex h-7 w-7 items-center justify-center rounded-md text-[#85858d] transition hover:bg-[#f2f1f5] hover:text-[#3c3a43]">{copiedSlug === room.slug ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}</button><button onClick={() => handleDeleteRoom(room.slug)} aria-label="Delete board" title="Delete board" className="flex h-7 w-7 items-center justify-center rounded-md text-[#85858d] transition hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div></article> })}</div>}
            </section>

            <aside className="rounded-lg border border-[#e6e6ea] bg-white p-5">
              <div className="mb-4 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f0eef5] text-[#6352aa]"><Plus className="h-4 w-4" /></span><div><h2 className="text-sm font-semibold">Create a board</h2><p className="text-[11px] text-[#85858d]">Start with a name</p></div></div>
              <form onSubmit={handleCreateRoom} className="space-y-3"><div><label htmlFor="board-name" className="mb-1.5 block text-xs font-medium text-[#55545d]">Board name</label><input id="board-name" type="text" placeholder="e.g. Spring launch ideas" value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-full rounded-md border border-[#e2e2e7] bg-white px-3 text-sm outline-none transition placeholder:text-[#a3a2aa] focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />{errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}</div><button type="submit" disabled={isLoading} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#242329] text-sm font-medium text-white transition hover:bg-[#38373f] disabled:opacity-60">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{isLoading ? "Creating board…" : "Create board"}</button></form>
              <div className="mt-5 border-t border-[#ededf0] pt-4"><div className="flex items-center gap-2 text-xs font-medium text-[#55545d]"><Users className="h-3.5 w-3.5 text-[#777780]" />Made for thinking together</div><p className="mt-1.5 text-xs leading-5 text-[#85858d]">Share a board with the people who make your ideas better.</p></div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
