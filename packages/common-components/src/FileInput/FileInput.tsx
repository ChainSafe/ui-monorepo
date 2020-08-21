import React, { ReactNode } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
  }),
)

type FileInput = React.HTMLProps<HTMLInputElement>

interface IFileInputProps extends FileInput {
  className?: string
  children?: ReactNode | ReactNode[]
  fullsize?: boolean
  variant?: "dropzone " | "filepicker"
}

const FileInput: React.FC<IFileInputProps> = ({
  children,
  fullsize,
  className,
  disabled = false,
  ...rest
}: IFileInputProps) => {
  const classes = useStyles()
  return <div></div>
}

export default FileInput

export { IFileInputProps }
