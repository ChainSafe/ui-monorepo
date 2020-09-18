import React from "react"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-themes"
import { Typography } from "../Typography"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    logoContainer: {
      display: "flex",
      alignItems: "center",
    },
    logoImage: {
      width: "fit-content",
    },
    logoText: {
      fontWeight: theme.typography.fontWeight.semibold,
      paddingLeft: theme.constants.generalUnit,
    },
  }),
)

const ChainsafeFilesLogo: React.FC<{ showText?: boolean }> = ({
  showText = true,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.logoContainer}>
      <img
        src="ChainSafe-logo.png"
        alt="Chainsafe Logo"
        className={classes.logoImage}
      />
      {showText && (
        <Typography variant="subtitle2" className={classes.logoText}>
          ChainSafe Files
        </Typography>
      )}
    </div>
  )
}

export default ChainsafeFilesLogo
