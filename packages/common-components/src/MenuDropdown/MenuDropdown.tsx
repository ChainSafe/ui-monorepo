import React, { useState } from "react"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalDownIcon } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      "&.open": {},
    },
    title: {
      cursor: "pointer",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.constants.generalUnit,
      "& p": {
        position: "relative",
      },
      "& svg": {
        height: 14,
        width: 14,
      },
    },
    icon: {
      fontSize: "unset",
      height: 14,
      width: 14,
      padding: 0,
    },
    options: {
      "&.open": {},
    },
  }),
)

interface IMenuItem {
  title: string
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
        className={clsx(classes.title, {
          ["open"]: open,
        })}
      >
        <Typography component="p" variant="body2">
          {title}
        </Typography>
        <DirectionalDownIcon className={classes.icon} />
      </section>
      <section
        className={clsx(classes.options, {
          ["open"]: open,
        })}
      >
        {menuItems.map((item: IMenuItem) => (
          <Typography
            component="p"
            variant="body2"
            onClick={() => {
              setOpen(false)
              item.onClick()
            }}
          >
            {item.title}
          </Typography>
        ))}
      </section>
    </div>
  )
}

export default MenuDropdown

export { IMenuDropdownProps }
