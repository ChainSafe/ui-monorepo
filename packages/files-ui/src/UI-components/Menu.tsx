import React, { useState, ReactNode, useMemo } from "react"
import { Menu as MaterialMenu, MenuItem, PopoverOrigin } from "@material-ui/core"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { useCallback } from "react"
import { CSFTheme } from "../Themes/types"

interface Option {
  contents: ReactNode
  inset?: boolean
  testId?: string
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

interface CustomClasses {
  iconContainer?: string
  menuWrapper?: string
  focusVisible?: string
  root?: string
}

interface Props {
  icon?: ReactNode
  options: Option[]
  style?: CustomClasses
  testId?: string
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
}

const useStyles = makeStyles(({ constants }: CSFTheme) => {
  return createStyles({
    paper:{
      backgroundColor: `${constants.menu.backgroundColor} !important`,
      color: `${constants.menu.color} !important`
    },
    iconContainer: {
      cursor: "pointer"
    },
    options: {
      "&:hover": {
        backgroundColor: `${constants.menu.backgroundOptionHover} !important`
      }
    }
  })})

export default function Menu({ icon, options, style, testId, anchorOrigin, transformOrigin }: Props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = useMemo(() => Boolean(anchorEl), [anchorEl])
  const classes = useStyles()

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <div className={clsx(style?.menuWrapper)}>
      <div
        data-testid={`icon-${testId}`}
        className={clsx(classes.iconContainer, style?.iconContainer)}
        onClick={handleClick}
      >
        {icon}
      </div>
      <MaterialMenu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PopoverClasses={{ paper: classes.paper, root: style?.root }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
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
    </div>
  )
}