import React, { useMemo } from "react"
import { ITheme, useTheme } from "@chainsafe/common-theme"

export interface ILoadingProps {
  type?: "initial" | "primary" | "dark" | "light"
  size?: number
  className?: string
}

const Loading: React.FC<ILoadingProps> = ({
  type = "primary",
  size = 64,
  className
}) => {
  const theme: ITheme = useTheme()

  const uniqueKey = `${Math.random()}-${Math.random()}`

  const {
    start,
    end
  } = useMemo(() => {
    switch (type) {
      case "primary":
        return {
          start: theme.palette.primary.main,
          end: "transparent"
        }
      case "light":
        return {
          start: theme.palette.common.white.main,
          end: "transparent"
        }
      case "dark":
        return {
          start: theme.palette.common.black.main,
          end: "transparent"
        }
      case "initial":
        return {
          start: "#FFFFFF",
          end: "transparent"
        }
      default:
        return {
          start: "#FFFFFF",
          end: "transparent"
        }
    }
  }, [type, theme.palette])

  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient
          id={`gradient-${uniqueKey}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={start}
          />
          <stop
            offset="100%"
            stopColor={end}
          />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke={`url(#gradient-${uniqueKey})`}
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
