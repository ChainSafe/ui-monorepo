import React, { useState, ReactNode, useMemo } from "react"
import { Menu as MaterialMenu, MenuItem } from "@material-ui/core"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import clsx from "clsx"
import { useCallback } from "react"

interface Option {
  contents: ReactNode
  onClick?: () => void
}

interface CustomClasses {
  iconContainer?: string
  menuWrapper?: string
  focusVisible?: string
  root?: string
}

interface MenuProps {
  icon?: ReactNode
  options: Option[]
  style?: CustomClasses
  testId?: string
}

const useStyles = makeStyles(({ constants, palette }: ITheme) => {
  return createStyles({
    paper:{
      backgroundColor: `${constants.menu?.["backgroundColor"]} !important`,
      color: `${constants.menu?.["color"]} !important`
    },
    iconContainer: {
      cursor: "pointer",
      padding: constants.generalUnit * 0.5,
      "& svg": {
        stroke: palette.additional["gray"][8],
        left: 0,
        width: 14,
        height: 14,
        position: "absolute"
      }
    },
    options: {
      "&:hover": {
        backgroundColor: `${constants.menu?.["backgroundOptionHover"]} !important`
      }
    }
  })})

const Menu = ({ icon, options, style, testId }: MenuProps) => {
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
        data-testid={`menu-title-${testId}`}
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
      </MaterialMenu>
    </div>
  )
}

export default Menu
export { MenuProps }