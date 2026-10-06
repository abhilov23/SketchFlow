import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="bg-[#f7f6fa] px-5 py-12 sm:px-8 md:py-16">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#ebe9ef] bg-white p-7 shadow-[0_24px_70px_-50px_rgba(39,33,66,.3)] sm:p-10 md:p-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#777481] transition-colors hover:text-violet-700">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">SketchFlow · Legal</p>
        <h1 className="mb-2 text-3xl font-semibold tracking-[-0.05em] text-[#211f2b] md:text-4xl">Terms of Service</h1>
        <p className="mb-8 text-sm text-[#96929e]">Last updated: March 2025</p>
        <div className="max-w-none space-y-6 text-sm leading-7 text-[#696673] [&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-[#211f2b]">
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
