import React, { Fragment } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
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

const useStyles = makeStyles((theme: ITheme) =>
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
    },
    seperator: {
      padding: `${theme.constants.generalUnit}px ${theme.constants.generalUnit}px`,
      color: theme.palette["gray"][7],
      position: "relative",
      "& > *": {
        top: `calc(50% + 2px)`,
        left: "50%",
        display: "block",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        height: 16,
      },
    },
    crumb: {
      display: "inline-block",
      "&.clickable": {
        cursor: "pointer",
      },
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
      {/* TODO: Replace with Home icon */}
      <HomeIcon
        className={clsx(classes.home, homeOnClick && "clickable")}
        onClick={() => (homeOnClick ? homeOnClick() : null)}
      />
      {crumbs.map((item: Crumb, index: number) => (
        <Fragment key={`crumb-${index}`}>
          <div className={clsx(classes.seperator)}>
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
