import React, { ReactNode, useState } from "react"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalDownIcon } from "../Icons"
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
        "& svg": {
          marginLeft: constants.generalUnit,
          height: 14,
          width: 14,
          transitionDuration: `${animation.transform}ms`,
          transform: "rotateX(0deg)",
        },
        "&.open svg": {
          transform: "rotateX(180deg)",
        },
      },
      options: {
        width: "100%",
        backgroundColor: palette.common.white.main,
        height: 0,
        overflow: "hidden",
        visibility: "hidden",
        opacity: 0,
        transitionDuration: `${animation.transform}ms`,
        top: "100%",
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
  menuItems: IMenuItem[]
  title: string
}

const MenuDropdown: React.FC<IMenuDropdownProps> = ({
  className,
  menuItems,
  title,
}: IMenuDropdownProps) => {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  return (
    <div className={clsx(classes.root, className)}>
      <section
        onClick={() => setOpen(!open)}
        className={clsx(classes.title, {
          ["open"]: open,
        })}
      >
        <Typography component="p" variant="body2">
          {title}
        </Typography>
        <DirectionalDownIcon
          className={clsx(classes.icon, {
            ["open"]: open,
          })}
        />
      </section>
      <Paper
        shadow="shadow2"
        className={clsx(classes.options, {
          ["open"]: open,
        })}
      >
        {menuItems.map((item: IMenuItem) => (
          <div
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
