import React, { useState, ReactNode } from "react";
import {Menu, MenuItem} from "@material-ui/core"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../Themes/types";
import clsx from "clsx";

interface Option {
    contents: ReactNode,
    onClick?: () => void
}

interface CustomClasses {
    iconContainer: Record<string, string>
    menuWrapper: Record<string, string>
}

interface Props {
    icon: ReactNode
    options: Option[]
    style?: CustomClasses
}

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
    return createStyles({
      iconContainer: {
        cursor: "pointer",
    }
})})

export default function Dropdown({icon, options, style}: Props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles()
  
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div className={clsx(style?.menuWrapper)}>
        <div
            className={clsx(classes.iconContainer, style?.iconContainer)}
            onClick={handleClick}
        >
          {icon}
        </div>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          {options.map((option, index) => (
            <MenuItem key={index} onClick={option.onClick}>
              {option.contents}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }