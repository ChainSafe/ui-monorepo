import React, { ReactNode, Fragment } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    ...theme.globalStyling,
  }),
)

interface IBaselineProps {
  children?: ReactNode | ReactNode[] | null
}

const CssBaseline: React.FC<IBaselineProps> = ({
  children = null,
}: IBaselineProps) => {
  useStyles()
  return <Fragment>{children}</Fragment>
}

export default CssBaseline
