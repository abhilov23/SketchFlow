"use client";

import Link from "next/link"
import { Shapes } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shapes className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">SketchFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Now
          </Link>
        </div>
      </div>
    </header>
  )
}
