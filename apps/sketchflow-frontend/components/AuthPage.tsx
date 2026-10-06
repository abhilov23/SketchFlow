"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreateUserSchema, SigninSchema } from "@repo/common/frontendTypes"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shapes, User } from "lucide-react"
import { HTTP_BACKEND } from "@/app/config"

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [createdNotice, setCreatedNotice] = useState(false)

  useEffect(() => {
    setCreatedNotice(isSignIn && new URLSearchParams(window.location.search).get("created") === "1")
  }, [isSignIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setErrors({})

    const schema = isSignIn ? SigninSchema : CreateUserSchema
    const data = isSignIn ? { username, password } : { username, password, name }
    const result = schema.safeParse(data)
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}
      result.error.errors.forEach((err) => { fieldErrors[String(err.path[0])] = err.message })
      setErrors(fieldErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${HTTP_BACKEND}${isSignIn ? "/signin" : "/signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.message || "Something went wrong")

      if (isSignIn) {
        localStorage.setItem("token", responseData.token)
        router.push("/dashboard")
      } else {
        router.push("/signin?created=1")
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f7f6fa] px-5 py-12 sm:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[#f6d9c8]/50 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_32px_100px_-42px_rgba(39,33,66,.32)] lg:grid-cols-[1fr_0.94fr]">
        <div className="px-7 py-9 sm:px-12 sm:py-12 lg:px-14 lg:py-14">
          <div className="mb-9 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700"><Shapes className="h-4 w-4" /> SketchFlow workspace</div>
          <h1 className="text-3xl font-semibold tracking-[-0.055em] text-[#211f2b] sm:text-[2.35rem]">{isSignIn ? "Welcome back." : "Let’s make room."}</h1>
          <p className="mt-2 text-sm leading-6 text-[#827e8a]">{isSignIn ? "Pick up where your team left off." : "Create your account and bring the first idea to life."}</p>

          {createdNotice && <div role="status" className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Your account is ready. Log in to continue.</div>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {!isSignIn && <div className="space-y-2"><label htmlFor="name" className="text-xs font-semibold text-[#55515e]">Your name</label><div className="relative"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa6b0]" /><input id="name" type="text" placeholder="How should we call you?" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-[#e9e6ed] bg-[#fdfcfe] pl-10 pr-4 text-sm text-[#292638] outline-none transition placeholder:text-[#b1adb7] focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" required />{errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}</div></div>}
            <div className="space-y-2"><label htmlFor="username" className="text-xs font-semibold text-[#55515e]">Email address</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa6b0]" /><input id="username" type="email" placeholder="you@example.com" value={username} onChange={(e) => setUsername(e.target.value)} className="h-12 w-full rounded-xl border border-[#e9e6ed] bg-[#fdfcfe] pl-10 pr-4 text-sm text-[#292638] outline-none transition placeholder:text-[#b1adb7] focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" required />{errors.username && <p className="text-xs text-rose-600">{errors.username}</p>}</div></div>
            <div className="space-y-2"><label htmlFor="password" className="text-xs font-semibold text-[#55515e]">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa6b0]" /><input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-[#e9e6ed] bg-[#fdfcfe] pl-10 pr-11 text-sm text-[#292638] outline-none transition placeholder:text-[#b1adb7] focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa6b0] transition hover:text-violet-700">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>{errors.password && <p className="text-xs text-rose-600">{errors.password}</p>}</div></div>
            <button type="submit" disabled={isLoading} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#292638] text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">{isLoading ? "One moment…" : isSignIn ? "Log in to SketchFlow" : "Create your account"}{!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}</button>
          </form>
          {message && <div role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>}
          <p className="mt-7 text-center text-sm text-[#85818d]">{isSignIn ? "New to SketchFlow?" : "Already have an account?"}{" "}<Link href={isSignIn ? "/signup" : "/signin"} className="font-semibold text-violet-700 hover:text-violet-900">{isSignIn ? "Create an account" : "Log in"}</Link></p>
        </div>

        <div className="relative hidden min-h-[580px] overflow-hidden bg-[#171620] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" /><div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-rose-300/15 blur-3xl" />
          <div className="relative"><span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-200">A canvas for what’s next</span><h2 className="mt-6 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em]">The best work starts with a thought you can see.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Give your ideas space to wander, connect, and become something real.</p></div>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-300/15 text-violet-200"><Shapes className="h-3.5 w-3.5" /></span><span className="text-xs font-semibold">New idea, who dis?</span></div><span className="flex h-2 w-2 rounded-full bg-emerald-300" /></div>
            <div className="relative h-44 rounded-xl bg-[#f9f7fb] p-4 text-[#292638]" style={{ backgroundImage: "radial-gradient(#d9d4e2 0.8px, transparent 0.8px)", backgroundSize: "16px 16px" }}><div className="absolute left-5 top-6 rotate-[-4deg] rounded-lg bg-[#fff0c9] px-3 py-2 text-[10px] font-semibold shadow-sm">Start with a question</div><div className="absolute left-[40%] top-[42%] rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-[10px] font-semibold text-violet-800">Make it<br />feel easy</div><div className="absolute bottom-5 right-5 rotate-3 rounded-lg bg-[#e2f3e8] px-3 py-2 text-[10px] font-semibold text-emerald-800 shadow-sm">One small step</div><span className="absolute left-[31%] top-[43%] h-px w-[10%] rotate-12 bg-violet-400"/><span className="absolute right-[31%] top-[58%] h-px w-[10%] -rotate-12 bg-violet-400"/></div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-white/45"><span>Made together, one sketch at a time</span><span>✳</span></div>
          </div>
          <div className="relative flex items-center gap-3 border-t border-white/10 pt-5"><div className="flex -space-x-2"><span className="h-7 w-7 rounded-full border-2 border-[#343143] bg-[#f4b9a7]"/><span className="h-7 w-7 rounded-full border-2 border-[#343143] bg-[#c8c0fa]"/><span className="h-7 w-7 rounded-full border-2 border-[#343143] bg-[#b9dece]"/></div><p className="text-xs text-white/55">A little more room to think, together.</p></div>
        </div>
      </div>
    </section>
  )
}
