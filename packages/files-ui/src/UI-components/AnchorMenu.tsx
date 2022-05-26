import React, {  ReactNode, useCallback, useEffect, useMemo, useRef } from "react"
import { MenuItem, Paper, PopoverPosition } from "@material-ui/core"
import { makeStyles, createStyles, useOnClickOutside } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CSFTheme } from "../Themes/types"

export type AnchoreMenuPosition = PopoverPosition;

interface Option {
  contents: ReactNode
  inset?: boolean
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

interface Props {
  options: Option[]
  anchorPosition?: AnchoreMenuPosition
  onClose: () => void
}

type Position = {
  top?: number
  left?: number
  bottom?: number
  right?: number
}


const useStyles = makeStyles(({ constants, zIndex, animation }: CSFTheme) => {
  return createStyles({
    anchorRoot: (styleProps?: Position) => ({
      position: "fixed",
      top: styleProps?.top,
      left: styleProps?.left,
      bottom: styleProps?.bottom,
      right: styleProps?.right,
      zIndex: zIndex?.blocker,
      transition: `opacity ${animation.transform * 2}ms`
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

const MENU_RIGHT_SPACE_TOLERANCE = 180
const MENU_BOTTOM_SPACE_TOLERANCE = 250

export default function MenuDropdown({ options, anchorPosition, onClose }: Props) {
  const position = useMemo(() => {
    if (!anchorPosition) return

    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const position: Position = {}
    // calculate top or bottom
    if (windowHeight - anchorPosition.top > MENU_BOTTOM_SPACE_TOLERANCE) {
      position.top = anchorPosition.top
    } else {
      position.bottom = windowHeight - anchorPosition.top
    }
    // calculate left or right
    if (windowWidth - anchorPosition.left > MENU_RIGHT_SPACE_TOLERANCE) {
      position.left = anchorPosition.left
    } else {
      position.right = windowWidth - anchorPosition.left
    }
    return position
  }, [anchorPosition])

  const onCloseMenu = useCallback(() => {
    document.body.style.overflowY = "scroll"
    onClose()
  }, [onClose])
  const classes = useStyles(position)

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onCloseMenu)

  useEffect(() => {
    document.body.style.overflowY = "hidden"
  }, [])

  if (!position) return null

  return (
    <div
      className={clsx(classes.anchorRoot)}
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