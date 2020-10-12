import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(({ constants, typography, overrides }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 2,
      ...typography.body1,
      ...overrides?.Card?.body?.root,
    },
    dense: {
      padding: constants.generalUnit,
      ...overrides?.Card?.body?.dense,
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
