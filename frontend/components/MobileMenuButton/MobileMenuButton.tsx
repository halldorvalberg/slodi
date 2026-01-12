import React from "react";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenuButton.module.css";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      aria-label={isOpen ? "Loka valmynd" : "Opna valmynd"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
