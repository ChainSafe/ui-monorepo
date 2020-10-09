import React, { ReactNode } from "react"
import clsx from "clsx"
import { Typography } from "../Typography"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles(
  ({ constants, palette, typography, overrides }: ITheme) =>
    createStyles({
      root: {
        padding: constants.generalUnit * 2,
        borderBottom: `1px solid ${palette["gray"][4]}`,
        ...typography.h5,
        ...overrides?.Card?.header?.root,
      },
      dense: {
        padding: constants.generalUnit,
        ...overrides?.Card?.header?.dense,
      },
    }),
)

export interface ICardHeader {
  className?: string
  children?: ReactNode | ReactNode[]
  title?: string
  dense?: boolean
}

const CardHeader: React.FC<ICardHeader> = ({
  className,
  children,
  title,
  dense = false,
}: ICardHeader) => {
  const classes = useStyles()
  return (
    <div className={clsx(className, classes.root, dense && classes.dense)}>
      {title && (
        <Typography variant="h5" component="h5">
          {title}
        </Typography>
      )}
      {children}
    </div>
  )
}

export default CardHeader
