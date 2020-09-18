import React, { ReactNode } from "react"
import clsx from "clsx"
import { Typography } from "../Typography"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      padding: theme.constants.generalUnit * 2,
      border: "1px solid",
      borderColor: theme.palette["gray"][4],
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
      {title && <Typography variant="h5">{title}</Typography>}
      {children}
    </div>
  )
}

export default CardHeader
