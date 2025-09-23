"use client";

import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  primary?: boolean;
  wfull?: boolean;
  onClick?: () => void;
  newTab?: boolean;
  refSrc?: string;
  Icon?: IconType;
  IconColor?: string;
  px?: string;
  py?: string;
  IconLeft?: boolean;
  w?: string;
  h?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  primary,
  wfull,
  onClick,
  newTab,
  refSrc,
  IconColor,
  Icon,
  px,
  py,
  h,
  w,
  IconLeft = false,
}) => {
  // Convert rem values (Tailwind uses 0.25rem per unit)
  const iconWidth = w ? `${parseInt(w) * 0.25}rem` : "1.25rem"; // default w-5
  const iconHeight = h ? `${parseInt(h) * 0.25}rem` : "1.25rem"; // default h-5

  return (
    <button
      onClick={onClick}
      type="button"
      className={`
    ${
      primary
        ? "bg-textColor/90 text-black hover:bg-white hover:text-black"
        : "text-subTextColor hover:text-textColor"
    }
    ${px ? px : "px-3"} ${py ? py : "py-2"}
    shadow-sm rounded-lg text-sm font-semibold duration-200 group
  `}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon && (
          <Icon
            style={{ width: iconWidth, height: iconHeight }}
            className={`${IconLeft ? "order-1" : "order-2"} ${
              primary
                ? "group-hover:text-black"
                : "text-subTextColor group-hover:text-textColor"
            } transition-colors duration-200`}
          />
        )}
        <span className={IconLeft ? "order-2" : "order-1"}>{text}</span>
      </span>
    </button>
  );
};

export default Button;
