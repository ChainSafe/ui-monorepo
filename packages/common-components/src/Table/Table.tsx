import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@imploy/common-themes"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ animation, constants, palette, overrides }: ITheme) =>
    createStyles({
      root: {
        display: "flex",
        flexDirection: "column",
        minWidth: "min-content",
        borderCollapse: "collapse",
        borderSpacing: 0,
        transition: `all ${animation.transform}ms`,
        textAlign: "left",
        "& th, & td": {
          padding: `${constants.generalUnit * 2}px`,
        },
        ...overrides?.Table.table?.root,
      },
      fullWidth: {
        width: "100%",
      },
      dense: {
        "& th, & td": {
          padding: `${constants.generalUnit * 1.8}px`,
        },
        ...overrides?.Table.table?.dense,
      },
      hover: {
        "& tr:hover": {
          backgroundColor: palette.additional["gray"][2],
        },
        "& tr:nth-child(even)": {
          "&:hover": {
            backgroundColor: palette.additional["gray"][2],
          },
        },
        "&.selected": {
          "&:hover": {
            backgroundColor: palette.additional["gray"][4],
          },
        },
        ...overrides?.Table.table?.hover,
      },
      striped: {
        "& tr:nth-child(even)": {
          backgroundColor: palette.additional["gray"][2],
          "&.selected": {
            backgroundColor: palette.additional["gray"][4],
          },
        },
        ...overrides?.Table.table?.striped,
      },
    }),
)

export interface ITableProps {
  className?: string
  children: ReactNode | ReactNode[]
  striped?: boolean
  fullWidth?: boolean
  hover?: boolean
  dense?: boolean
}

const Table: React.FC<ITableProps> = ({
  children,
  className,
  fullWidth,
  striped,
  hover,
  dense,
  ...rest
}: ITableProps) => {
  const classes = useStyles()

  return (
    <table
      className={clsx(
        classes.root,
        {
          [classes.hover]: hover,
          [classes.fullWidth]: fullWidth,
          [classes.dense]: dense,
          [classes.striped]: striped,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  )
}

export default Table
