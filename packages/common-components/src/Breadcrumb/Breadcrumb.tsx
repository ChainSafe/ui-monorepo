import React, { Fragment } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"
import { HomeIcon } from "../Icons"
import { Typography } from "../Typography"

export type Crumb = {
  text: string
  onClick?: () => void
}

export type BreadcrumbProps = {
  crumbs?: Crumb[]
  homeOnClick?: () => void
  className?: string
}

const useStyles = makeStyles(
  ({ constants, palette, zIndex, overrides }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        margin: 0,
        display: "flex",
        alignItems: "center",
        "& > *": {
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...overrides?.Breadcrumb.root,
      },
      home: {
        height: 16,
        "& > svg": {
          display: "block",
          height: "100%",
        },
        "&.clickable": {
          cursor: "pointer",
        },
        ...overrides?.Breadcrumb.home,
      },
      separator: {
        padding: `${constants.generalUnit}px ${constants.generalUnit}px`,
        color: palette.additional["gray"][7],
        position: "relative",
        zIndex: zIndex?.background,
        "& > *": {
          top: `calc(50% + 2px)`,
          left: "50%",
          display: "block",
          position: "absolute",
          transform: "translate(-50%, -50%)",
          height: 16,
        },
        ...overrides?.Breadcrumb.separator,
      },
      crumb: {
        display: "inline-block",
        "&.clickable": {
          cursor: "pointer",
        },
        ...overrides?.Breadcrumb.crumb,
      },
    }),
)

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  crumbs = [],
  homeOnClick,
  className,
}: BreadcrumbProps) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, className)}>
      <HomeIcon
        className={clsx(classes.home, homeOnClick && "clickable")}
        onClick={() => (homeOnClick ? homeOnClick() : null)}
      />
      {crumbs.map((item: Crumb, index: number) => (
        <Fragment key={`crumb-${index}`}>
          <div className={clsx(classes.separator)}>
            <span>/</span>
          </div>
          <div>
            <Typography
              onClick={() => (item.onClick ? item.onClick() : null)}
              className={clsx(classes.crumb, item.onClick && "clickable")}
              variant="body2"
            >
              {item.text}
            </Typography>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
