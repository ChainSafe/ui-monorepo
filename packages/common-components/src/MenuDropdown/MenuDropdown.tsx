import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { DirectionalDownIcon } from "../Icons"

const useStyles = makeStyles(() =>
  createStyles({
    // JSS in CSS goes here
    root: {
      "&.open": {},
    },
    title: {
      cursor: "pointer",
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
        <DirectionalDownIcon />
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
