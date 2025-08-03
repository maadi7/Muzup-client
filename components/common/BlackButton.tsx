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
  px?: string;
  py?: string;
  IconColor?: string;
  IconLeft?: boolean;
}

const BlackButton: React.FC<ButtonProps> = ({
  text,
  primary,
  wfull,
  onClick,
  newTab,
  refSrc,
  Icon,
  px,
  py,
  IconColor,
  IconLeft = false,
}) => {
  return (
    <div
      className={`inline-block text-center cursor-pointer text-secondary ${
        wfull ? "w-full" : ""
      } `}
    >
      <div
        onClick={onClick}
        className={`
            ${primary ? "bg-muzupColor" : "bg-secondaryBg"}
 text-textColor 
          shadow-sm rounded-lg text-sm font-semibold ${
            px ? px : "px-3"
          } block ${py ? py : "py-2"} duration-200
        `}
      >
        <p className="flex items-center justify-center gap-2">
          <span className={IconLeft ? "order-2" : "order-1"}>{text}</span>
          {Icon && (
            <Icon
              className={`w-5 ${
                IconLeft ? "order-1" : "order-2"
              } h-5 text-${IconColor}`}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default BlackButton;
