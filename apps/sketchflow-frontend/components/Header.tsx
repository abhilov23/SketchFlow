"use client";

import Link from "next/link"
import { Shapes } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eeebf1] bg-[#fbfaf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292638] text-white shadow-sm"><Shapes className="h-[18px] w-[18px]" /></div>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#292638]">SketchFlow</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-[13px] font-medium text-[#77737f] transition hover:text-violet-700">Why SketchFlow</Link>
          <Link href="/#how-it-works" className="text-[13px] font-medium text-[#77737f] transition hover:text-violet-700">How it works</Link>
          <Link href="/watch-demo" className="text-[13px] font-medium text-[#77737f] transition hover:text-violet-700">Explore</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden text-[13px] font-semibold text-[#56535f] transition hover:text-violet-700 sm:inline-flex">Log in</Link>
          <Link href="/signup" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#292638] px-4 text-[13px] font-semibold text-white transition hover:bg-violet-700">Get started</Link>
        </div>
      </div>
    </header>
  )
}
