"use client";

import Link from "next/link"
import { Menu, Shapes, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eeebf1] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292638] text-white shadow-sm"><Shapes className="h-[18px] w-[18px]" /></div>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#292638]">SketchFlow</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/dashboard" className="text-[13px] font-medium text-[#615d6b] transition hover:text-violet-700">Workspace</Link>
          <Link href="/#features" className="text-[13px] font-medium text-[#77737f] transition hover:text-violet-700">Why SketchFlow</Link>
          <Link href="/watch-demo" className="text-[13px] font-medium text-[#77737f] transition hover:text-violet-700">Product guide</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="hidden text-[13px] font-semibold text-[#56535f] transition hover:text-violet-700 sm:inline-flex">Log in</Link>
          <Link href="/signup" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#292638] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-violet-700">Start sketching</Link>
          <button type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebe9ef] text-[#4d4958] md:hidden">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menuOpen && <nav className="absolute inset-x-4 top-[calc(100%+8px)] flex flex-col gap-1 rounded-2xl border border-[#ebe9ef] bg-white p-2 shadow-xl shadow-[#292638]/10 md:hidden">
        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-[#514d5a] hover:bg-[#f7f6fa]">Workspace</Link>
        <Link href="/#features" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-[#514d5a] hover:bg-[#f7f6fa]">Why SketchFlow</Link>
        <Link href="/watch-demo" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-[#514d5a] hover:bg-[#f7f6fa]">Product guide</Link>
        <Link href="/signin" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-[#514d5a] hover:bg-[#f7f6fa]">Log in</Link>
      </nav>}
    </header>
  )
}
