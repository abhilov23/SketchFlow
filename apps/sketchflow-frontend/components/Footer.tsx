import Link from "next/link"
import { Shapes } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#171620]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-300 text-[#211f2b]"><Shapes className="h-4 w-4" /></span><span className="text-sm font-semibold tracking-tight text-white">SketchFlow</span></Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">A shared canvas for the early, messy, brilliant part of making something together.</p>
        </div>
        <div><h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Explore</h4><div className="mt-4 flex flex-col gap-3"><Link href="/#features" className="text-sm text-white/65 transition hover:text-violet-200">Why SketchFlow</Link><Link href="/#how-it-works" className="text-sm text-white/65 transition hover:text-violet-200">How it works</Link><Link href="/watch-demo" className="text-sm text-white/65 transition hover:text-violet-200">Product guide</Link></div></div>
        <div><h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Your space</h4><div className="mt-4 flex flex-col gap-3"><Link href="/signin" className="text-sm text-white/65 transition hover:text-violet-200">Log in</Link><Link href="/signup" className="text-sm text-white/65 transition hover:text-violet-200">Create account</Link><Link href="/privacy" className="text-sm text-white/65 transition hover:text-violet-200">Privacy</Link><Link href="/terms" className="text-sm text-white/65 transition hover:text-violet-200">Terms</Link></div></div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto max-w-7xl px-6 py-4 text-xs text-white/35 sm:px-10 lg:px-12">© {new Date().getFullYear()} SketchFlow. Make room for good ideas.</div></div>
    </footer>
  )
}
