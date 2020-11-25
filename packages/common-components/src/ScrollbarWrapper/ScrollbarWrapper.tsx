import React, { ReactNode } from "react"
import SimpleBarReact from "simplebar-react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"

const useStyles = makeStyles(({ palette, overrides }: ITheme) =>
  createStyles({
    root: {
      "& .simplebar-vertical": {
        width: 5,
        borderRadius: 6,
        opacity: 1,
        backgroundColor: palette.primary.background,
        padding: 0,
      },
      "& .simplebar-scrollbar": {
        width: 5,
        borderRadius: 6,
        "&:before": {
          backgroundColor: palette.primary.main,
          width: 5,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      ...overrides?.ScrollbarWrapper?.root,
    },
  }),
)

export interface ScrollbarProps {
  autoHide?: boolean
  className?: string
  maxHeight?: number
  children: ReactNode
  forceVisible?: boolean
  scrollbarMinSize?: number
  scrollbarMaxSize?: number
  clickOnTrack?: boolean
  timeout?: number
  classNames?: {
    content?: string
    scrollContent?: string
    scrollbar?: string
    track?: string
  }
  direction?: "rtl" | "ltr"
}

const ScrollbarWrapper: React.FC<ScrollbarProps> = ({
  autoHide = true,
  clickOnTrack = true,
  className,
  classNames = {
    content: "simplebar-content",
    scrollContent: "simplebar-scroll-content",
    scrollbar: "simplebar-scrollbar",
    track: "simplebar-track",
  },
  direction = "ltr",
  scrollbarMaxSize = 25,
  scrollbarMinSize = 0,
  timeout = 1000,
  maxHeight,
  children,
}: ScrollbarProps) => {
  const classes = useStyles()
  return (
    <SimpleBarReact
      options={{
        autoHide,
        clickOnTrack,
        classNames,
        direction,
        scrollbarMaxSize,
        scrollbarMinSize,
        timeout,
      }}
      style={maxHeight ? { maxHeight: maxHeight } : {}}
      className={clsx(classes.root, className)}
    >
      {children}
    </SimpleBarReact>
  )
}

export default ScrollbarWrapper
