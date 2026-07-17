import Link from "next/link"
import { Shapes } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shapes className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold">SketchFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Collaborative whiteboarding for teams.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/watch-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Watch Demo</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SketchFlow. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
