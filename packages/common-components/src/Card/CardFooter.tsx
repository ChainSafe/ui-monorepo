import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(
  ({ constants, palette, typography, overrides }: ITheme) =>
    createStyles({
      root: {
        padding: constants.generalUnit * 2,
        borderTop: `1px solid ${palette["gray"][4]}`,
        ...typography.body1,
        ...overrides?.Card?.footer?.root,
      },
      dense: {
        padding: constants.generalUnit,
        ...overrides?.Card?.footer?.dense,
      },
    }),
)

export interface ICardHeader {
  className?: string
  children?: ReactNode | ReactNode[]
  dense?: boolean
}

const CardHeader: React.FC<ICardHeader> = ({
  className,
  children,
  dense = false,
}: ICardHeader) => {
  const classes = useStyles()
  return (
    <div className={clsx(className, classes.root, dense && classes.dense)}>
      {children}
    </div>
  )
}

export default CardHeader
