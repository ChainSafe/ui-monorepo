import React from "react"
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
  FormikTextInput,
  Grid,
  Link,
  SelectInput,
  TextInput,
  Typography,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import { Form, Formik } from "formik"
import { useBilling, useUser } from "@imploy/common-contexts"
import * as yup from "yup"
import countryList from "./countryList"
import CardInputs from "../../../Elements/CardInputs"
import {
  getCardNumberError,
  getExpiryDateError,
  getCVCError,
} from "../../../Elements/CardInputs/utils"
import { getCardTokenFromStripeApi } from "./stripeApi"

const ACTUAL_PRICE = 108.5
const FINAL_PRICE = 88.5

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      padding: 0,
      marginBottom: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("md")]: {
        marginTop: theme.constants.generalUnit * 2,
        padding: `0 ${theme.constants.generalUnit}px`,
      },
    },
    headingContainer: {
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
    countryOrRegionContainer: {
      margin: `${theme.constants.generalUnit}px 0`,
    },
    zipCodeInput: {
      width: "100%",
      margin: `${theme.constants.generalUnit * 2}px 0px`,
    },
    purchaseContainer: {
      border: `1px solid ${theme.palette.additional["gray"][6]}`,
      padding: theme.constants.generalUnit * 6,
      [theme.breakpoints.down("md")]: {
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
      [theme.breakpoints.down("md")]: {
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
      [theme.breakpoints.down("md")]: {
        margin: 0,
        maxWidth: "100%",
      },
    },
    countriesContainer: {
      marginTop: theme.constants.generalUnit * 6,
      marginLeft: theme.constants.generalUnit * 3,
      marginBottom: theme.constants.generalUnit * 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      maxWidth: 500,
      [theme.breakpoints.down("md")]: {
        margin: 0,
        maxWidth: "100%",
      },
    },
    pricingContainer: {
      padding: `${theme.constants.generalUnit * 2}px 0`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][7]}`,
      [theme.breakpoints.down("md")]: {
        border: "none",
        padding: `${theme.constants.generalUnit * 2}px 0`,
      },
    },
    pricing: {
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      [theme.breakpoints.down("md")]: {
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
  const { profile } = useUser()
  const { addCard } = useBilling()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    country: yup.string().when(["zipCode"], {
      is: (zipCode) => !zipCode,
      then: yup.string().required("Country or zip code is required"),
    }),
    zipCode: yup.string(),
  })

  return (
    <div className={classes.container}>
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
      <Formik
        initialValues={{
          name: "",
          email: profile?.email || "",
          cardNumber: "",
          cardExpiry: "",
          cardCvc: "",
          country: "",
          zipCode: "",
        }}
        onSubmit={async (values) => {
          console.log(values)
          const stripeResp = await getCardTokenFromStripeApi({
            cardNumber: values.cardNumber,
            cardExpiry: values.cardExpiry,
            cardCvc: values.cardCvc,
          })
          // add card api for now
          await addCard(stripeResp.data.id)
        }}
        validateOnChange={false}
        validationSchema={validationSchema}
        validate={(values) => {
          let errors: any = {}
          if (getCardNumberError(values.cardNumber)) {
            errors.cardNumber = getCardNumberError(values.cardNumber)
          } else if (getExpiryDateError(values.cardExpiry)) {
            errors.cardExpiry = getExpiryDateError(values.cardExpiry)
          } else if (getCVCError(values.cardCvc, undefined)) {
            errors.cardCvc = getCVCError(values.cardCvc, undefined)
          }
          return errors
        }}
      >
        {({ values, errors, handleChange, isSubmitting, setValues }) => (
          <Form>
            <div className={classes.purchaseContainer}>
              <Grid container>
                <Grid xs={12} md={6} item>
                  <div className={classes.cardContainer}>
                    {!desktop && (
                      <div className={classes.pricingContainer}>
                        <Typography className={classes.pricingTitle}>
                          Files plus subscription - individual
                        </Typography>
                        <div className={classes.pricing}>
                          <Typography
                            variant="body1"
                            className={classes.actualPrice}
                          >
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
                    <Typography
                      variant="h3"
                      component="p"
                      className={classes.title}
                    >
                      Pay with card
                    </Typography>
                    <FormikTextInput
                      name="email"
                      label="Email"
                      type="email"
                      size="large"
                      placeholder="Email"
                      className={classes.textInput}
                    />
                    <FormikTextInput
                      name="name"
                      label="Name on card"
                      size="large"
                      placeholder="Name on Card"
                      className={classes.textInput}
                    />
                    <CardInputs
                      cardNumber={values.cardNumber}
                      cardExpiry={values.cardExpiry}
                      cardCvc={values.cardCvc}
                      handleChangeCardNumber={(value) =>
                        setValues({ ...values, cardNumber: value })
                      }
                      handleChangeCardExpiry={(value) =>
                        setValues({ ...values, cardExpiry: value })
                      }
                      handleChangeCardCvc={(value) =>
                        setValues({ ...values, cardCvc: value })
                      }
                      error={
                        errors.cardNumber || errors.cardExpiry || errors.cardCvc
                      }
                    />
                  </div>
                </Grid>
                <Grid xs={12} md={6} item>
                  <div className={classes.countriesContainer}>
                    <div className={classes.countryOrRegionContainer}>
                      <SelectInput
                        onChange={(value) =>
                          setValues({ ...values, country: value })
                        }
                        options={countryList.map((country) => ({
                          label: country.label,
                          value: country.label,
                        }))}
                        isClearable={false}
                        name="country"
                        value={values.country}
                        size="large"
                        label="Country or region"
                      />
                      <TextInput
                        name="zipCode"
                        onChange={(e) => {
                          handleChange(e)
                        }}
                        value={values.zipCode}
                        className={classes.zipCodeInput}
                        size="large"
                        captionMessage={errors.country || errors.zipCode}
                        label="Postal/Zip Code"
                        placeholder="Postal/Zip Code"
                        state={
                          errors.country || errors.zipCode ? "error" : "normal"
                        }
                      />
                    </div>
                    {desktop && (
                      <div className={classes.pricingContainer}>
                        <Typography className={classes.pricingTitle}>
                          Files plus subscription - individual
                        </Typography>
                        <div className={classes.pricing}>
                          <Typography
                            variant="body1"
                            className={classes.actualPrice}
                          >
                            <del>USD ${ACTUAL_PRICE}</del>
                          </Typography>
                          <div className={classes.priceContainer}>
                            <Typography variant="h3" className={classes.price}>
                              USD ${FINAL_PRICE}
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
              <Button
                size="large"
                className={classes.submitButton}
                type="submit"
              >
                Submit
              </Button>
              <Typography className={classes.terms} component="p">
                By confirming your subscription, you allow ChainSafe Files to
                charge your card for this payment and future payments in
                accordance with their terms.
              </Typography>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PurchasePlan
