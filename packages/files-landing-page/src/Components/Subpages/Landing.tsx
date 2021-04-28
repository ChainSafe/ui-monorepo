import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(
  ({ constants, palette, breakpoints, typography }: ITheme) => {
    return createStyles({
      headerContainer: {
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "auto",
        paddingTop: `${constants.headerHeight}px`,
        paddingBottom: constants.generalUnit * 3,
      },
      headerContentContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: `calc(100vh - ${constants.headerHeight}px)`,
        "& > img": {
          maxHeight: "60%",
          [breakpoints.down('md')]:{
            width: "90%",
          }
        },
        "& > p": {
          fontSize: "38px",
          lineHeight: "48px",
          marginBottom: constants.generalUnit * 3,
          [breakpoints.down('md')]:{
            maxWidth: "90%",
            textAlign: "center",
            fontSize: "30px",
          },
          [breakpoints.up(3500)]:{
            fontSize: "38px",
            marginBottom: constants.generalUnit * 7,
          },
        }
    },
    headerLink: {
      boxShadow: "-2px 3px 5px -2px rgba(0,0,0,0.4)",
      background: palette.primary.main,
      color: palette.additional["gray"][3],
      textDecoration: "none",
      borderRadius: "3px",
      padding: ".5rem 1rem",
      fontSize: "18px",
      marginBottom: constants.generalUnit * 3,
      transition: "0.33s ease",
      "&:hover": {
        background: palette.additional["gray"][9],
      },
      [breakpoints.up(3500)]:{
        fontSize: "40px",
        padding: "1.5rem 2rem",
        marginBottom: constants.generalUnit * 7,
      },
    },
    bodyContainer: {
      width: "100%",
      [breakpoints.down(960)]:{
        overflowX: "hidden",
      },
    },
    bodyContentContainer: {
      display: "grid",
      width: "100%",
      [breakpoints.between(960, 1380)]: {
        margin: "3% 10%",
      },
      [breakpoints.up('md')]: {
        height: `calc(100vh - ${constants.headerHeight}px)`,
        gridTemplateColumns: "1fr",
        marginTop: "8%",
      },
      [breakpoints.up('lg')]:{
        margin: "5%",
      },
      [breakpoints.up(3800)]:{
        margin: "0 10%",
      },
      [breakpoints.down('md')]: {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        width: "100%",
      },
    },
    gifGridContainer: {
      [breakpoints.up(1500)]:{
        minHeight: "100vh",
      },
      [breakpoints.down(1500)]:{
        minHeight: "auto",
        padding: `${constants.generalUnit * 3}px 0`,
      },
      [breakpoints.up(3500)]:{
        minHeight: "unset",
        padding: "15vh",
      },
      [breakpoints.down('sm')]:{
        minHeight: "auto",
        padding: `${constants.generalUnit * 3}px 0`,
      },
      width: "100%",
      background: "#0f0f0f",
    },
    gifGridContentContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "inherit",
    },
    gifGrid: {
      display: "grid",
      justifyItems: "center",
        [breakpoints.up('lg')]: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        },
        [breakpoints.down('lg')]:{
          maxWidth: "100%",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "1",
        },
        [breakpoints.down('sm')]:{
          maxWidth: "100%",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "1",
        }
    },
    singleColContainer: {
      display: "flex",
      minWidth: "85vw",
      alignItems: "center",
      justifyContent: "center",
      padding: "10vh",
      [breakpoints.down(500)]:{
        padding: "5vh",
      },
      "& > p": {
        color: "white",
        fontSize: "36px",
        textAlign: "center",
        lineHeight: "44px",
        [breakpoints.down(500)]: {
          fontSize: "24px",
          lineHeight: "32px",
        },
        [breakpoints.up(3500)]:{
          fontSize: "62px",
          lineHeight: "72px",
          marginTop: "2%",
        }
      }
    },
    gifThumbnailContainer: {
      margin: "5%",
      [breakpoints.down(500)]:{
        margin: "24px 5%"
      },
      [breakpoints.up(3500)]:{
        margin: "2%",
      }
    },
    gifThumbnail: {
      maxWidth: "100%",
      objectFit: "contain",
      objectPosition: "left top",
      [breakpoints.up(3500)]:{
        width: "350px",
        height: "350px",
      },
      [breakpoints.up(1380)]: {
        width: "250px",
        height: "250px",
      },
      [breakpoints.down(1380)]: {
        width: "150px",
        height: "150px",
      },
      [breakpoints.down(500)]: {
        width: "80px",
        height: "80px",
      },
      "& > img":{
        objectFit: "contain",
        objectPosition: "left top",
        [breakpoints.up(1380)]:{
          height: "250px",
          width: "250px",
        },
        [breakpoints.down(1380)]: {
          width: "150px",
          height: "150px",
        },
        [breakpoints.up(3500)]:{
        width: "350px",
        height: "350px",
        },
        [breakpoints.down(500)]: {
          width: "80px",
          height: "80px",
        },
      }
    },
    featureList: {
      [breakpoints.up("md")]: {
        height: `calc(100vh - ${constants.headerHeight}px)`,
      }
    },
    featureTextContainer: {
      display: "grid",
      padding: "5vh",
      alignContent: "center",
      [breakpoints.up(750)]:{
        gridTemplateColumns: "minmax(0,5fr) minmax(0, 7fr)",
        minHeight: "33%",
      },
      [breakpoints.down(750)]:{
        minHeight: "50%",
        gridTemplateColimns: "minmax(0, 1fr)",
      },
      "&:first-of-type": {
        background: palette.primary.main
      },
      "&:last-of-type": {
        background: "#141414"
      },
    },
    featureHeading: {
      alignSelf: "center",
      [breakpoints.up('lg')]:{
        ...typography.h1
      },
      [breakpoints.up(3500)]: {
        justifySelf: "center",
      },
      [breakpoints.down('lg')]:{
        ...typography.h2
      },
      [breakpoints.down('md')]:{
       ...typography.h3
      },
    },
    featureBodyTextContainer: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
    },
    bodyTextWrapper: {
      marginBottom: constants.generalUnit,

      [breakpoints.up('lg')]: {
        width: "100%",
        maxWidth: `calc(100% - ${constants.generalUnit * 20}px)`,
      },
      [breakpoints.up(3500)]: {
        maxWidth: `calc(100% - ${constants.generalUnit * 150}px)`,
      },
      [breakpoints.up("md")]: {
        maxWidth: `calc(100% - ${constants.generalUnit * 10}px)`,
      },
      "& > a": {
        color: palette.additional["gray"][9],
        fontSize: "16px",
        lineHeight: "24px",
      },
    },
    bodyText: {
      fontSize: "17px",
      lineHeight: "24px",
      marginBottom: constants.generalUnit,
      [breakpoints.up(3500)]:{
        fontSize: "24px",
        lineHeight: "34px",
      }
    },
    lightText: {
      color: palette.additional["gray"][3],
    },
    loveLetterContainer: {
      minHeight: "auto",
      width: "auto",
      margin: constants.generalUnit * 12,
      [breakpoints.down(1100)]:{
        margin: "5vh",
      },
      [breakpoints.up(3500)]:{
        margin: "15vh",
        maxWidth: "1500px",
        position: "relative",
        left: "35%",
        transform: "translateX(-35%)",
      }
    },
    loveLetterContentContainer: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0, 1.5fr)",
      justifyItems: "center",
      [breakpoints.down(1100)]: {
        gridTemplateColumns: "minmax(0,1fr)",
        alignItems: "center",
      },
      [breakpoints.down('md')]:{
        justifyItems: "flex-start",
      }
    },
    flexDirectionColumn: {
      display: "flex",
      flexDirection: "column",
      [breakpoints.down(750)]: {
        justifyContent: "center",
        "& > h1": {
          fontSize: "20px",
          lineHeight: "28px",
        }
      },
      "& > h1:last-of-type": {
        [breakpoints.up(1200)]: {
          textAlign: "right",
        }
      }
    }, 
    loveLetterTextWrapper: {
      justifySelf: "left",
      [breakpoints.up(1500)]:{
        maxWidth: `calc(100% - ${constants.generalUnit * 25}px)`,
      },
      [breakpoints.down(1200)]:{
        paddingTop: constants.generalUnit * 5,
      },
      [breakpoints.up("md")]: {
        maxWidth: `calc(100% - ${constants.generalUnit * 10}px)`,
      }
    },
    loveLetterText: {
      [breakpoints.up(1200)]:{
        margin: `${constants.generalUnit *3}px 0 ${constants.generalUnit *2}px 0`,
      },
      [breakpoints.down(1200)]: {
        margin: `${constants.generalUnit}px 0`
      }
    },
    loveLetterImg: {
      [breakpoints.up('md')]:{
        width: 300,
        height: 300,
        alignSelf: "center",
      },
      [breakpoints.down('md')]:{
        width: "190px",
        height: "190px",
      }
    }
  })
})

