import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import { Typography } from "../Typography"
import clsx from "clsx"
import { CaretDownIcon } from "../Icons"

const useStyles = makeStyles(() =>
  createStyles({
    // JSS in CSS goes here
    root: {},
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
    <div
      className={clsx(classes.root, className, {
        ["open"]: open,
      })}
    >
      <section>
        <Typography component="p" variant="body2">
          {title}
        </Typography>
        <CaretDownIcon />
      </section>
      <section>
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
