import React, { useState, ReactNode, useMemo } from "react"
import { Menu, MenuItem } from "@material-ui/core"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { useCallback } from "react"
import { CSFTheme } from "../Themes/types"

interface Option {
    contents: ReactNode
    onClick?: () => void
}

interface CustomClasses {
    iconContainer?: string
    menuWrapper?: string
    focusVisible?: string
}

interface Props {
    icon: ReactNode
    options: Option[]
    style?: CustomClasses
    testId?: string
}

const useStyles = makeStyles(({ constants }: CSFTheme) => {
  return createStyles({
    root:{
      backgroundColor: `${constants.dropDown.backgroundColor} !important`,
      color: `${constants.dropDown.color} !important`
    },
    iconContainer: {
      cursor: "pointer"
    },
    options: {
      "&:hover": {
        backgroundColor: `${constants.dropDown.backgroundOptionHover} !important`
      }
    }
  })})

export default function Dropdown({ icon, options, style, testId }: Props) {
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
        data-testid={`dropdown-title-${testId}`}
        className={clsx(classes.iconContainer, style?.iconContainer)}
        onClick={handleClick}
      >
        {icon}
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PopoverClasses={{ paper: classes.root }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose()
              option.onClick && option.onClick()
            }}
            focusVisibleClassName={clsx(style?.focusVisible)}
            className={classes.options}
          >
            {option.contents}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}