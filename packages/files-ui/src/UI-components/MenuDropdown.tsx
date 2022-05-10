import React, { useState, ReactNode, useMemo } from "react"
import { Menu as MaterialMenu, MenuItem, PopoverOrigin, PopoverPosition, PopoverReference } from "@material-ui/core"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { useCallback } from "react"
import { CSFTheme } from "../Themes/types"

interface Option {
  contents: ReactNode
  inset?: boolean
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

interface CustomClasses {
  focusVisible?: string
  root?: string
}

interface Props {
  open?: boolean
  options: Option[]
  style?: CustomClasses
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  anchorPosition?: PopoverPosition
  anchorReference?: PopoverReference
  onClose?: () => void
}

const useStyles = makeStyles(({ constants }: CSFTheme) => {
  return createStyles({
    paper:{
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
  open,
  options,
  style,
  anchorOrigin,
  transformOrigin,
  anchorPosition,
  anchorReference,
  onClose
}: Props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = useMemo(() => open === undefined ? Boolean(anchorEl) : open, [anchorEl, open])
  const classes = useStyles()

  const handleClose = useCallback(() => {
    if (onClose) onClose()
    else setAnchorEl(null)
  }, [onClose])

  return (
    <MaterialMenu
      anchorEl={open === undefined ? anchorEl : undefined}
      keepMounted
      open={isOpen}
      onClose={handleClose}
      PopoverClasses={{ paper: classes.paper, root: style?.root }}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      anchorPosition={anchorPosition}
      anchorReference={anchorReference}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          onClick={(e) => {
            option.onClick && handleClose()
            option.onClick && option.onClick(e)
          }}
          focusVisibleClassName={clsx(style?.focusVisible)}
          className={classes.options}
          disabled={option.disabled}
        >
          {option.contents}
        </MenuItem>
      ))}
    </MaterialMenu>
  )
}