import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: March 2025</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Your privacy is important to us. This policy outlines how SketchFlow collects, uses, and protects your personal data.</p>
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide when creating an account, such as your name and email address. We also collect usage data to improve our service.</p>
          <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>Your information is used to provide, maintain, and improve SketchFlow, communicate with you, and ensure the security of our platform.</p>
          <h2 className="text-xl font-semibold text-foreground">Data Security</h2>
          <p>We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@sketchflow.app.</p>
        </div>
      </div>
    </div>
  )
}
