import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Terms of Service</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: March 2025</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>By using SketchFlow, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
          <p>By accessing or using SketchFlow, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          <h2 className="text-xl font-semibold text-foreground">User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
          <p>You agree not to misuse SketchFlow for illegal purposes, to infringe on others&apos; rights, or to disrupt the service.</p>
          <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>SketchFlow is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for damages arising from your use of the service.</p>
          <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </div>
  )
}
