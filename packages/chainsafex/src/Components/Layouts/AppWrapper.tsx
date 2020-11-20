import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import { ReactNode } from "react"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

const useStyles = makeStyles(({}: ITheme) => {
  return createStyles({
    root: {},
  })
})

const AppWrapper: React.FC<IAppWrapper> = ({ children }: IAppWrapper) => {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

export default AppWrapper
