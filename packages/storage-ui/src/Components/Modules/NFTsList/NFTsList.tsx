import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button,
  PlusIcon,
  Divider,
  Link
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../StorageRoutes"
import NFTItem from "./NFTItem"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"

const useStyles = makeStyles(({ constants, breakpoints }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative",
      [breakpoints.down("md")]: {
        margin: constants.generalUnit
      }
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
    },
    nftGrid: {
      display: "grid",
      gridColumnGap: constants.generalUnit * 5,
      gridRowGap: constants.generalUnit * 7,
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      marginBottom: constants.generalUnit * 12,
      [breakpoints.down("lg")]: {
        gridTemplateColumns: "1fr 1fr 1fr",
        gridColumnGap: constants.generalUnit * 3,
        gridRowGap: constants.generalUnit * 5
      },
      [breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr 1fr"
      }
    }
  })
)

const NFTsList = () => {
  const classes = useStyles()
  const { NFTs } = useFileBrowser()

  return (
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
      <div
        className={classes.nftGrid}
      >
        {NFTs?.map((NFT, i) =>
          <NFTItem
            key={i}
            {...NFT}
          />
        )
        }
      </div>
    </div>
  )
}

export default NFTsList
