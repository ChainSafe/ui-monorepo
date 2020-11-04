import React from "react"
import CardInputs from "../../../Elements/CardInputs"
import CountryOrRegion from "../../../Elements/CountryOrRegion"
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
  Grid,
  Link,
  TextInput,
  Typography,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../../../FilesRoutes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    headingContainer: {
      marginBottom: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("lg")]: {
        marginBottom: theme.constants.generalUnit * 2,
      },
    },
    heading: {
      marginBottom: theme.constants.generalUnit * 4,
      [theme.breakpoints.down("lg")]: {
        marginBottom: theme.constants.generalUnit * 2,
      },
    },
    purchaseContainer: {
      border: `1px solid ${theme.palette.additional["gray"][6]}`,
      padding: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("lg")]: {
        border: "none",
        padding: 0,
      },
    },
    backIcon: {
      fontSize: "10px",
      marginRight: theme.constants.generalUnit,
    },
    submitButton: {
      width: "100%",
      marginTop: theme.constants.generalUnit * 4,
    },
    title: {
      color: theme.palette.additional["gray"][8],
      marginBottom: `${theme.constants.generalUnit * 2}px`,
      fontWeight: 600,
      [theme.breakpoints.down("lg")]: {
        marginBottom: 0,
      },
    },
    textInput: {
      margin: `${theme.constants.generalUnit * 1}px 0`,
      width: "100%",
    },
    terms: {
      maxWidth: 700,
      margin: `${theme.constants.generalUnit}px 0 ${
        theme.constants.generalUnit * 3
      }px 0`,
      color: theme.palette.additional["gray"][8],
    },
    cardContainer: {
      marginRight: theme.constants.generalUnit * 3,
      maxWidth: 500,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("lg")]: {
        margin: 0,
        maxWidth: "100%",
      },
    },
    countriesContainer: {
      marginTop: theme.constants.generalUnit * 7,
      marginLeft: theme.constants.generalUnit * 3,
      marginBottom: theme.constants.generalUnit * 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      maxWidth: 500,
      [theme.breakpoints.down("lg")]: {
        margin: 0,
        maxWidth: "100%",
      },
    },
    pricingContainer: {
      padding: `${theme.constants.generalUnit * 2}px 0`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][7]}`,
      [theme.breakpoints.down("lg")]: {
        border: "none",
        padding: `${theme.constants.generalUnit * 2}px 0`,
      },
    },
    pricing: {
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      [theme.breakpoints.down("lg")]: {
        alignItems: "start",
      },
    },
    pricingTitle: {
      color: theme.palette.additional["gray"][8],
      marginBottom: theme.constants.generalUnit,
    },
    actualPrice: {
      color: theme.palette.additional["gray"][7],
      fontSize: 16,
      lineHeight: "24px",
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
    },
    price: {
      color: theme.palette.additional["gray"][9],
      marginRight: theme.constants.generalUnit,
    },
    priceSubtitle: {
      color: theme.palette.additional["gray"][7],
    },
  }),
)

const PurchasePlan: React.FC = () => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("sm"))

  return (
    <div>
      <div className={classes.headingContainer}>
        {!desktop && (
          <Link to={ROUTE_LINKS.Settings}>
            <ArrowLeftIcon className={classes.backIcon} />
            <Typography>Back to plan settings</Typography>
          </Link>
        )}
        <Typography className={classes.heading} variant="h1" component="p">
          {desktop ? "Purchase a Plus subscription" : "Checkout"}
        </Typography>
        {desktop && (
          <Link to={ROUTE_LINKS.Settings}>
            <ArrowLeftIcon className={classes.backIcon} />
            <Typography>Back to plan settings</Typography>
          </Link>
        )}
      </div>
      <div className={classes.purchaseContainer}>
        <Grid container>
          <Grid xs={12} lg={6} item>
            <div className={classes.cardContainer}>
              {!desktop && (
                <div className={classes.pricingContainer}>
                  <Typography className={classes.pricingTitle}>
                    Files plus subscription - individual
                  </Typography>
                  <div className={classes.pricing}>
                    <Typography variant="body1" className={classes.actualPrice}>
                      <del>USD $107.67</del>
                    </Typography>
                    <div className={classes.priceContainer}>
                      <Typography variant="h3" className={classes.price}>
                        USD $83.45
                      </Typography>
                      <Typography className={classes.priceSubtitle}>
                        per year
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
              <Typography variant="h3" component="p" className={classes.title}>
                Pay with card
              </Typography>
              <TextInput
                value={"g@g.com"}
                onChange={() => {}}
                label="Email"
                type="email"
                size="large"
                className={classes.textInput}
              />
              <TextInput
                value={"ok"}
                onChange={() => {}}
                label="Name on card"
                size="large"
                className={classes.textInput}
              />
              <CardInputs />
            </div>
          </Grid>
          <Grid xs={12} lg={6} item>
            <div className={classes.countriesContainer}>
              <CountryOrRegion />
              {desktop && (
                <div className={classes.pricingContainer}>
                  <Typography className={classes.pricingTitle}>
                    Files plus subscription - individual
                  </Typography>
                  <div className={classes.pricing}>
                    <Typography variant="body1" className={classes.actualPrice}>
                      <del>USD $107.67</del>
                    </Typography>
                    <div className={classes.priceContainer}>
                      <Typography variant="h3" className={classes.price}>
                        USD $83.45
                      </Typography>
                      <Typography className={classes.priceSubtitle}>
                        per year
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        <Button size="large" className={classes.submitButton}>
          Submit
        </Button>
        <Typography className={classes.terms} component="p">
          By confirming your subscription, you allow ChainSafe Files to charge
          your card for this payment and future payments in accordance with
          their terms.
        </Typography>
      </div>
    </div>
  )
}

export default PurchasePlan
