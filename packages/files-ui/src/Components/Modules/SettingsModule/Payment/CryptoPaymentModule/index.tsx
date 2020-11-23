import React, { useCallback, useEffect, useState } from "react"
import {
  makeStyles,
  ITheme,
  createStyles,
  useTheme,
  useMediaQuery,
} from "@imploy/common-themes"
import {
  ArrowLeftIcon,
  Button,
  Divider,
  Link,
  TextInput,
  Typography,
  useParams,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../../../../FilesRoutes"
import { Trans } from "@lingui/macro"
import { useImployApi } from "@imploy/common-contexts"
import { useWeb3 } from "@chainsafe/web3-context"
import { TokenInfo } from "@chainsafe/web3-context/dist/context/tokensReducer"
import { parseUnits } from "ethers/lib/utils"
import ZigZagSvg from "../../../../../Media/ZigZag.svg"

const useStyles = makeStyles(({ constants, breakpoints, palette }: ITheme) =>
  createStyles({
    root: {
      padding: 0,
      marginBottom: constants.generalUnit * 6,
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit * 2,
        padding: `0 ${constants.generalUnit}px`,
      },
    },
    header: {
      marginBottom: constants.generalUnit * 6,
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit * 2,
      },
    },
    heading: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit * 2,
      },
    },
    backIcon: {
      fontSize: "10px",
      marginRight: constants.generalUnit,
    },
    orderSummary: {
      [breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      "& > *": {
        [breakpoints.up("md")]: {
          width: "50%",
        },
      },
    },
    orderMeta: {
      padding: `0 ${constants.generalUnit * 6.75}px`,
      "& h1": {
        marginBottom: constants.generalUnit * 2,
      },
      "& h2": {
        marginBottom: constants.generalUnit,
      },
    },
    metaDivider: {
      margin: `${constants.generalUnit * 3}px 0`,
    },
    metaTopHeader: {
      marginTop: constants.generalUnit * 2.125,
      marginBottom: constants.generalUnit,
    },
    metaDetails: {
      fontWeight: 400,
    },
    quote: {
      padding: constants.generalUnit * 6.75,
      borderTop: `1px solid ${palette.additional["gray"][8]}`,
      borderLeft: `1px solid ${palette.additional["gray"][8]}`,
      borderRight: `1px solid ${palette.additional["gray"][8]}`,
      position: "relative",
    },
    quoteBorder: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
    },
    quoteHeading: {
      marginBottom: constants.generalUnit,
    },
    quoteSubscription: {
      marginBottom: constants.generalUnit * 4.125,
    },
    quoteBillingDetails: {
      marginTop: constants.generalUnit * 4.125,
      marginBottom: constants.generalUnit * 1.5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        "&:first-child": {
          fontWeight: 600,
        },
        "&:last-child": {
          color: palette.additional["gray"][8],
          textDecoration: "underline",
          cursor: "pointer",
        },
      },
    },
    quoteOrderPeriod: {
      fontWeight: 400,
    },
    prices: {
      position: "relative",
      marginTop: constants.generalUnit * 0.5,
      paddingTop: constants.generalUnit * 3.375,
      paddingBottom: constants.generalUnit * 3.875,
    },
    previousPrice: {
      position: "absolute",
      top: 0,
      left: 0,
      color: palette.additional["gray"][7],
      textDecoration: "line-through",
    },
    currentPrice: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      "& > *:first-child": {
        color: palette.additional["gray"][8],
      },
      "& span": {
        marginLeft: constants.generalUnit * 1.5,
      },
    },
    quoteBillingAccount: {
      marginBottom: constants.generalUnit,
    },
    quoteEmail: {
      fontWeight: 400,
      marginBottom: constants.generalUnit * 3.5,
    },
    promoCode: {
      marginBottom: constants.generalUnit * 3.125,
      "& > section": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    promoInput: {
      marginLeft: 0,
    },
    button: {
      marginTop: constants.generalUnit * 1.5,
    },
  }),
)

enum BILLING_PERIOD {
  Yearly = "yearly",
  Monthly = "monthly",
}

const RECIPIENT_ADDRESS = "0xE04e767a39E5B6D9a1BC79ba720707b91502443B"
const COST = 1

