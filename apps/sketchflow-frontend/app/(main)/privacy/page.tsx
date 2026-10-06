import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="bg-[#f7f6fa] px-5 py-12 sm:px-8 md:py-16">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#ebe9ef] bg-white p-7 shadow-[0_24px_70px_-50px_rgba(39,33,66,.3)] sm:p-10 md:p-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#777481] transition-colors hover:text-violet-700">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">SketchFlow · Legal</p>
        <h1 className="mb-2 text-3xl font-semibold tracking-[-0.05em] text-[#211f2b] md:text-4xl">Privacy Policy</h1>
        <p className="mb-8 text-sm text-[#96929e]">Last updated: March 2025</p>
        <div className="max-w-none space-y-6 text-sm leading-7 text-[#696673] [&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-[#211f2b]">
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