const Landing: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <header className={classes.headerContainer}>
        <div className={classes.headerContentContainer}>
          <Trans>
            <Typography component="p">Store Files. Unparalleled privacy. Unparalleled simplicity.</Typography>
          </Trans>
          <a href="https://app.files.chainsafe.io/" className={classes.headerLink}>
            <Trans>Go to ChainSafe Files</Trans>
          </a>
          <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1617729970/files.chainsafe.io/large-grouped_p5inej.png" alt="ChainSafe Files interface"/>
        </div>
      </header>
      <main className={classes.bodyContainer}>
      {/* Gif */}
      <article className={classes.gifGridContainer}>
        <div className={classes.gifGridContentContainer}>
          <div className={classes.gifThumbnailContainer}>
            <div className={classes.gifGrid}>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616779588/files.chainsafe.io/stonk_zezhhr.png" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616778961/files.chainsafe.io/sound_u7xxuc.png" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616771599/files.chainsafe.io/lotus-gif-0.3x_tjwtyf.gif" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616778964/files.chainsafe.io/stone_uvn3kf.png" alt=""/>
            </div>
            </div>
            <div className={classes.singleColContainer}>
              <p><Trans>A sanctuary for all your files and thoughts.</Trans></p>
            </div>
            <div className={classes.gifGrid}>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616778961/files.chainsafe.io/read_iwpvg0.png" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616778961/files.chainsafe.io/bubble_euxl2i.png" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616778961/files.chainsafe.io/string_hxxsfv.png" alt=""/>
            </div>
            <div className={classes.gifThumbnail}>
              <img src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616776059/files.chainsafe.io/snowboard_gpumjr.gif" alt=""/>
            </div>
            </div>
          </div>
        </div>
      </article>
      {/* Feature List */}
      <article className={classes.featureList}>
        <div className={classes.featureTextContainer}>
          <Typography className={clsx(classes.featureHeading, classes.lightText)}><Trans>Secure.</Trans></Typography>
          <div className={classes.featureBodyTextContainer}>
            <div className={classes.bodyTextWrapper}>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <strong><Trans>We don't know what you’re storing.</Trans></strong>
              </Typography>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <Trans>
                  What you want to do with your files is totally up to you.  End-to-end encryption means your content can only be seen by you.
                </Trans>
              </Typography>
            </div>
            <div className={classes.bodyTextWrapper}>
              <p className={clsx(classes.bodyText, classes.lightText)}>
                <strong><Trans>Not in the business of tracking you and selling your data.</Trans></strong>
              </p>
              <p className={clsx(classes.bodyText, classes.lightText)}>
                <Trans> 
                  We only collect what is minimally necessary to provide our service to you. We promise to not to change that.
                </Trans>
              </p>
            </div>
          </div>
        </div>
        <div className={classes.featureTextContainer}>
          <Typography className={classes.featureHeading} component="h2"><Trans>Easy to use.</Trans></Typography>
          <div className={classes.featureBodyTextContainer}>
            <div className={classes.bodyTextWrapper}>
              <Typography component="p" className={classes.bodyText}>
                <strong><Trans>Sign in however you want.</Trans></strong>
              </Typography>
              <Typography component="p" className={classes.bodyText}>
                <Trans>
                  Sign up with your GitHub, Google or Facebook account. Or connect an Ethereum wallet. No emails required, ever. 
                </Trans>
              </Typography>
            </div>
            <div className={classes.bodyTextWrapper}>
              <Typography component="p" className={classes.bodyText}>
                <strong><Trans>Equal parts privacy and convenience.</Trans></strong>
              </Typography>
              <Typography component="p" className={classes.bodyText}>
                <Trans>
                Preview your stuff. Access it from any device. Organize folders. And much more coming soon. <span role="img"  aria-label="sparkle">✨</span>
                </Trans>
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.featureTextContainer}>
          <Typography className={clsx(classes.featureHeading, classes.lightText)} component="h2"><Trans>Next gen.</Trans></Typography>  
          <div className={classes.featureBodyTextContainer}>
            <div className={classes.bodyTextWrapper}>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <strong><Trans>Powered by peer-to-peer.</Trans></strong>
              </Typography>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <Trans>
                  Files is a next-gen app that blends cloud storage with blockchain and data privacy. We’re leveraging the power of the IPFS and Filecoin network to protect your stuff from data loss.
                </Trans>
              </Typography>
            </div>
            <div className={classes.bodyTextWrapper}>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <strong><Trans>Self-reliance with account recovery.</Trans></strong>
              </Typography>
              <Typography component="p" className={clsx(classes.bodyText, classes.lightText)}>
                <Trans>
                  We don’t store passwords and emails; protecting your keys is your responsibility. Mistakes happen, though. That’s why we make account recovery as easy as humanly possible with threshold key management. 
                </Trans>
              </Typography>
            </div>
          </div>
        </div>
      </article>
      {/* To WWW, from ChainSafe */}
      <div className={classes.loveLetterContainer}>
        <div className={classes.loveLetterContentContainer}>
          <img className={classes.loveLetterImg} src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1617711769/files.chainsafe.io/cs-logo-black-bg_mdbtml.png" alt="ChainSafe Logo on black background"/>
          <div className={clsx(classes.bodyTextWrapper, classes.flexDirectionColumn, classes.loveLetterTextWrapper)}>
            <Typography variant="h4" component="h2"><Trans>A love letter to the WWW...</Trans></Typography>
            <Typography component="p" className={clsx(classes.bodyText, classes.loveLetterText)}>
              <Trans>
              Yes, we want people to have the best experience online without sacrificing their privacy or security. But there’s more. We’re reimagining the future of filesystems and file lifecycles.   Why? Because you deserve to spend less time uploading here, downloading there, and shuffling stuff from platform to platform.  We’re going to make it incredibly easy to connect all your content securely. Without forcing you onto a single platform. 
              <br></br>
              <br></br>
              Stay tuned. We’re working with the best teams innovating software to make this a reality.
            </Trans>
            </Typography>
            <Typography variant="h4" component="h3"><Trans>...From the team at ChainSafe Products</Trans></Typography>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}

export default Landing
