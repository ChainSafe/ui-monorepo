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
import NFTItem from "./NFTItem"


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
    },
    nftGrid: {
      display: "grid",
      columnGap: constants.generalUnit * 2,
      rowGap: constants.generalUnit * 2,
      width: "100%",
      gridTemplateColumns: "1fr 1fr 1fr 1fr"
    }
  })
)

const nftItems = [
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmeeTqNyJAnE1U23oKo6oj91zWG8Yqha8UiyJehP9SaUVZ",
    name: "Bart1",
    CID: "QmeeTqNyJAnE1U23oKo6oj91zWG8Yqha8UiyJehP9SaUVZ"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmS3AqVfqWrNvn4t6AbJzLAvgHvS16teUbY6jB5rVsaSMh",
    name: "Bart2",
    CID: "QmS3AqVfqWrNvn4t6AbJzLAvgHvS16teUbY6jB5rVsaSMh"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmcKuvy9VG7oJgwNpzEvz95vG43MvDrAQ5ec1dvtYoBxgq",
    name: "Bart3",
    CID: "QmcKuvy9VG7oJgwNpzEvz95vG43MvDrAQ5ec1dvtYoBxgq"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmbBgW56r5cppCNyyLGNzykjyfBCXToFDBJjTquvSETV7P",
    name: "Bart4",
    CID: "QmbBgW56r5cppCNyyLGNzykjyfBCXToFDBJjTquvSETV7P"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmU4dTwMvWJdN65tVA266UTWQbNtX6yUZ1zcA12cztw1y5",
    name: "Bart5",
    CID: "QmU4dTwMvWJdN65tVA266UTWQbNtX6yUZ1zcA12cztw1y5"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmSHz5pHgcVyxp5vEAR4HQ3wHxH3VWHWjjPsqgvdjFDwG9",
    name: "Bart6",
    CID: "QmSHz5pHgcVyxp5vEAR4HQ3wHxH3VWHWjjPsqgvdjFDwG9"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmYNy5W2PcMPzNDsYiNbyzKyJ6tnaUaospkfNCpF2BzTU3",
    name: "Bart7",
    CID: "QmYNy5W2PcMPzNDsYiNbyzKyJ6tnaUaospkfNCpF2BzTU3"
  },
  {
    imageURI: "https://ipfs.chainsafe.io/ipfs/QmbSJxfgVYA8tnMp584cJQaQrHxLMFMWHxNYevcYh427aE",
    name: "Bart8",
    CID: "QmbSJxfgVYA8tnMp584cJQaQrHxLMFMWHxNYevcYh427aE"
  }
]

const NFTsList = () => {
  const classes = useStyles()

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
      <div className={classes.nftGrid}>
        {nftItems.map((nftItem, i) => <NFTItem
          key={i}
          {...nftItem} />)}
      </div>
    </div>
  )
}

export default NFTsList
