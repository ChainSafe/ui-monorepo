import React from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    spinnerBorder: {
      width: constants.generalUnit * 4,
      height: constants.generalUnit * 4,
      padding: 3,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      animation: "$spin 0.8s linear 0s infinite",
      "&.primary": {
        background: `linear-gradient(0deg,${palette.primary.main} 33%,${palette.background.default} 100%)`,
      },
      "&.dark": {
        background: `linear-gradient(0deg,${palette.common.black.main} 33%,${palette.common.white.main} 100%)`,
      },
      "&.light": {
        background: `linear-gradient(0deg,${palette.common.white.main} 66%,${palette.common.black.main} 100%)`,
      },
    },
    spinnerCore: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      "&.primary": {
        background: palette.common.white.main,
      },
      "&.dark": {
        background: palette.common.white.main,
      },
      "&.light": {
        background: palette.common.black.main,
      },
    },
    "@keyframes spin": {
      from: {
        transform: "rotate(0)",
      },
      to: {
        transform: "rotate(359deg)",
      },
    },
  }),
)

export interface ILoadingProps {
  type?: "primary" | "dark" | "light"
}

const Loading: React.FC<ILoadingProps> = ({ type = "primary" }) => {
  const classes = useStyles()
  return (
    <svg
      type={type}
      className={clsx(classes["a"])}
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="blue" />
          <stop offset="75%" stop-color="transparent" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="url(#gradient)"
        stroke-width="6"
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
