import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./styles.module.css";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: IconProp;
  className?: string;
}

export const ControlButton = ({
  label,
  disabled,
  onClick,
  icon,
  className,
}: ButtonProps) => {
  let classes = styles.button;
  if (className) {
    classes += ` ${className}`;
  }

  return (
    <button disabled={disabled} className={classes} onClick={onClick}>
      {icon && (
        <FontAwesomeIcon className={styles.icon} height={32} icon={icon} />
      )}
      {label}
    </button>
  );
};
