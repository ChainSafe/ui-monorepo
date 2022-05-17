import React, {  ReactNode, useRef } from "react"
import { MenuItem, Paper, PopoverPosition } from "@material-ui/core"
import { makeStyles, createStyles, useOnClickOutside } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CSFTheme } from "../Themes/types"

interface Option {
  contents: ReactNode
  inset?: boolean
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

interface Props {
  isOpen: boolean
  options: Option[]
  anchorPosition?: PopoverPosition
  onClose: () => void
}

interface StyleProps {
  top: number
  left: number
}

const useStyles = makeStyles(({ constants, zIndex, animation }: CSFTheme) => {
  return createStyles({
    anchorRoot: (styleProps: StyleProps) => ({
      position: "fixed",
      top: styleProps.top,
      left: styleProps.left,
      zIndex: zIndex?.blocker,
      visibility: "hidden",
      opacity: 0,
      transition: `opacity ${animation.transform * 2}ms`,
      "&.open": {
        visibility: "visible",
        opacity: 1
      }
    }),
    paper: {
      padding: `${constants.generalUnit}px 0`,
      backgroundColor: `${constants.menu.backgroundColor} !important`,
      color: `${constants.menu.color} !important`
    },
    options: {
      "&:hover": {
        backgroundColor: `${constants.menu.backgroundOptionHover} !important`
      }
    }
  })})

export default function MenuDropdown({
  isOpen,
  options,
  anchorPosition,
  onClose
}: Props) {
  const classes = useStyles({
    top: anchorPosition?.top || 0,
    left: anchorPosition?.left || 0
  })
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onClose)

  return (
    <div
      className={clsx(classes.anchorRoot, isOpen && !!anchorPosition && "open")}
      ref={ref}
    >
      <Paper className={classes.paper}>
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              option.onClick && onClose()
              option.onClick && option.onClick(e)
            }}
            className={classes.options}
            disabled={option.disabled}
          >
            {option.contents}
          </MenuItem>
        ))}
      </Paper>

    </div>
  )
}