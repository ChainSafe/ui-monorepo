import React from "react"
// import { Button } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: ITheme) => {
    return createStyles({
    headerContainer: {
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
      paddingBottom: constants.generalUnit * 5,
    },
    headerContentContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginTop: "10%",
      "& > img": {
        maxWidth: "80vw",
      },
      "& > p": {
        fontSize: "20px",
        marginBottom: constants.generalUnit * 3,
      }
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
      [breakpoints.up('lg')]:{
        minHeight: "100vh",
      },
      [breakpoints.down('lg')]:{
        minHeight: "60vh",
      },
      [breakpoints.down('sm')]:{
        minHeight: "50vh",
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
        [breakpoints.up('lg')]: {
        maxWidth: "100%",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gridTemplateRows: "1",
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
      }
    },
    gifThumbnailContainer: {
        margin: "5% 5% 5% 5%",
    },
    gifThumbnail: {
      maxWidth: "100%",
      objectFit: "contain",
      objectPosition: "left top",
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
        [breakpoints.down(500)]: {
          width: "80px",
          height: "80px",
        },
      }
    },
    featureTextContainer: {
      display: "grid",
      gridTemplateColumns: "minmax(0,5fr) minmax(0, 7fr)",
      [breakpoints.up(750)]:{
        height: "34vh",
      },
      [breakpoints.down(750)]:{
        minHeight: "45vh",
      },
      alignContent: "center",
      "&:first-of-type": {
        background: "#5766D7"
      },
      "&:last-of-type": {
        background: "#141414"
      },
      padding: "5vh",
      "& > h1": {
        [breakpoints.up('lg')]:{
          fontSize: "72px",
          lineHeight: "80px",
        },
        [breakpoints.down('lg')]:{
          fontSize: "48px",
          lineHeight: "56px",
        },
        [breakpoints.down('md')]:{
          fontSize: "30px",
          lineHeight: "38px",
        },
      }
    },
    featureBodyTextContainer: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
    },
    bodyTextWrapper: {
      maxWidth: "95%",
      marginBottom: constants.generalUnit,

      [breakpoints.up('lg')]: {
        width: "100%",
        maxWidth: "99%",
      },
      "& > a": {
        color: palette.additional["gray"][9],
        fontSize: "16px",
        lineHeight: "24px",
      },
    },
    bodyText: {
        fontSize: "16px",
        lineHeight: "24px",
        marginBottom: constants.generalUnit,
        // [breakpoints.between(960, 1380)]:{
        //   maxWidth: "100%",
        // },
        // [breakpoints.down('sm')]:{
        //   maxWidth: "100%",
        // },
    },
    lightText: {
        color: palette.additional["gray"][3],
    }
    })
  },
)

const Landing: React.FC = () => {
  const classes = useStyles()
  return (
    <>
    <div >
      <section>
        <header className={classes.headerContainer}>
          <div className={classes.headerContentContainer}>
            <p>Store Files. In absolute privacy. With absolute simplicity.</p>
            <img style={{width: "80%"}} src="https://res.cloudinary.com/ddxhvanz2/image/upload/v1616945694/files.chainsafe.io/screenshots_ss4chz.png" alt=""/>
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
                <p>A sanctuary for all your files and thoughts.</p>
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
        <article >
          <div className={classes.featureTextContainer}>
            <Trans>
              <h1 className={classes.lightText}>Secure.</h1>
            </Trans>
            <div className={classes.featureBodyTextContainer}>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    What you want to do with your files is totally up to you.  End-to-end encryption means your content can only be seen by you.
                  </p>
                </Trans>
              </div>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    What you want to do with your files is totally up to you.  End-to-end encryption means your content can only be seen by you.
                  </p>
                </Trans>
              </div>
            </div>
          </div>
          <div className={classes.featureTextContainer}>
            <Trans>
              <h1>Easy to use.</h1>
            </Trans>
            <div className={classes.featureBodyTextContainer}>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={classes.bodyText}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={classes.bodyText}>
                    We don’t want to know what you’re storing.
                  </p>
                </Trans>
              </div>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={classes.bodyText}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={classes.bodyText}>
                    We don’t want to know what you’re storing.
                  </p>
                </Trans>
              </div>
            </div>
          </div>
          <div className={classes.featureTextContainer}>
            <Trans>
              <h1 className={classes.lightText}>Next gen.</h1>  
            </Trans>
            <div className={classes.featureBodyTextContainer}>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    We don’t want to know what you’re storing.
                  </p>
                </Trans>
             </div>
              <div className={classes.bodyTextWrapper}>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    <strong>We don’t want to know what you’re storing.</strong>
                  </p>
                </Trans>
                <Trans>
                  <p className={clsx(classes.bodyText, classes.lightText)}>
                    We don’t want to know what you’re storing.
                  </p>
                </Trans>
             </div>
            </div>
          </div>
        </article>
       </main>
      </section>
    </div>
    </>
  )
}

export default Landing
