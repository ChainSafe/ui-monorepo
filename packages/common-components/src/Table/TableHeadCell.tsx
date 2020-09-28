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
import { CaretDownSvg } from "../Icons"

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
        backgroundColor: theme.palette.additional["gray"][2],
      },
    },
    sortContainer: {
      display: "flex",
      alignItems: "center",
    },
    sortChildrenContainer: {
      flex: "1",
      "&.sortCenterAlign": {
        marginLeft: `${theme.constants.generalUnit * 1.5}px`,
      },
    },
    caret: {
      marginLeft: 4,
      fontSize: "12px",
      opacity: 0.4,
      "&.active": {
        opacity: 1,
      },
      "& svg": {
        fill: theme.palette.additional["gray"][6],
      },
      "&.ascend": {
        transition: `transform ${theme.animation.transform}ms`,
        transform: "rotate(-180deg)",
        "& svg": {
          fill: theme.palette.additional["gray"][9],
        },
      },
      "&.descend": {
        transition: `transform ${theme.animation.transform}ms`,
        transform: "rotate(0deg)",
        "& svg": {
          fill: theme.palette.additional["gray"][9],
        },
      },
    },
    caretContainer: {
      display: "inline-grid",
    },
  }),
)

export interface ITableHeadCellProps {
  className?: string
  children?: ReactNode | ReactNode[]
  align?: AlignOption
  sortButtons?: boolean
  sortDirection?: SortDirection
  sortActive?: boolean
  color?: keyof IPalette
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
  sortActive = false,
  ...rest
}: ITableHeadCellProps) => {
  const props = { color }
  const classes = useStyles(props)

  return (
    <td
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
          <div
            className={clsx(
              classes.sortChildrenContainer,
              align === "center" && "sortCenterAlign",
            )}
          >
            {children}
          </div>
          <div className={classes.caretContainer}>
            <CaretDownSvg className={clsx(classes.caret, sortDirection)} />
          </div>
        </div>
      ) : (
        children
      )}
    </td>
  )
}

export default TableHeadCell
