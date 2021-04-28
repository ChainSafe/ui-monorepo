import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Typography, useScrollToTop } from "@chainsafe/common-components"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import NavBar from "../Modules/NavBar"

const useStyles = makeStyles(
  ({ palette, constants, breakpoints, typography }: ITheme) =>
    createStyles({
      container: {
        maxWidth: breakpoints.width("md"),
        margin: "0 auto",
        color: palette.additional["gray"][9],
        padding: `${constants.generalUnit * 16}px ${constants.generalUnit * 4
          }px ${constants.generalUnit * 20}px`,
      },
      heading: {
        ...typography.h1,
        fontFamily: "'Neue Montreal, Arial', sans-serif",
      },
      title: {
        ...typography.h3,
        paddingTop: constants.generalUnit * 3,
        fontFamily: "'Neue Montreal, Arial', sans-serif",
      },
      text: {
        ...typography.body1,
        fontSize: "16px",
        lineHeight: "24px",
        fontFamily: "'Neue Montreal, Arial', sans-serif",
      },
      caption: {
        ...typography.body1,
        fontFamily: "'Neue Montreal, Arial', sans-serif",
      },
      padLarge: {
        padding: `${constants.generalUnit * 3}px 0 ${constants.generalUnit * 1
          }px 0`,
      },
      padSmall: {
        padding: `${constants.generalUnit * 1}px 0`,
      },
      orderedList: {
        ...typography.body1,
        padding: "revert",
        listStyle: "decimal",
        fontFamily: "'Neue Montreal, Arial', sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        margin: `${constants.generalUnit * 2}px 0`,
      },
      emailLink: {
        ...typography.body1,
        color: palette.additional["gray"][9],
        fontSize: "16px",
        lineHeight: "24px",
      },
    }),
)

