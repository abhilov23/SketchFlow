import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}

export function IconButton({ icon, onClick, activated }: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-10 h-10 rounded-md border border-gray-700 bg-gray-900  transition
        ${activated ? "bg-purple-600 text-white" : "text-gray-400"}
      `}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
