import React, { useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import {
  Button,
  FormikRadioInput,
  FormikTextInput,
  Grid,
  IMenuItem,
  PlusIcon,
  PlusSvg,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import { CSSTheme } from "../../Themes/types"
import { useStorage } from "../../Contexts/StorageContext"
import { t, Trans } from "@lingui/macro"
import BucketRow from "../Elements/BucketRow"
import CustomModal from "../Elements/CustomModal"
import { Form, FormikProvider, useFormik } from "formik"
import { bucketNameValidator } from "../../Utils/validationSchema"
import { useCallback } from "react"
import RestrictedModeBanner from "../Elements/RestrictedModeBanner"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { FileSystemType } from "@chainsafe/files-api-client"
import { Helmet } from "react-helmet-async"
import AnchorMenu, { AnchoreMenuPosition } from "../UI-components/AnchorMenu"

export const desktopGridSettings = "3fr 110px 150px 70px !important"
export const mobileGridSettings = "3fr 100px 100px 70px !important"

const useStyles = makeStyles(({ breakpoints, animation, constants, typography }: CSSTheme) =>
  createStyles({
    root: {
      position: "relative",
      marginTop: constants.generalUnit * 2
    },
    tableHead: {
      marginTop: 24
    },
    tableRow: {
      border: "2px solid transparent",
      transitionDuration: `${animation.transform}ms`,
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      }
    },
    modalFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    createBucketModal: {
      padding: constants.generalUnit * 4
    },
    modalInner: {
      width: "100%"
    },
    okButton: {
      marginLeft: constants.generalUnit
    },
    controls: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > button": {
        marginLeft: constants.generalUnit
      }
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    modalRoot: {
      padding: constants.generalUnit * 4,
      flexDirection: "column"
    },
    input: {
      marginBottom: constants.generalUnit * 2
    },
    heading: {
      color: constants.createFolder.color,
      fontWeight: typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: constants.generalUnit * 4
    },
    label: {
      fontSize: 14,
      lineHeight: "22px"
    },
    fileSystemSelector: {
      margin: 5,
      "& > div": {
        display: "flex",
        flexDirection: "row"
      }
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      fill: constants.previewModal.menuItemIconColor
    }
  })
)

