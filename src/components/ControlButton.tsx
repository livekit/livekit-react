import React from "react";
import styles from "./styles.module.css";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ControlButton = ({ label, disabled, onClick }: ButtonProps) => {
  return (
    <button disabled={disabled} className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};
