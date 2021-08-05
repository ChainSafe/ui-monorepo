import {
  Button,
  Grid,
  Typography
} from "@chainsafe/common-components"
import {
  createStyles,
  makeStyles,
  useMediaQuery
} from "@chainsafe/common-theme"
import React from "react"
import { Formik, Form } from "formik"
import { CSFTheme } from "../../../../Themes/types"
import { useFileBrowser } from "../../../../Contexts/FileBrowserContext"
import CustomModal from "../../../Elements/CustomModal"
import CustomButton from "../../../Elements/CustomButton"
import { Trans } from "@lingui/macro"


const useStyles = makeStyles(
  ({ breakpoints, constants, typography, zIndex }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column"
      },
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.createFolder.backgroundColor,
        color: constants.createFolder.color,
        [breakpoints.down("md")]: {
          bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      input: {
        marginBottom: constants.generalUnit * 2
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight
        }
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
      },
      heading: {
        color: constants.createFolder.color,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "center",
        marginBottom: constants.generalUnit * 4
      }
    })
  }
)

interface ICreateFolderModalProps {
  modalOpen: boolean
  close: () => void
}

const CreateFolderModal: React.FC<ICreateFolderModalProps> = ({
  modalOpen,
  close
}: ICreateFolderModalProps) => {
  const classes = useStyles()
  const {  bucket } = useFileBrowser()
  const desktop = useMediaQuery("md")

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <Formik
        initialValues={{
          name: ""
        }}
        validateOnChange={false}
        onSubmit={async () => {
          if (!bucket) return
        }}
      >
        <Form>
          <div
            className={classes.root}
            data-cy="modal-create-folder"
          >
            {!desktop && (
              <Grid
                item
                xs={12}
                sm={12}
              >
                <Typography
                  className={classes.heading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>Add a card</Trans>
                </Typography>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sm={12}
              className={classes.input}
            >
              hello
            </Grid>
            <Grid
              item
              flexDirection="row"
              justifyContent="flex-end"
            >
              <CustomButton
                data-cy="button-cancel-create-folder"
                onClick={() => close()}
                size="medium"
                className={classes.cancelButton}
                variant={desktop ? "outline" : "gray"}
                type="button"
              >
                <Trans>Cancel</Trans>
              </CustomButton>
              <Button
                data-cy="button-create-folder"
                size={desktop ? "medium" : "large"}
                variant="primary"
                type="submit"
                className={classes.okButton}
              >
                {desktop ? <Trans>OK</Trans> : <Trans>Create</Trans>}
              </Button>
            </Grid>
          </div>
        </Form>
      </Formik>
    </CustomModal>
  )
}

export default CreateFolderModal