const BucketsPage = () => {
  const classes = useStyles()
  const { storageBuckets, createBucket, refreshBuckets } = useStorage()
  const { accountRestricted } = useStorageApi()
  const [isCreateBucketModalOpen, setIsCreateBucketModalOpen] = useState(false)
  const bucketsToShow = useMemo(() => storageBuckets.filter(b => b.status === "created"), [storageBuckets])
  const [contextMenuPosition, setContextMenuPosition] = useState<AnchoreMenuPosition | null>(null)
  const [contextMenuOptions, setContextMenuOptions] = useState<IMenuItem[]>([])
  const generalContextMenuOptions: IMenuItem[] = useMemo(() => [
    {
      contents: (
        <>
          <PlusSvg className={classes.menuIcon} />
          <span>
            <Trans>Create Bucket</Trans>
          </span>
        </>
      ),
      onClick: () => setIsCreateBucketModalOpen(true)
    }
  ], [classes])

  const bucketNameValidationSchema = useMemo(
    () => bucketNameValidator(bucketsToShow.map(b => b.name))
    , [bucketsToShow]
  )

  usePageTrack()

  useEffect(() => {
    // this is needed for tests
    refreshBuckets()
  }, [refreshBuckets])

  const formik = useFormik({
    initialValues:{
      name: "",
      fileSystemType: "chainsafe"
    },
    enableReinitialize: true,
    validationSchema: bucketNameValidationSchema,
    onSubmit:(values, helpers) => {
      helpers.setSubmitting(true)
      createBucket(values.name.trim(), values.fileSystemType as FileSystemType)
        .then(() => {
          setIsCreateBucketModalOpen(false)
        })
        .catch(console.error)
        .finally(() => {
          helpers.setSubmitting(false)
          helpers.resetForm()
        })
    }
  })

  const closeCreateModal = useCallback(() => {
    formik.resetForm()
    setIsCreateBucketModalOpen(false)
  }, [formik])

  const handleContextMenu = useCallback((e: React.MouseEvent, options?: IMenuItem[]) => {
    e.preventDefault()
    if(options){
      setContextMenuOptions(options)
    } else {
      setContextMenuOptions(generalContextMenuOptions)
    }
    setContextMenuPosition({
      left: e.clientX - 2,
      top: e.clientY - 4
    })
  }, [generalContextMenuOptions])

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{t`Buckets`} - Chainsafe Storage</title>
      </Helmet>
      <header
        className={classes.header}
        data-cy="header-buckets"
        onContextMenu={handleContextMenu}
      >
        <Typography variant='h1'>
          <Trans>
            Buckets
          </Trans>
        </Typography>
        <div className={classes.controls}>
          <Button
            data-cy="button-create-bucket"
            onClick={() => setIsCreateBucketModalOpen(true)}
            variant="outline"
            disabled={accountRestricted}
          >
            <PlusIcon />
            <Trans>Create Bucket</Trans>
          </Button>
        </div>
      </header>
      {contextMenuPosition && (
        <AnchorMenu
          options={contextMenuOptions}
          onClose={() => setContextMenuPosition(null)}
          anchorPosition={contextMenuPosition}
        />
      )}
      <Table
        fullWidth={true}
        striped={true}
        hover={true}
      >
        <TableHead
          className={classes.tableHead}
          onContextMenu={handleContextMenu}
        >
          <TableRow
            type="grid"
            className={classes.tableRow}
          >
            <TableHeadCell
              data-cy="table-header-name"
              sortButtons={false}
              align="left"
            >
              <Trans>Name</Trans>
            </TableHeadCell>
            <TableHeadCell
              data-cy="table-header-file-system"
              sortButtons={false}
              align="left"
            >
              <Trans>File System</Trans>
            </TableHeadCell>
            <TableHeadCell
              data-cy="table-header-size"
              sortButtons={false}
              align="center"
            >
              <Trans>Size</Trans>
            </TableHeadCell>
            <TableHeadCell>{/* Menu */}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bucketsToShow
            .map((bucket) =>
              <BucketRow
                bucket={bucket}
                key={bucket.id}
                handleContextMenu={handleContextMenu}
              />
            )}
        </TableBody>
      </Table>
      {accountRestricted &&
        <RestrictedModeBanner />
      }
      <CustomModal
        active={isCreateBucketModalOpen}
        className={classes.createBucketModal}
        injectedClass={{
          inner: classes.modalInner
        }}
        closePosition="none"
        testId="create-bucket"
      >
        <div
          className={classes.modalRoot}
        >
          <FormikProvider value={formik}>
            <Form>
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
                  <Trans>Create Bucket</Trans>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                className={classes.input}
              >
                <FormikTextInput
                  data-cy="input-bucket-name"
                  name="name"
                  size="large"
                  placeholder={t`Bucket name`}
                  label={t`Bucket name`}
                  labelClassName={classes.label}
                  autoFocus={true}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                className={classes.input}
              >
                <label className={classes.fileSystemSelector}>
                  <Trans>File system type</Trans>
                  <div>
                    <FormikRadioInput
                      name="fileSystemType"
                      id='chainsafe'
                      label='Chainsafe'
                      testId="chainsafe"
                    />
                    <FormikRadioInput
                      name="fileSystemType"
                      id='ipfs'
                      label='IPFS'
                      testId="ipfs"
                    />
                  </div>
                </label>
              </Grid>
              <footer className={classes.modalFooter}>
                <Button
                  data-cy="button-cancel-create"
                  onClick={closeCreateModal}
                  size="medium"
                  variant="outline"
                  type="button"
                >
                  <Trans>Cancel</Trans>
                </Button>
                <Button
                  data-cy="button-submit-create"
                  variant="primary"
                  size="medium"
                  className={classes.okButton}
                  type="submit"
                  loading={formik.isSubmitting}
                >
                  <Trans>Create</Trans>
                </Button>
              </footer>
            </Form>
          </FormikProvider>
        </div>
      </CustomModal>
    </div>
  )
}

export default BucketsPage
