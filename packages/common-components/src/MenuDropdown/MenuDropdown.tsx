import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles(() =>
  createStyles({
    // JSS in CSS goes here
    root: {},
  }),
)

interface IMenuDropdownProps {
  className?: string
  seed: string
  size?: number
  scale?: number
  color?: string
  bgColor?: string
  spotColor?: string
}

const MenuDropdown: React.FC<IMenuDropdownProps> = ({}: IMenuDropdownProps) => {
  const classes = useStyles()
  return <span className={classes.root} />
}

export default MenuDropdown

export { IMenuDropdownProps }
