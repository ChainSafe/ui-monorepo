import React, { Fragment } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import Typography from "../Typography"

type Crumb = {
  text: string
  onClick?: () => void
}

type BreadcrumbProps = {
  crumbs?: Crumb[]
  className: string
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
    },
    seperator: {
      diplay: "inline-block",
      padding: `${theme.constants.generalUnit}px ${theme.constants.generalUnit}px`,
    },
    crumb: {
      diplay: "inline-block",
      "&.clickable": {
        cursor: "pointer",
      },
    },
  }),
)

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  crumbs = [],
  className,
}: BreadcrumbProps) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, className)}>
      {/* TODO: Replace with Home icon */}
      <span className={clsx(classes.seperator)}>/</span>
      {crumbs.map((item: Crumb, index: number) => (
        <Fragment key={`crumb-${index}`}>
          <span className={clsx(classes.seperator)}>/</span>
          <Typography
            onClick={() => (item.onClick ? item.onClick() : null)}
            className={clsx(classes.crumb, item.onClick && "clickable")}
            variant="body2"
          >
            {item.text}
          </Typography>
        </Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
