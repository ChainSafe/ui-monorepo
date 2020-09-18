import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      padding: theme.constants.generalUnit * 2,
    },
    title: {
      ...theme.typography.h2,
    },
  }),
)

export interface ICardHeader {
  className?: string
  children?: ReactNode | ReactNode[]
  title: string
}

const CardHeader: React.FC<ICardHeader> = ({
  className,
  children,
  title,
}: ICardHeader) => {
  const classes = useStyles()
  return (
    <div className={clsx(className, classes.root)}>
      {title && <h2 className={classes.title}></h2>}
      {children}
    </div>
  )
}

export default CardHeader
