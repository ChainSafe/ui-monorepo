import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Typography } from "@chainsafe/common-components"
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
        ...typography.h2,
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
      unorderedList: {
        ...typography.body1,
        padding: "revert",
        listStyle: "disc",
        fontFamily: "'Neue Montreal, Arial', sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        margin: `${constants.generalUnit * 2}px 0`,
      },
      subUnorderedList: {
        ...typography.body1,
        padding: "revert",
        listStyle: "circle",
        fontFamily: "'Neue Montreal, Arial', sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        margin: `${constants.generalUnit * 2}px 0`,
      },
      emailLink: {
        ...typography.body1,
        color: palette.additional["blue"][6],
        fontSize: "16px",
        lineHeight: "24px",
      },
    }),
)

const TermsOfServicePage: React.FC = () => {
  const classes = useStyles()

  return (
    <div>
      <NavBar />
      <div className={classes.container}>
        <Typography
          component="h1"
          className={clsx(classes.heading, classes.padLarge)}
        >
          <Trans>Privacy Policy</Trans>
        </Typography>
        <Typography
          component="p"
          className={clsx(classes.caption, classes.padSmall)}
        >
          <Trans>Last Modified: December 8, 2020</Trans>
        </Typography>

        {/* welcome */}
        <Typography
          component="p"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Welcome! Here at ChainSafe Systems (“ChainSafe”) we respect your
            privacy and are committed to protecting it. This Privacy Policy
            (“policy”) describes:
          </Trans>
        </Typography>
        <ul className={clsx(classes.unorderedList, classes.padLarge)}>
          <li>
            How we collect, use, disclose, and protect the personal information
            of our customers and website users ("you").
          </li>
          <li>
            The types of information we may collect from you when you visit the
            website <b>files.chainsafe.io</b> and use our service{" "}
            <b>ChainSafe Files</b> (our "Website" and “service”)
          </li>
          <li>
            How we may get, use, maintain, protect and/or disclose that
            information.
          </li>
        </ul>
        {/* The gist of it */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>The gist of it</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We take your personal privacy interests seriously, and our services
            are designed with anonymity in mind. We will never sell your
            information to third parties, and we don’t entertain ads. We take
            steps to ensure that the personal information we collect is relevant
            and used for limited purposes.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            This Policy describes the information we may collect, the purposes
            for which we collect it, how we use it and how we keep it secure.
            ChainSafe will not collect, use or disclose your personal
            information in any way other than in compliance with this policy
            unless obligated by applicable law.
          </Trans>
        </Typography>

        {/* ChainSafe Files */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>ChainSafe Files</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            ChainSafe Files is a decentralized file storage service. ChainSafe
            Files utilizes the Filecoin network, a blockchain-enabled storage
            network, to offer users easy and reliable access to files and fewer
            storage limitations at competitive prices.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Our service allows users to conveniently manage files without
            compromising privacy concerns. Any content uploaded to ChainSafe
            Files is encrypted both in transit and when stored on Filecoin
            storage mining nodes. Most importantly, uploaded content is owned by
            the uploader; we do not sell uploaded content to third-parties.
            Users may upload files pseudonymously by registering an account
            using an Ethereum address.
          </Trans>
        </Typography>
        {/* How you agree */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>How you agree</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            By using this Website or our services, you agree to the practices
            described in this policy. This policy may change from time to time.
            Your continued use of this Website and service after we make changes
            means you agree to those changes, so please check the policy
            periodically for updates. If there is any material change to this
            policy, we will notify you.
          </Trans>
        </Typography>

        {/* The information we collect about you */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>The information we collect about you</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Our policy is to collect as little user information as possible. We
            have limited access to your uploaded content because it is all encrypted
            end-to-end. We may collect user information that is necessary for us
            to provide you the service. The type of information we collect about
            you will depend. We may collect:
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>General personal information:</b> We may collect info that we can
            reasonably use to directly or indirectly identify you, such as your
            name, billing address, e-mail address, Internet protocol (IP)
            address, user name or other similar identifier, and any other
            identifier we may use to bill you or contact you (
            <b>"personal information"</b>). This will most likely be the case
            when you opt to pay for our Service using a credit card.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>Personal information for account registration:</b> In the case
            that you register for an account using our OAuth service, your name,
            email and username from the OAuth service may be collected and
            stored to identify your Files account. In the case that you register
            using an Ethereum address, we store your Ethereum address to
            associate it with your account. We will store your email address
            only if you opt-in to providing it. It is not required by users
            logging in with an Ethereum address to provide an email.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>Personal information for purchasing subscriptions:</b> In the
            case that you purchase a subscription to our service with a credit
            card, we may store your billing information. ChainSafe Files uses a
            third-party payment processor, and it is necessary for us to share
            your payment information with the processor to know which account
            the payment applies to. We do not store your payment information for
            any other purpose. In the case that you purchase a subscription to
            our service with cryptocurrency, we may collect transaction
            information.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We provide an opportunity for any user to unsubscribe from our
            services or opt-out of contact from us on an ongoing basis. Users
            may unsubscribe at any time on the Website.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>Non-personal information:</b> Info that does not in any way
            reveal your identity or directly relate to an identifiable
            individual, such as demographic information, or statistical or
            aggregated information. Statistical or aggregated data does not
            directly identify a person, but we may derive non-personal
            statistical or aggregated data from personal information. For
            example, we may aggregate personal information to calculate the
            percentage of users accessing a specific Website feature, such as a
            video. Files may also be able to access information about account
            activity that is unencrypted. This would include information such as
            payment type, language preference, storage space used and files size
            after encryption. This information is used solely to provide a
            smooth user experience and will not be shared or sold.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>Technical information:</b> This includes your login information,
            browser type and version, time zone setting, browser plug-in types
            and versions, operating system and platform, or information about
            your internet connection, the equipment you use to access our
            Website, and usage details. This might also include IDs of errors,
            communications with the support team or bug reports to improve our
            service.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            <b>Non-personal details about your Website interactions:</b> This
            includes the full Uniform Resource Locators (URLs), click stream to,
            through and from our Website (including date and time), products you
            viewed or searched for, page response times, download errors, length
            of visits to certain pages, page interaction information (such as
            scrolling, clicks, and mouse-overs), methods used to browse away
            from the page, or any phone number used to call our customer service
            number. We collect cookies on this promotional website for anonymized system monitoring and non-personal analytics.
          </Trans>
        </Typography>

        {/* When/how we collect information: */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>When/how we collect information:</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            In most cases, we collect information about you when you give it to
            us directly. For example, when you create an account or register
            for/purchase our services. Also, like many websites and
            technologies, we automatically collect technical data when you visit
            and interact with the Website and ChainSafe Files.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            ChainSafe collects personal information that you give to us when
            you:
          </Trans>
        </Typography>
        <ul className={clsx(classes.unorderedList, classes.padLarge)}>
          <li>
            Use our Websites to sign up for services, download any file,
            software, media or other from our services.
          </li>
          <li>
            Communicate with us through email, chat, or social media, or by
            phone or any other means.
          </li>
          <li>Register for an account to use our services.</li>
          <li>
            Provide us with your name, email address or other identifying
            information.
          </li>
        </ul>

        {/* User Contributions */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>User Contributions</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            You may also provide information to be published or displayed
            (hereinafter, <b>"posted"</b>) on public areas of the Website or
            transmitted to other users of the Website or third parties
            (collectively, <b>"User Contributions"</b>). Your User Contributions
            are posted on and transmitted to others at your own risk. We cannot
            and do not guarantee that unauthorized persons will not view your
            User Contributions.
          </Trans>
        </Typography>

        {/* Third party use of cookies */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Third party use of cookies</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            While we do not collect cookies, third parties that are implicated
            or connected in the process of delivery and use of our Website or
            services may.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We do not control these third parties' tracking technologies or how
            they are used. If you have any questions about targeted content, you
            should contact the responsible provider directly.
          </Trans>
        </Typography>

        {/* How we use your information */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>How we use your information</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We use information that we collect about you/that you provide to us
            for several reasons:
          </Trans>
        </Typography>
        <ul className={clsx(classes.unorderedList, classes.padLarge)}>
          <li>To present our Website and its contents to you.</li>
          <li>
            To provide you with information, products, or services that you
            request from us.
          </li>
          <li>
            To fulfill the purposes that you provided the information for, or
            any other purpose that you provide it.
          </li>
          <li>
            To provide you with notices about your account/subscription,
            including expiration and renewal.
          </li>
          <li>
            To carry out our obligations and enforce our rights arising from any
            contracts with you, including for billing and collection or to
            comply with legal requirements
          </li>
          <li>
            To notify you about changes to our website or any services we
            provide though it.
          </li>
          <li>
            To improve our website or services, or customer relationships and
            experiences.
          </li>
          <li>
            In any other way we may describe when you provide the information.
          </li>
          <li>For any other purpose with your consent.</li>
        </ul>

        {/* Disclosure of your information */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Disclosure of your information</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Sometimes, we may disclose aggregated information about our users,
            and information that does not identify any individual.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We may share and disclose information and technical data in the
            following circumstances:
          </Trans>
        </Typography>
        <ul className={clsx(classes.unorderedList, classes.padLarge)}>
          <li>
            <b>Trusted third party service providers.</b> We use third parties
            to assist us in administering and providing our services or to
            provide other services on our behalf. Examples include analyzing
            data, integrations of third party services, processing credit card
            payments.{" "}
          </li>
          <li>
            <b>Legal requests.</b> ChainSafe may disclose personal information
            when required by law to respond to subpoenas, court orders or other
            legal processes by authorities with jurisdiction. Since anything
            uploaded by a user is end to end encrypted, we will not be able to
            provide an unencrypted version of any uploaded content to any third
            party. The only information we could share in this context would be
            that found under the “information we collect heading” above.
            <ul className={clsx(classes.subUnorderedList, classes.padLarge)}>
              <li>
                If we receive an order enforceable under the laws of Ontario,
                Canada, compelling us to disclose personal information and
                account data for a specific user account. The records we
                disclose may include data in an unencrypted format. Because such
                orders generally state that we are not permitted to disclose the
                existence of the order to a user, we will not disclose to any
                user the existence, or nonexistence, of any order we may have
                received.
              </li>
              <li>
                Where there are exigent circumstances, such as where the safety
                or well-being of an individual or individuals is in imminent
                danger, and we believe in good faith that the disclosure of
                personal information and account data is reasonably necessary to
                protect against such harm, we will disclose the records. This
                may include but is not limited to the welfare of a child, or an
                act of terrorism.
              </li>
              <li>
                We comply with Canadian Bill C-22 as enacted in Canada. “An act
                respecting the mandatory reporting of Internet child pornography
                by persons who provide an Internet service”. Should we become
                aware of a user that is using our services for the transmission
                or storage of Internet child pornography, we are required to
                report this to the appropriate authorities and preserve the
                records in the user’s account.
              </li>
            </ul>
          </li>
          <li>
            <b>Enforcement.</b> ChainSafe may disclose personal information in
            order to establish or exercise our legal rights, or to defend
            against legal claims, or when we believe it is necessary to share
            information in order to investigate, prevent, or take action
            regarding illegal activities, data breaches, suspected fraud,
            situations involving potential threats to the physical safety of any
            person, violations of our Terms of Use, or as otherwise required by
            law.
          </li>
          <li>
            <b>Business transaction.</b> In the unlikely event that we go out of
            business, enter bankruptcy or if we are acquired as a result of a
            transaction such as a merger, acquisition or asset sale, your
            personal information may be disclosed or transferred to the
            third-party acquirer in connection with the transaction.
          </li>
          <li>
            To fulfill the purpose for which you provide it, and for any other
            purpose disclosed by us when you provide the information.
          </li>
          <li>With your consent.</li>
        </ul>

        {/* Transferring your personal information */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Transferring your personal information</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We may transfer personal information that we collect or that you
            provide as described in this policy to contractors, service
            providers, and other third parties we use to support our business
            (such as analytics and search engine providers that assist us with
            Website improvement and optimization) and who are contractually
            obligated to keep personal information confidential, use it only for
            the purposes for which we disclose it to them, and to process the
            personal information with the same standards set out in this policy.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We may process, store, and transfer your personal information in and
            to a foreign country, with different privacy laws that may or may
            not be as comprehensive as Canadian law. In these circumstances, the
            governments, courts, law enforcement, or regulatory agencies of that
            country may be able to obtain access to your personal information
            through the laws of the foreign country. Whenever we engage a
            service provider, we require that its privacy and security standards
            adhere to this policy and applicable Canadian privacy legislation.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            You are welcome to contact us to obtain further information about
            Company policies regarding service providers outside of Canada.
          </Trans>
        </Typography>

        {/* Your choices */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Your choices</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We strive to provide you with choices regarding the personal
            information you provide to us. We have created mechanisms to provide
            you with the following control over your information:
          </Trans>
        </Typography>
        <ol className={clsx(classes.orderedList, classes.padLarge)}>
          <li>Unsubscribe at any time using the Website</li>
          <li>
            Choice of service: Sign in using crypto account instead of third
            party OAuth account
          </li>
          <li>
            Choice of payment method: Pay using cryptocurrency or credit card
          </li>
        </ol>

        {/* Data security */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Data security</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We use physical, electronic, and administrative measures designed to
            secure your personal information from accidental loss and from
            unauthorized access, use, alteration, and disclosure. Any payment
            transactions will be encrypted and handled via Stripe Inc.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            All uploaded files are stored and retrieved via end-to-end
            encryption with AES-256 and HMAC encryption.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            The safety and security of your information also depends on you.
            Where we have given you (or where you have chosen) a password for
            access to certain parts of our Website, you are responsible for
            keeping this password confidential. We ask you not to share your
            password with anyone.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Unfortunately, the transmission of information via the Internet is
            not completely secure. Although we do our best to protect your
            personal information, we cannot guarantee the security of your
            personal information transmitted to our Website. Any transmission of
            personal information is at your own risk. We are not responsible for
            circumvention of any privacy settings or security measures contained
            on the Website.
          </Trans>
        </Typography>

        {/* data retention */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Data retention</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Except as otherwise permitted or required by applicable law or
            regulation, we will only retain your personal information for as
            long as necessary to fulfill the purposes we collected it for,
            including for the purposes of satisfying any legal, accounting, or
            reporting requirements. Under some circumstances we may anonymize
            your personal information so that it can no longer be associated
            with you. We reserve the right to use such anonymous and
            de-identified data for any legitimate business purpose without
            further notice to you or your consent.
          </Trans>
        </Typography>

        {/* children under 13 */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Children under 13</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Our Website and Services are not intended for children under 13
            years of age. No one under age 13 may provide any personal
            information on the Website. We do not knowingly collect personal
            information from children under 13. If you are under 13, do not use
            or provide any information on this Website or any of its features,
            make any purchases through the Website, use any of the interactive
            or public comment features of this Website, or provide any
            information about yourself to us. If we learn we have collected or
            received personal information from a child under 13, we will delete
            that information. If you believe we might have any information from
            or about a child under 13, please contact us at the contact
            information below.
          </Trans>
        </Typography>

        {/* Accessing and correcting your personal information */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Accessing and correcting your personal information</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            It is important that the personal information we hold about you is
            accurate and current. If any personal information material to your
            account(s) with us changes, please let us know. By law you have the
            right to request access to and to correct the personal information
            that we possess that is linked to you.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            You can review and change your personal information by visiting your
            account.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We may request specific information from you to help us confirm your
            identity and your right to access, and to provide you with the
            personal information that we hold about you or make your requested
            changes. Applicable law may allow or require us to refuse to provide
            you with access to some or all of the personal information that we
            hold about you, or we may have destroyed, erased, or made your
            personal information anonymous in accordance with our record
            retention obligations and practices. If we cannot provide you with
            access to your personal information, we will inform you of the
            reasons why, subject to any legal or regulatory restrictions.
          </Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We will provide access to your personal information, subject to
            exceptions set out in applicable privacy legislation. Examples of
            such exceptions include:
          </Trans>
        </Typography>
        <ul className={clsx(classes.unorderedList, classes.padLarge)}>
          <li>Information protected by solicitor-client privilege.</li>
          <li>
            Information that is part of a formal dispute resolution process.
          </li>
          <li>
            Information that is about another individual that would reveal their
            personal information or confidential commercial information.
          </li>
          <li>Information that is prohibitively expensive to provide.</li>
        </ul>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            If you are concerned about our response or would like to correct the
            information provided, you may contact us at{" "}
            <a
              className={clsx(classes.emailLink)}
              href="mailto:support@chainsafe.io"
            >
              support@chainsafe.io
            </a>
            .
          </Trans>
        </Typography>

        {/* Withdrawing your consent */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Withdrawing your consent</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            Where you have provided your consent to the collection, use, and
            transfer of your personal information, you may have the legal right
            to withdraw your consent under certain circumstances. To withdraw
            your consent, if applicable, contact us at{" "}
            <a
              className={clsx(classes.emailLink)}
              href="mailto:support@chainsafe.io"
            >
              support@chainsafe.io
            </a>
            . Please note that if you withdraw your consent we may not be able
            to provide you with a particular product or service.
          </Trans>
        </Typography>

        {/* Changes to our privacy policy */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Changes to our privacy policy</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            It is our policy to post any changes we make to our privacy policy
            on this page, with a notice that the privacy policy has been updated
            on the Website home page. If we make material changes to how we
            treat our users' personal information, we will notify you through a
            notice on the Website home page.
          </Trans>
        </Typography>

        {/* Contact information and challenging compliance */}
        <Typography
          component="h2"
          variant="h3"
          className={clsx(classes.title, classes.padLarge)}
        >
          <Trans>Contact information and challenging compliance</Trans>
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={clsx(classes.text, classes.padSmall)}
        >
          <Trans>
            We welcome your questions, comments, and requests regarding this
            privacy policy and our privacy practices. Please contact us at:{" "}
            <a
              className={clsx(classes.emailLink)}
              href="mailto:support@chainsafe.io"
            >
              support@chainsafe.io
            </a>
            .
          </Trans>
        </Typography>
      </div>
    </div>
  )
}

export default TermsOfServicePage
