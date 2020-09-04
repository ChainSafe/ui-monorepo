import React, { FormEvent, ReactNode } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      cursor: "pointer",
      display: "flex",
    },
  }),
)

interface ISelectInputProps {
  className?: string
  size?: "large" | "medium" | "small"
  label?: string
  error?: string
  onChange(event: FormEvent<HTMLInputElement>): void
  children: ReactNode[]
  disabled?: boolean
  multiple?: boolean
  value?: any
}

const SelectInput: React.FC<ISelectInputProps> = ({
  className,
  children,
  // size = "medium",
  disabled = false,
  multiple = false,
  onChange,
  label,
}) => {
  const classes = useStyles()

  const handleChange = (event: any) => {
    !disabled && onChange(event)
  }

  return (
    <>
      {label && <label>{label}</label>}
      <select
        className={clsx(classes.root, className)}
        onChange={handleChange}
        multiple={multiple}
      >
        {children}
      </select>
    </>
  )
}

export default SelectInput
export { ISelectInputProps as IDropdownProps }
