import React from "react"
import { ITheme, useTheme } from "@chainsafe/common-theme"

export interface ILoadingProps {
  type?: "inherit" | "primary" | "dark" | "light";
  size?: number;
  className?: string;
}

const Loading: React.FC<ILoadingProps> = ({
  type = "primary",
  size = 64,
  className
}) => {
  const theme: ITheme = useTheme()
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={
              type === "primary"
                ? theme.palette.primary.main
                : type === "dark"
                  ? theme.palette.common.black.main
                  : theme.palette.additional["gray"][5]
            }
          />
          <stop
            offset="100%"
            stopColor={
              type === "light" ? theme.palette.common.white.main : "transparent"
            }
          />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="url(#gradient)"
        strokeWidth="6"
        fill="none"
        transform="rotate(90 50 50)"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

export default Loading
