import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
  }),
)

interface ISelectOptionProps {
  className?: string
  label: string
  value?: any
}

const SelectOption: React.FC<ISelectOptionProps> = ({ label, value }) => {
  const classes = useStyles()

  return (
    <option value={value || label} className={classes.root}>
      {label}
    </option>
  )
}

export default SelectOption
export { ISelectOptionProps }
