import {
  Button,
  Grid,
  Typography,
  ShareAltIcon,
  Divider,
} from "@imploy/common-components"
import { IFile } from "../../Contexts/DriveContext"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import React from "react"
import CustomModal from "../Elements/CustomModal"
import CustomButton from "../Elements/CustomButton"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography }: ITheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        [breakpoints.down("md")]: {
          padding: 0,
        },
      },
      modalRoot: {},
      modalInner: {
        [breakpoints.down("md")]: {
          bottom:
            (constants?.mobileButtonHeight as number) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        },
        [breakpoints.up("md")]: {
          maxWidth: `${breakpoints.width("sm")}px !important`,
        },
      },
      createFolderButton: {},
      input: {
        marginBottom: constants.generalUnit * 2,
      },
      okButton: {
        marginLeft: constants.generalUnit,
        color: palette.common.white.main,
        backgroundColor: palette.common.black.main,
        [breakpoints.down("md")]: {
          margin: 0,
          width: "80%",
          maxWidth: 300,
        },
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
        },
      },
      label: {
        fontSize: 14,
        lineHeight: "22px",
      },
      heading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
      },
      subheading: {
        color: palette.additional["gray"][8],
        textAlign: "left",
        marginBottom: constants.generalUnit * 4,
      },
      subheadingContainer: {
        paddingBottom: constants.generalUnit * 4,
        [breakpoints.down("md")]: {
          padding: constants.generalUnit * 4,
          textAlign: "center",
        },
      },
      headingContainer: {
        display: "flex",
        alignItems: "center",
        margin: `${constants.generalUnit * 1}px 0 ${
          constants.generalUnit * 4
        }px 0`,
        [breakpoints.down("md")]: {
          justifyContent: "center",
          flexDirection: "column",
          margin: 0,
          borderBottom: `1px solid ${palette.additional["gray"][6]}`,
          padding: constants.generalUnit,
        },
      },
      shareIcon: {
        marginRight: constants.generalUnit * 1.5,
      },
      buttonContainer: {
        [breakpoints.down("md")]: {
          width: "100%",
          padding: constants.generalUnit * 2,
          display: "flex",
          justifyContent: "center",
        },
      },
    })
  },
)

interface IShareDialogProps {
  file?: IFile
  showDialog: boolean
  closeDialog(): void
}

const ShareDialog: React.FC<IShareDialogProps> = ({
  file,
  showDialog,
  closeDialog,
}: IShareDialogProps) => {
  const classes = useStyles()

  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  console.log(file)

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner,
      }}
      active={showDialog}
      closePosition="none"
      maxWidth="md"
    >
      <Grid container flexDirection="column" className={classes.root}>
        <Grid item xs={12} sm={12}>
          <div className={classes.headingContainer}>
            {desktop ? (
              <ShareAltIcon className={classes.shareIcon} />
            ) : (
              <Typography variant="h5" component="h5">
                <Trans>Share</Trans>
              </Typography>
            )}
            <Typography className={classes.heading} variant="h5" component="h5">
              <Trans>
                {desktop
                  ? `Share "${file?.name}" with others`
                  : `"${file?.name}"`}
              </Trans>
            </Typography>
          </div>
          <div className={classes.subheadingContainer}>
            <Typography className={classes.subheading} variant="body1">
              <Trans>
                Anyone with the link will be able to view this file.
              </Trans>
            </Typography>
          </div>
        </Grid>
        <Grid item flexDirection="row" justifyContent="flex-end">
          <CustomButton
            onClick={closeDialog}
            size="medium"
            className={classes.cancelButton}
            variant={desktop ? "outline" : "gray"}
            type="button"
          >
            <Trans>Cancel</Trans>
          </CustomButton>
          <div className={classes.buttonContainer}>
            <Button
              size={desktop ? "medium" : "large"}
              type="submit"
              className={classes.okButton}
            >
              <Trans>Copy Link</Trans>
            </Button>
          </div>
        </Grid>
      </Grid>
    </CustomModal>
  )
}

export default ShareDialog
