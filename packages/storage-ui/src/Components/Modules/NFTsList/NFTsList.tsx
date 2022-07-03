import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button,
  PlusIcon,
  Divider,
  Link } from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../StorageRoutes"


const useStyles = makeStyles(({ constants, breakpoints }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative"
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2,
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    controls: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > button": {
        marginLeft: constants.generalUnit
      },
      "& > a": {
        textDecoration: "none"
      }
    }
  })
)

const ApiKeys = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.root}>
        <header className={classes.header}>
          <Typography
            variant="h1"
            component="h1"
          >
            <Trans>NFTs</Trans>
          </Typography>
          <div className={classes.controls}>
            <Link to={ROUTE_LINKS.UploadNFT}>
              <Button
                variant="outline"
                size="large"
              >
                <PlusIcon />
                <span><Trans>New NFT</Trans></span>
              </Button>
            </Link>
          </div>
        </header>
        <Divider />
        <div>Hello NFTs</div>
      </div>
    </>
  )
}

export default ApiKeys
