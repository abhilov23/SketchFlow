"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreateRoomSchema } from "@repo/common/types"
import { Plus, DoorOpen, Trash2, Hash, Calendar, LogOut, Loader2, Layers, Clock, Copy } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [rooms, setRooms] = useState<{ id: number; slug: string; name?: string; createdAt: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    } else {
      setIsAuthenticated(true)
      fetchRooms(token)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return
    const token = localStorage.getItem("token")
    const interval = setInterval(() => {
      if (token) fetchRooms(token)
    }, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const fetchRooms = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3005/rooms", {
        headers: { Authorization: `${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token")
          router.push("/signin")
          return
        }
        throw new Error(data.message || "Failed to fetch rooms")
      }
      setRooms(data.room || [])
    } catch (error) {
      console.error("Fetch rooms error:", error)
      setErrors({ general: "Failed to load rooms" })
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    const result = CreateRoomSchema.safeParse({ name })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        fieldErrors[String(err.path[0])] = err.message
      })
      setErrors(fieldErrors)
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3005/room", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `${token}` },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token")
          router.push("/signin")
          return
        }
        throw new Error(data.message || "Failed to create room")
      }

      setSuccessMessage("Room created successfully!")
      setName("")
      if (token) fetchRooms(token)
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Failed to create room" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRoom = async (slug: string) => {
    setErrors({})
    setSuccessMessage("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3005/room/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: `${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token")
          router.push("/signin")
          return
        }
        throw new Error(data.message || "Failed to delete room")
      }
      setSuccessMessage("Room deleted successfully!")
      if (token) fetchRooms(token)
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Failed to delete room" })
    }
  }

  const handleCopySlug = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/canvas/${encodeURIComponent(slug)}`)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch {
      // fallback
    }
  }

  const handleOpenRoom = (id: number) => {
    router.push(`/canvas/${id}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/signin")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10 md:py-16">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/3 blur-3xl" />
      </div>
      <div className="container max-w-6xl">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your collaborative boards.</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium shadow-sm transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          {/* Create room form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold">New Board</h2>
              <p className="mb-5 text-sm text-muted-foreground">Create a new collaborative board.</p>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Board name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Sprint planning"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {isLoading ? "Creating..." : "Create Board"}
                </button>
              </form>
              {errors.general && (
                <div className="mt-4 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{errors.general}</div>
              )}
              {successMessage && (
                <div className="mt-4 rounded-xl bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400">
                  {successMessage}
                </div>
              )}
            </div>
          </div>

          {/* Rooms list */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Your Boards
                {rooms.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({rooms.length})</span>
                )}
              </h2>
            </div>
            {rooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-20 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <Layers className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No boards yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Create your first board to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {rooms.map((room) => {
                  const isCopied = copiedSlug === room.slug
                  const createdAt = new Date(room.createdAt)
                  const isRecent = Date.now() - createdAt.getTime() < 86400000

                  return (
                    <div
                      key={room.slug}
                      className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                      {isRecent && (
                        <span className="absolute right-4 top-4 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          New
                        </span>
                      )}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Hash className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold">{room.name || room.slug}</h3>
                          <p className="truncate text-xs text-muted-foreground">/{room.slug}</p>
                        </div>
                      </div>

                      <div className="mb-5 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>Created {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenRoom(room.id)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                        >
                          <DoorOpen className="h-4 w-4" />
                          Open
                        </button>
                        <button
                          onClick={() => handleCopySlug(room.slug)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent active:scale-[0.98]"
                          title="Copy board link"
                        >
                          {isCopied ? (
                            <span className="text-xs text-green-500">Copied!</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.slug)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-[0.98]"
                          title="Delete board"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
