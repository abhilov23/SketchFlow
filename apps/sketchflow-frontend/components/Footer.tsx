import Link from "next/link"
import { Shapes } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#eeebf1] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#292638] text-white"><Shapes className="h-4 w-4" /></span><span className="text-sm font-semibold tracking-tight text-[#292638]">SketchFlow</span></Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#85818d]">A shared canvas for the early, messy, brilliant part of making something together.</p>
        </div>
        <div><h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#aaa6b0]">Explore</h4><div className="mt-4 flex flex-col gap-3"><Link href="/#features" className="text-sm text-[#696572] hover:text-violet-700">Why SketchFlow</Link><Link href="/#how-it-works" className="text-sm text-[#696572] hover:text-violet-700">How it works</Link><Link href="/watch-demo" className="text-sm text-[#696572] hover:text-violet-700">Product guide</Link></div></div>
        <div><h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#aaa6b0]">Your space</h4><div className="mt-4 flex flex-col gap-3"><Link href="/signin" className="text-sm text-[#696572] hover:text-violet-700">Log in</Link><Link href="/signup" className="text-sm text-[#696572] hover:text-violet-700">Create account</Link><Link href="/privacy" className="text-sm text-[#696572] hover:text-violet-700">Privacy</Link><Link href="/terms" className="text-sm text-[#696572] hover:text-violet-700">Terms</Link></div></div>
      </div>
      <div className="border-t border-[#f0edf2]"><div className="mx-auto max-w-7xl px-6 py-4 text-xs text-[#aaa6b0] sm:px-10 lg:px-12">© {new Date().getFullYear()} SketchFlow. Make room for good ideas.</div></div>
    </footer>
  )
}
