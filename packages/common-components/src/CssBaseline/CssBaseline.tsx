import React, { ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import "normalize.css"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    ...theme.globalStyling
  })
)

interface IBaselineProps {
  children?: ReactNode | ReactNode[] | null
}

const CssBaseline: React.FC<IBaselineProps> = ({
  children = null
}: IBaselineProps) => {
  useStyles()
  return <>{children}</>
}

export default CssBaseline