const CryptoPaymentModule: React.FC = () => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  const { selectWallet } = useImployApi()
  const { wallet, tokens } = useWeb3()

  const { plan } = useParams<{
    plan: string
  }>()

  const [billingPeriod, setBillingPeriod] = useState<BILLING_PERIOD>(
    BILLING_PERIOD.Yearly,
  )

  const [connected, setConnected] = useState(false)
  const [targetToken, setTargetToken] = useState<TokenInfo | undefined>()
  useEffect(() => {
    if (wallet && Object.keys(tokens).length > 0) {
      setConnected(true)
      const newTarget = Object.keys(tokens).find(
        (key) => tokens[key].symbol === "DAI",
      )
      if (newTarget) {
        setTargetToken(tokens[newTarget])
      }
    } else if (connected) {
      setConnected(false)
      setTargetToken(undefined)
    }
  }, [wallet, tokens, connected])

  const transferTokens = useCallback(() => {
    if (targetToken && targetToken.transfer) {
      targetToken.transfer(RECIPIENT_ADDRESS, parseUnits(`${COST}`, 18))
    }
  }, [targetToken])

  return (
    <article className={classes.root}>
      <header className={classes.header}>
        {!desktop && (
          <Link to={ROUTE_LINKS.ChoosePlan}>
            <ArrowLeftIcon className={classes.backIcon} />
            <Typography>
              <Trans>Back to plan settings</Trans>
            </Typography>
          </Link>
        )}
        <Typography className={classes.heading} variant="h1" component="h2">
          {/* TODO: Dynamic translation issue */}
          {desktop ? `Purchase a ${plan} subscription` : "Checkout"}
        </Typography>
        {desktop && (
          <Link to={ROUTE_LINKS.ChoosePlan}>
            <ArrowLeftIcon className={classes.backIcon} />
            <Typography>
              <Trans>Back to plan settings</Trans>
            </Typography>
          </Link>
        )}
      </header>
      <section className={classes.orderSummary}>
        <div className={classes.orderMeta}>
          <Typography variant="h1" component="h1">
            <Trans>Order Summary</Trans>
          </Typography>
          <Typography variant="h2" component="h2">
            <Trans>Is this correct?</Trans>
          </Typography>
          <Divider className={classes.metaDivider} />
          <Typography variant="h2" component="h2">
            <Trans>By the way,</Trans>
          </Typography>
          <Typography
            className={classes.metaTopHeader}
            variant="h5"
            component="p"
          >
            <Trans>It’s between you and Files</Trans>
          </Typography>
          <Typography
            className={classes.metaDetails}
            variant="h5"
            component="p"
          >
            <Trans>
              All plans use the same end-to-end encryption algorithms.
            </Trans>
          </Typography>
          <Typography
            className={classes.metaTopHeader}
            variant="h5"
            component="p"
          >
            <Trans>Only if you need it</Trans>
          </Typography>
          <Typography className={classes.metaDetails} variant="h5">
            <Trans>
              You can <a href="#">add other apps</a> to your Files plan for a
              seamless, private digital workspace. So you only pay for the
              features you want.
            </Trans>
          </Typography>
          <Divider className={classes.metaDivider} />
          <Typography
            className={classes.metaTopHeader}
            variant="h5"
            component="p"
          >
            <Trans>Support</Trans>
          </Typography>
          <Typography className={classes.metaDetails} variant="h5">
            <Trans>
              If you need help plan changes, check out this <a href="#">page</a>
              , or contact
            </Trans>{" "}
            <a href="mailto:support@chainsafefiles.io">
              support@chainsafefiles.io
            </a>
            .
          </Typography>
        </div>
        <div className={classes.quote}>
          {/* <ZigZagSvg className={classes.quoteBorder} /> */}
          <Typography
            className={classes.quoteHeading}
            variant="h4"
            component="p"
          >
            <Trans>Subscription Type</Trans>
          </Typography>
          <Typography
            className={classes.quoteSubscription}
            variant="h5"
            component="p"
          >
            <Trans>Files Plus Subscription - Individual</Trans>
          </Typography>
          <div className={classes.quoteBillingDetails}>
            <Typography variant="h5" component="p">
              <Trans>Billing Details</Trans>
            </Typography>
            <Typography
              variant="h5"
              component="p"
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === BILLING_PERIOD.Yearly
                    ? BILLING_PERIOD.Monthly
                    : BILLING_PERIOD.Yearly,
                )
              }
            >
              {billingPeriod === BILLING_PERIOD.Yearly ? (
                <>
                  <Trans>Change to</Trans>
                  {` ${BILLING_PERIOD.Monthly}`}
                </>
              ) : (
                <>
                  <Trans>Change to</Trans>
                  {` ${BILLING_PERIOD.Yearly}`}
                </>
              )}
            </Typography>
          </div>
          <Typography
            className={classes.quoteOrderPeriod}
            variant="h5"
            component="p"
          >
            {billingPeriod === BILLING_PERIOD.Yearly ? (
              <Trans>Billed Yearly</Trans>
            ) : (
              <Trans>Billed Monthly</Trans>
            )}
          </Typography>
          <div className={classes.prices}>
            <Typography
              className={classes.previousPrice}
              variant="h5"
              component="p"
            >
              <Trans>USD $107.68</Trans>
            </Typography>
            <Typography
              className={classes.currentPrice}
              variant="h2"
              component="p"
            >
              <Trans>USD $83.88</Trans>
              <Typography variant="h5" component="span">
                {billingPeriod === BILLING_PERIOD.Yearly ? (
                  <Trans>per year</Trans>
                ) : (
                  <Trans>per month</Trans>
                )}
              </Typography>
            </Typography>
          </div>
          <Typography
            className={classes.quoteBillingAccount}
            variant="h4"
            component="p"
          >
            <Trans>Billing account</Trans>
          </Typography>
          <Typography className={classes.quoteEmail} variant="h5" component="p">
            tanmoy@chainsafe.io
          </Typography>
          <div className={classes.promoCode}>
            <Typography variant="h5" component="p">
              <Trans>Promo Code</Trans>
            </Typography>
            <section>
              <TextInput
                className={classes.promoInput}
                onChange={(value: string | number | undefined) =>
                  console.log(value)
                }
              />
              <Button variant="primary">
                <Trans>Use Code</Trans>
              </Button>
            </section>
          </div>
          {!connected ? (
            <Button fullsize onClick={() => selectWallet()} variant="primary">
              <Trans>Yes, connect crypto wallet</Trans>
            </Button>
          ) : targetToken && targetToken?.balance >= COST ? (
            <Button fullsize onClick={() => transferTokens()} variant="primary">
              <Trans>Pay with Dai</Trans>
            </Button>
          ) : (
            <Typography>Balance insufficent</Typography>
          )}
          <Button className={classes.button} fullsize variant="outline">
            <Trans>No, go back</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default CryptoPaymentModule
