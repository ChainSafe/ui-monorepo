import React, { useState, ReactNode, useMemo } from "react"
import { PopoverOrigin, PopoverPosition, PopoverReference } from "@material-ui/core"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import MenuDropdown from "./MenuDropdown"
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
  open?: boolean
  icon?: ReactNode
  options: Option[]
  style?: CustomClasses
  testId?: string
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  anchorPosition?: PopoverPosition
  anchorReference?: PopoverReference
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

export default function Menu({
  open,
  icon,
  options,
  style,
  testId,
  anchorOrigin,
  transformOrigin,
  anchorPosition,
  anchorReference
}: Props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = useMemo(() => open === undefined ? Boolean(anchorEl) : open, [anchorEl, open])
  const classes = useStyles()

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget)
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
      <MenuDropdown
        open={isOpen}
        options={options}
        style={{
          focusVisible: style?.focusVisible,
          root: style?.root
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        anchorPosition={anchorPosition}
        anchorReference={anchorReference}
      />
    </div>
  )
}