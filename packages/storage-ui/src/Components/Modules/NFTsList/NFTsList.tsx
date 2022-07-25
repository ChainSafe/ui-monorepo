import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Typography,
  Button,
  PlusIcon,
  Divider,
  Link,
  Loading
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../StorageRoutes"
import NFTItem from "./NFTItem"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import EmptySvg from "../../../Media/Empty.svg"

const useStyles = makeStyles(({ constants, breakpoints }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative",
      [breakpoints.down("md")]: {
        margin: constants.generalUnit
      }
    },
    loaderText: {
      marginTop: constants.generalUnit * 2
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: constants.generalUnit * 8
    },
    noFiles: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: constants.generalUnit * 20,
      "& svg": {
        maxWidth: 180,
        marginBottom: constants.generalUnit * 3
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
  const { sourceFiles, loadingCurrentPath } = useFileBrowser()

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
      {loadingCurrentPath
        ? <div className={classes.loadingContainer}>
          <Loading
            size={32}
            type="light"
          />
          <Typography
            variant="body2"
            component="p"
            className={classes.loaderText}
          >
            <Trans>One sec, getting NFTs...</Trans>
          </Typography>
        </div>
        : !sourceFiles.length
          ? <section className={classes.noFiles}>
            <EmptySvg />
            <Typography
              variant="h4"
              component="h4"
            >
              <Trans>No NFTs to show</Trans>
            </Typography>
          </section>
          : <div className={classes.nftGrid}>
            {sourceFiles?.map((sourceFile, i) =>
              <NFTItem
                key={i}
                CID={sourceFile.name}
              />
            )
            }
          </div>
      }
    </div>
  )
}

export default NFTsList
