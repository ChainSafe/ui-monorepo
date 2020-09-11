import React, { ReactNode } from "react"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { AlignOption } from "./types"
import {
  ITheme,
  IPalette,
  makeStyles,
  createStyles,
} from "@chainsafe/common-themes"
import { SortDirection } from "./types"
import { CaretUpIcon, CaretDownIcon } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      fontWeight: "bold",
      verticalAlign: "middle",
    },
    alignLeft: {
      textAlign: "left",
      justifyContent: "flex-start",
    },
    alignCenter: {
      textAlign: "center",
      justifyContent: "center",
    },
    alignRight: {
      textAlign: "right",
      justifyContent: "flex-end",
    },
    sortButtons: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette["gray"][2],
      },
    },
    sortContainer: {
      display: "flex",
      alignItems: "center",
    },
    caret: {
      fontSize: "10px",
      "& svg": {
        fill: theme.palette["gray"][6],
      },
    },
    caretActive: {
      "& svg": {
        fill: theme.palette.secondary.main,
      },
    },
    caretContainer: {
      display: "inline-grid",
      marginRight: `${theme.constants.generalUnit}px`,
    },
  }),
)

export interface ITableHeadCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
  align?: AlignOption
  sortButtons?: boolean
  sortDirection?: SortDirection
  color?: keyof IPalette
  style?: React.CSSProperties
  onSortChange?(
    e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
  ): void
}

const TableHeadCell: React.FC<ITableHeadCellProps> = ({
  children,
  align = "center",
  sortButtons,
  sortDirection,
  color = "secondary",
  onSortChange,
  className,
  ...rest
}: ITableHeadCellProps) => {
  const props = { color }
  const classes = useStyles(props)

  return (
    <th
      className={clsx(
        classes.root,
        sortButtons && classes.sortButtons,
        classes[`align${capitalize(align)}`],
        className,
      )}
      onClick={onSortChange}
      {...rest}
    >
      {sortButtons ? (
        <div
          className={clsx(
            classes.sortContainer,
            classes[`align${capitalize(align)}`],
          )}
        >
          <div className={classes.caretContainer}>
            <CaretUpIcon
              className={clsx(
                classes.caret,
                sortDirection === "ascend" && classes.caretActive,
              )}
            />
            <CaretDownIcon
              className={clsx(
                classes.caret,
                sortDirection === "descend" && classes.caretActive,
              )}
            />
          </div>
          {children}
        </div>
      ) : (
        children
      )}
    </th>
  )
}

export default TableHeadCell
