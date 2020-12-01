import React, { ReactNode } from "react"
import clsx from "clsx"
import { capitalize } from "../utils/stringUtils"
import { AlignOption } from "./types"
import {
  ITheme,
  IPalette,
  makeStyles,
  createStyles,
} from "@chainsafe/common-theme"
import { SortDirection } from "./types"
import { CaretDownSvg } from "../Icons"

const useStyles = makeStyles(
  ({ animation, palette, constants, overrides }: ITheme) =>
    createStyles({
      root: {
        fontWeight: "bold",
        verticalAlign: "middle",
        ...overrides?.Table?.headCell?.root,
      },
      alignLeft: {
        textAlign: "left",
        justifyContent: "flex-start",
        ...overrides?.Table?.headCell?.left,
      },
      alignCenter: {
        textAlign: "center",
        justifyContent: "center",
        ...overrides?.Table?.headCell?.center,
      },
      alignRight: {
        textAlign: "right",
        justifyContent: "flex-end",
        ...overrides?.Table?.headCell?.right,
      },
      sortButtons: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: palette.additional["gray"][2],
          ...overrides?.Table?.headCell?.sortButton?.hover,
        },
        ...overrides?.Table?.headCell?.sortButton?.root,
      },
      sortContainer: {
        display: "flex",
        alignItems: "center",
        ...overrides?.Table?.headCell?.sortContainer,
      },
      sortChildrenContainer: {
        flex: "1",
        "&.sortCenterAlign": {
          marginLeft: `${constants.generalUnit * 1.5}px`,
        },
        ...overrides?.Table?.headCell?.sortContainerChildren,
      },
      caret: {
        marginLeft: 4,
        fontSize: "12px",
        opacity: 0.4,
        "&.active": {
          opacity: 1,
        },
        "& svg": {
          fill: palette.additional["gray"][6],
        },
        "&.ascend": {
          transition: `transform ${animation.transform}ms`,
          transform: "rotate(-180deg)",
          "& svg": {
            fill: palette.additional["gray"][9],
          },
        },
        "&.descend": {
          transition: `transform ${animation.transform}ms`,
          transform: "rotate(0deg)",
          "& svg": {
            fill: palette.additional["gray"][9],
          },
        },
        ...overrides?.Table?.headCell?.caretContainerChildren,
      },
      caretContainer: {
        display: "inline-grid",
        ...overrides?.Table?.headCell?.caretContainer,
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
            <CaretDownSvg
              className={clsx(classes.caret, sortDirection, {
                active: sortActive,
              })}
            />
          </div>
        </div>
      ) : (
        children
      )}
    </td>
  )
}

export default TableHeadCell
