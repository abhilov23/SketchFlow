import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  activated : boolean;
}

export function IconButton({ icon, onClick, activated }: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-600  transition
         ${activated ? "bg-gray-600" : "bg-gray-800"}
         `}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
