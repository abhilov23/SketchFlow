import { ReactNode } from "react"

interface IconButtonProps {
  icon: ReactNode
  onClick: () => void
  activated?: boolean
}

export function IconButton({ icon, onClick, activated }: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-10 h-10 rounded-lg border text-sm transition-all ${
        activated
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
