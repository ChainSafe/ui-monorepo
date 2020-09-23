import React, { ReactNode, useRef, useState } from "react"
import {
  makeStyles,
  createStyles,
  ITheme,
  useOnClickOutside,
} from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalDownIcon, SvgIcon } from "../Icons"
import { Paper } from "../Paper"

const useStyles = makeStyles(
  ({ constants, animation, typography, palette }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        display: "inline-block",
        position: "relative",
        "&.open": {},
      },
      title: {
        ...typography.body1,
        cursor: "pointer",
        display: "inline-flex",
        padding: `${constants.generalUnit * 1.5}px ${constants.generalUnit}px`,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        "& p": {
          position: "relative",
        },
      },
      icon: {
        fontSize: "unset",
        height: 14,
        width: 14,
        padding: 0,
        // Can create animation variant here
        "&.none": {},
        "&.flip": {
          "& svg": {
            transform: "rotateX(0deg)",
          },
          "&.open svg": {
            transform: "rotateX(180deg)",
          },
        },
        "&.rotate": {
          "& svg": {
            transform: "rotateZ(0deg)",
          },
          "&.open svg": {
            transform: "rotateZ(180deg)",
          },
        },
        "& svg": {
          marginLeft: constants.generalUnit,
          height: 14,
          width: 14,
          transitionDuration: `${animation.transform}ms`,
        },
      },
      options: {
        minWidth: "100%",
        backgroundColor: palette.common.white.main,
        height: 0,
        overflow: "hidden",
        visibility: "hidden",
        opacity: 0,
        transitionDuration: `${animation.transform}ms`,
        "&.top-left": {
          top: 0,
          left: 0,
        },
        "&.top-center": {
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        },
        "&.top-right": {
          top: 0,
          right: 0,
        },
        "&.bottom-left": {
          top: "100%",
          left: 0,
        },
        "&.bottom-center": {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
        },
        "&.bottom-right": {
          top: "100%",
          right: 0,
        },
        position: "absolute",
        "&.open": {
          height: "auto",
          opacity: 1,
          visibility: "visible",
        },
      },
      item: {
        cursor: "pointer",
        ...typography.body1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: `${constants.generalUnit * 1.5}px ${constants.generalUnit}px`,
        "& > *:first-child ~ *": {
          marginLeft: constants.generalUnit / 2,
        },
      },
    }),
)

interface IMenuItem {
  contents: ReactNode | ReactNode[]
  onClick: () => void
}

interface IMenuDropdownProps {
  className?: string
  indicator?: typeof SvgIcon
  animation?: "rotate" | "flip" | "none"
  anchor?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
  menuItems: IMenuItem[]
  title: string
}

const MenuDropdown: React.FC<IMenuDropdownProps> = ({
  className,
  menuItems,
  anchor = "bottom-center",
  indicator = DirectionalDownIcon,
  animation = "flip",
  title,
}: IMenuDropdownProps) => {
  const Icon = indicator
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)

  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    if (open) {
      setOpen(false)
    }
  })
  return (
    <div ref={ref} className={clsx(classes.root, className)}>
      <section
        onClick={() => setOpen(!open)}
        className={clsx(classes.title, {
          ["open"]: open,
        })}
      >
        <Typography component="p" variant="body2">
          {title}
        </Typography>
        <Icon
          className={clsx(classes.icon, animation, {
            ["open"]: open,
          })}
        />
      </section>
      <Paper
        shadow="shadow2"
        className={clsx(classes.options, anchor, {
          ["open"]: open,
        })}
      >
        {menuItems.map((item: IMenuItem, index: number) => (
          <div
            key={`menu-${index}`}
            className={classes.item}
            onClick={() => {
              setOpen(false)
              item.onClick()
            }}
          >
            {item.contents}
          </div>
        ))}
      </Paper>
    </div>
  )
}

export default MenuDropdown

export { IMenuDropdownProps }
