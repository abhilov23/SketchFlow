import { MainLayoutShell } from "@/components/MainLayoutShell"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutShell>{children}</MainLayoutShell>
}
