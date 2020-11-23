import React, { useEffect, useState } from "react"
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

const CryptoPaymentModule: React.FC = () => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  const { selectWallet, resetAndSelectWallet } = useImployApi()
  const { provider, wallet } = useWeb3()

  const { plan } = useParams<{
    plan: string
  }>()

  const [billingPeriod, setBillingPeriod] = useState<BILLING_PERIOD>(
    BILLING_PERIOD.Yearly,
  )

  useEffect(() => {
    console.log("selectWallet", selectWallet)
    console.log("resetAndSelectWallet", resetAndSelectWallet)
    console.log("wallet", wallet)
    console.log("provider", provider)
  }, [wallet, provider, resetAndSelectWallet, selectWallet])

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
              <a href="mailto:support@chainsafefiles.io">
                support@chainsafefiles.io
              </a>
              .
            </Trans>
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
              <Trans>
                Change to{" "}
                {billingPeriod == BILLING_PERIOD.Yearly
                  ? BILLING_PERIOD.Monthly
                  : BILLING_PERIOD.Yearly}
              </Trans>
            </Typography>
          </div>
          <Typography variant="h5" component="p">
            <Trans>
              Billed{" "}
              {billingPeriod == BILLING_PERIOD.Yearly ? "Yearly" : "Monthly"}
            </Trans>
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
                <Trans>
                  {billingPeriod == BILLING_PERIOD.Yearly
                    ? "per year"
                    : "per month"}
                </Trans>
              </Typography>
            </Typography>
          </div>
          <Typography variant="h5" component="p">
            <Trans>Billing account</Trans>
          </Typography>
          <Typography variant="h5" component="p">
            <Trans>tanmoy@chainsafe.io</Trans>
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
              <Button variant="primary">Use Code</Button>
            </div>
          </div>
          {!wallet ? (
            <Button onClick={() => selectWallet()} variant="primary">
              Yes, connect crypto wallet
            </Button>
          ) : (
            <Button onClick={() => selectWallet()} variant="primary">
              Pay with Dai
            </Button>
          )}

          <Button variant="outline">No, go back</Button>
        </div>
      </section>
    </article>
  )
}

export default CryptoPaymentModule
