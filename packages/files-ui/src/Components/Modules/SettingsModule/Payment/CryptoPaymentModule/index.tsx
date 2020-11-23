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

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      padding: 0,
      marginBottom: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("md")]: {
        marginTop: theme.constants.generalUnit * 2,
        padding: `0 ${theme.constants.generalUnit}px`,
      },
    },
    header: {
      marginBottom: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("md")]: {
        marginBottom: theme.constants.generalUnit * 2,
      },
    },
    heading: {
      marginBottom: theme.constants.generalUnit * 4,
      [theme.breakpoints.down("md")]: {
        marginBottom: theme.constants.generalUnit * 2,
      },
    },
    backIcon: {
      fontSize: "10px",
      marginRight: theme.constants.generalUnit,
    },
    orderSummary: {},
    orderMeta: {},
    quote: {},
    prices: {},
    previousPrice: {},
    currentPrice: {},
    promoCode: {},
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
          <Divider />
          <Typography variant="h2" component="h2">
            <Trans>By the way,</Trans>
          </Typography>
          <Typography variant="h5" component="p">
            <Trans>It’s between you and Files</Trans>
          </Typography>
          <Typography variant="h5" component="p">
            <Trans>
              All plans use the same end-to-end encryption algorithms.
            </Trans>
          </Typography>
          <Typography variant="h5" component="p">
            <Trans>Only if you need it</Trans>
          </Typography>
          <Typography>
            <Trans>
              You can add <a href="#">other apps</a> to your Files plan for a
              seamless, private digital workspace. So you only pay for the
              features you want.
            </Trans>
          </Typography>
          <Divider />
          <Typography variant="h5" component="p">
            <Trans>Support</Trans>
          </Typography>
          <Typography>
            <Trans>
              If you need help plan changes, check out this <a href="#">page</a>
              , or contact{" "}
            </Trans>
            <a href="mailto:support@chainsafefiles.io">
              support@chainsafefiles.io
            </a>
            .
          </Typography>
        </div>
        <div className={classes.quote}>
          <Typography variant="h4" component="p">
            <Trans>Subscription Type</Trans>
          </Typography>
          <Typography variant="h5" component="p">
            <Trans>Files Plus Subscription - Individual</Trans>
          </Typography>
          <div>
            <Typography variant="h5" component="p">
              <Trans>Billing Details</Trans>
            </Typography>
            <Typography
              variant="h5"
              component="p"
              onClick={() =>
                setBillingPeriod(
                  BILLING_PERIOD.Yearly
                    ? BILLING_PERIOD.Monthly
                    : BILLING_PERIOD.Yearly,
                )
              }
            >
              {billingPeriod === BILLING_PERIOD.Yearly ? (
                <>
                  <Trans>Change to </Trans>
                  {BILLING_PERIOD.Monthly}
                </>
              ) : (
                <>
                  <Trans>Change to </Trans>
                  {BILLING_PERIOD.Yearly}
                </>
              )}
            </Typography>
          </div>
          <Typography variant="h5" component="p">
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
              variant="h5"
              component="p"
            >
              <Trans>USD $83.88</Trans>
              <Typography
                className={classes.previousPrice}
                variant="h5"
                component="span"
              >
                {billingPeriod === BILLING_PERIOD.Yearly ? (
                  <Trans>per year</Trans>
                ) : (
                  <Trans>per month</Trans>
                )}
              </Typography>
            </Typography>
          </div>
          <Typography variant="h5" component="p">
            <Trans>Billing account</Trans>
          </Typography>
          <Typography variant="h5" component="p">
            tanmoy@chainsafe.io
          </Typography>
          <div className={classes.promoCode}>
            <Typography variant="h5" component="p">
              <Trans>Promo Code</Trans>
            </Typography>
            <div>
              <TextInput
                onChange={(value: string | number | undefined) =>
                  console.log(value)
                }
              />
              <Button variant="primary">
                <Trans>Use Code</Trans>
              </Button>
            </div>
          </div>
          {!connected ? (
            <Button onClick={() => selectWallet()} variant="primary">
              <Trans>Yes, connect crypto wallet</Trans>
            </Button>
          ) : targetToken && targetToken?.balance >= COST ? (
            <Button onClick={() => transferTokens()} variant="primary">
              <Trans>Pay with Dai</Trans>
            </Button>
          ) : (
            <Typography>Balance insufficent</Typography>
          )}
          <Button variant="outline">
            <Trans>No, go back</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default CryptoPaymentModule
