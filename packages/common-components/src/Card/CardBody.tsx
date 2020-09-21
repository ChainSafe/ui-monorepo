import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      padding: theme.constants.generalUnit * 2,
      ...theme.typography.body1,
    },
    dense: {
      padding: theme.constants.generalUnit,
    },
  }),
)

export interface ICardBody {
  className?: string
  children?: ReactNode | ReactNode[]
  dense?: boolean
}

const CardHeader: React.FC<ICardBody> = ({
  className,
  children,
  dense = false,
}: ICardBody) => {
  const classes = useStyles()
  return (
    <div className={clsx(className, classes.root, dense && classes.dense)}>
      {children}
    </div>
  )
}

export default CardHeader