const TermsOfServicePage: React.FC = () => {
  const classes = useStyles()
  useScrollToTop(true);

  return (
    <div>
      <NavBar />
      <div className={classes.container}>
        <Typography
          component="h1"
          className={clsx(classes.heading, classes.padLarge)}
        >
          <Trans>Terms of Service</Trans>
        </Typography>

        <Typography
          component="p"
          className={clsx(classes.caption, classes.padSmall)}
        >
          <Trans>Last Modified: March 15 2021</Trans>
        </Typography>
        <Typography
          component="p"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Hello! Here are the terms and conditions for use of ChainSafe Files (“Files”), its features collectively referred to as the “Service”. This Service is provided to persons who are over the age of 13. As used in these terms of service, “ChainSafe”, “We”, and the “Company” mean ChainSafe Systems, while “you” refers to you, the user or Account holder..{" "}
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Each user is responsible for their transmissions through their Files Account. As a condition of your use of the Service, you affirm that you will not use the Service for any unlawful or prohibited purpose. By registering with ChainSafe Files, you agree to be bound by the terms outlined here. If your conduct fails to conform to these conditions, ChainSafe may, at its sole discretion, immediately terminate service without cause or notice.
          </Trans>
        </Typography>

        <ol className={clsx(classes.orderedList, classes.padLarge)}>
          <li>
            <Trans>
              This is an internet-based service. You agree to be bound by Internet regulations, policies and procedures.
            </Trans>
          </li>
          <li>
            <Trans>
              You agree to comply with all applicable local, state, national and international laws and regulations. You also agree to not use your Files Account for illegal purposes; to not interfere or disrupt networks connected to this service; and to comply with all the rules, policies and procedures connected to this service.
            </Trans>
          </li>
          <li>
            <Trans>
            You agree not to store any objectionable material including, but not limited to, unlawful or harassing, libelous, abusive, threatening, harmful, vulgar or obscene material that constitutes or encourages conduct that could constitute a 
            criminal offence, give rise to civil liability or otherwise violate items discussed in #2 above.{" "}
            </Trans>
          </li>
        </ol>

        <Typography
          component="h2"
          variant="h2"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Subscription Types and Payment Terms</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Unless you cancel your subscription before the end of the applicable subscription period, your subscription will automatically renew, and you authorize Stripe to collect the monthly subscription fee. Subscriptions can be cancelled at any time in your account settings. You are responsible for keeping your payment information up to date. ChainSafe has the right to discontinue service for fraudulent payments. 
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            For payments made with cryptocurrency, we are not responsible for payments made to the wrong crypto address. We cannot reverse any transaction which has been broadcasted to the provided blockchain network. Should you want to purchase a plan with cryptocurrency, you will be required to pay the annual, rather than monthly, subscription fee.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Account Term and Termination</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
           If there is any indication that you are using your account for illegal activity, your account will be terminated immediately without notice. Activities that are absolutely not tolerated include the storage, possession or distribution of child pornography, terrorist activity, and of any material that is illegal, fraudulent or threatening in relevant jurisdictions.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Limitation of Liability</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            ChainSafe may make improvements and/or changes to the Service at any time without notice. We do not guarantee that Files will be uninterrupted or error-free, that bugs or malfunctions will be corrected, or that the Service and its servers are free of harmful components. We make no warranty or covenant on the availability, reliability, or timeliness of the Service, and we are not responsible for the appropriateness of the Service for any particular purpose.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            ChainSafe will not be held responsible for any and all damages whatsoever as a result of the loss of use, data or profits connected to the performance of your Files Account. The user is solely responsible for any and all information that passes and is stored through it. We don’t take responsibility for the implications of any attempt to use this website for activities or virtual currencies that Files does not support.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
           The Company does not own or control the Filecoin Network or the underlying software protocols which govern the operation of our website. In general, the underlying protocols are licensed as open source, and anyone can use, copy, modify, and distribute them. By using the Website, you acknowledge and agree (i) that Files is not responsible for operation of the Filecoin Network and that Files makes no guarantee of their functionality, security, or availability; and (ii) that the Filecoin Network is subject to sudden changes in operating rules (“forks”), and that such forks may materially affect the value, function, and/or even the name of Filecoin you store in the Filecoin Network.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Indemnificaiton</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            You agree that the Company, its officers and employees, cannot be held responsible for any third-party claim, demand, or damage arising out of your use of the Service.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Storage Limitations</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
           You agree that the Company is not responsible for any deletion or failure to store media or other information. ChainSafe Files can be used for free until 20GB of storage is reached. At this point, storage beyond this amount must be paid for via a monthly or yearly subscription fee.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Third parties, Advertisements, Promotions</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Files is an advertising-free platform. Third-party involvement is limited to facilitating the service and your connectivity to it – for example, using OAuth to log into your Files account, or providing financial information to pay for the service. The Company is not responsible for any handling of data or cookies used by third parties in facilitating the Service. 
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Modifications to Terms of Service, Member Policies</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
           The Company reserves the right to review and change this agreement regarding the use of the Service at any time and to notify you by posting an updated version of the agreement on this Website. Continued use of the Service after any such changes shall constitute your consent to such changes.
          </Trans>
        </Typography>

        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Intellectual Property</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
           The Company does not claim any intellectual property rights over the materials you store on the Service. All materials you upload remain yours, and the Company is not responsible for damages arising from any loss or depreciation of the materials. You can remove your Files materials at any time by deleting your Account. You are responsible for compliance of the materials with any applicable laws or regulations.
          </Trans>
        </Typography>

        <div className={classes.padLarge}>
          <Typography component="p" variant="body1" className={classes.text}>
            ChainSafe Systems,
          </Typography>
          <Typography component="p" variant="body1" className={classes.text}>
            251 Spadina Ave,
          </Typography>
          <Typography component="p" variant="body1" className={classes.text}>
            Toronto, ON M5T 2E2
          </Typography>
        </div>
        <div className={classes.padLarge}>
          <a
            className={clsx(classes.emailLink)}
            href="mailto:support@chainsafe.io"
          >
            support@chainsafe.io
          </a>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
