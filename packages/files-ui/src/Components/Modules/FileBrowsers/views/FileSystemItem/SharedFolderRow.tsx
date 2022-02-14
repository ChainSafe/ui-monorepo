import React, { useCallback, useMemo, useRef, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher, useDoubleClick, useOnClickOutside } from "@chainsafe/common-theme"
import {
  Button,
  CloseCirceSvg,
  DeleteSvg,
  EditSvg,
  FolderFilledIcon,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  MoreIcon,
  TableCell,
  TableRow,
  Typography,
  UserShareSvg
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import { desktopSharedGridSettings, mobileSharedGridSettings } from "../../SharedFoldersOverview"
import SharedUsers from "../../../../Elements/SharedUsers"
import { t, Trans } from "@lingui/macro"
import { Form, FormikProvider, useFormik } from "formik"
import clsx from "clsx"
import { BucketKeyPermission } from "../../../../../Contexts/FilesContext"
import UserBubble from "../../../../Elements/UserBubble"
import { nameValidator } from "../../../../../Utils/validationSchema"
import Menu from "../../../../../UI-components/Menu"
import { getUserDisplayName } from "../../../../../Utils/getUserDisplayName"
import CustomModal from "../../../../Elements/CustomModal"
import CustomButton from "../../../../Elements/CustomButton"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {

  return createStyles({
    tableRow: {
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopSharedGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileSharedGridSettings
      },
      "&.droppable": {
        border: `2px solid ${palette.primary.main}`
      }
    },
    folderIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
        fill: palette.additional.gray[9]
      }
    },
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0
      },
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`
      }
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      fill: constants.fileSystemItemRow.menuIcon,
      "& path" : {
        fill: constants.fileSystemItemRow.menuIcon

      }
    },
    desktopRename: {
      display: "flex",
      flexDirection: "row",
      "& svg": {
        width: 20,
        height: 20
      }
    },
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      "&.editing": {
        overflow: "visible"
      }
    },
    sharedUser: {
      overflow: "visible",
      [breakpoints.down("sm")]: {
        padding: "0 !important"
      }
    },
    dropdownIcon: {
      width: 14,
      height: 14,
      padding: 0,
      position: "relative",
      fontSize: "unset",
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon,
        top: "50%",
        left: 0,
        width: 14,
        height: 14,
        position: "absolute"
      }
    },
    focusVisible:{
      backgroundColor: "transparent !important"
    },
    modalRoot: {
      [breakpoints.down("md")]: {
        paddingBottom: Number(constants?.mobileButtonHeight)
      }
    },
    modalInner: {
      [breakpoints.down("md")]: {
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    renameHeader: {
      textAlign: "center"
    },
    renameFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    renameModal: {
      padding: constants.generalUnit * 4
    },
    okButton: {
      marginLeft: constants.generalUnit
    }
  })
})

interface Props {
  bucket: BucketKeyPermission
  handleRename: (bucket: BucketKeyPermission, newName: string) => void
  openSharedFolder: (bucketId: string) => void
  onEditSharedFolder: () => void
  handleDeleteSharedFolder: () => void
}

const SharedFolderRow = ({ bucket, handleRename, openSharedFolder, handleDeleteSharedFolder, onEditSharedFolder }: Props) => {
  const classes = useStyles()
  const { name, size } = bucket

  const { desktop } = useThemeSwitcher()
  const [isRenaming, setIsRenaming] = useState(false)
  const formRef = useRef(null)
  const isOwner = useMemo(() => bucket.permission === "owner", [bucket.permission])

  const menuItems: IMenuItem[] = isOwner
    ? [{
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setIsRenaming(true)
    },
    {
      contents: (
        <>
          <UserShareSvg className={classes.menuIcon} />
          <span data-cy="menu-manage-access">
            <Trans>Manage Access</Trans>
          </span>
        </>
      ),
      onClick: onEditSharedFolder
    }, {
      contents: (
        <>
          <DeleteSvg className={classes.menuIcon} />
          <span data-cy="menu-delete">
            <Trans>Delete</Trans>
          </span>
        </>
      ),
      onClick: handleDeleteSharedFolder
    }]
    : [{
      contents: (
        <>
          <CloseCirceSvg className={classes.menuIcon} />
          <span data-cy="menu-leave">
            <Trans>Leave</Trans>
          </span>
        </>
      ),
      onClick: handleDeleteSharedFolder
    }]


  const onSingleClick = useCallback(
    () => {
      if (!desktop) {
        // on mobile
        openSharedFolder(bucket.id)
      }
    },
    [desktop, openSharedFolder, bucket]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
        openSharedFolder(bucket.id)
      }
    },
    [desktop, openSharedFolder, bucket]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderClick = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  const formik = useFormik({
    initialValues:{
      name
    },
    enableReinitialize: true,
    validationSchema: nameValidator,
    onSubmit:(values, { resetForm }) => {
      const newName = values.name?.trim()

      newName && handleRename && handleRename(bucket, newName)
      setIsRenaming(false)
      resetForm()
    }
  })

  const stopEditing = useCallback(() => {
    setIsRenaming(false)
    formik.resetForm()
  }, [formik, setIsRenaming])

  useOnClickOutside(formRef, stopEditing)

  return  (
    <>
      <TableRow
        data-cy="row-shared-folder-item"
        className={classes.tableRow}
        type="grid"
      >
        {desktop &&
        <TableCell
          className={classes.folderIcon}
          onClick={(e) => onFolderClick(e)}
        >
          <FolderFilledIcon/>
        </TableCell>
        }
        <TableCell
          data-cy="cell-shared-folder-item-name"
          align="left"
          className={clsx(classes.filename, desktop && isRenaming && "editing")}
          onClick={(e) => onFolderClick(e)}
        >
          {!isRenaming || !desktop
            ? <Typography>{name}</Typography>
            : (
              <FormikProvider value={formik}>
                <Form
                  className={classes.desktopRename}
                  data-cy='form-rename'
                >
                  <FormikTextInput
                    className={classes.renameInput}
                    data-cy='input-rename-share'
                    name="name"
                    inputVariant="minimal"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        stopEditing()
                      }
                    }}
                    placeholder = {t`Please enter a folder name`}
                    autoFocus={isRenaming}
                  />
                </Form>
              </FormikProvider>
            )
          }
        </TableCell>
        {desktop &&
        <TableCell align="left">
          {isOwner
            ? t`me`
            : <UserBubble
              tooltip={getUserDisplayName(bucket.owners[0])}
              showHashIcon={true}
            />}
        </TableCell>
        }
        <TableCell
          data-cy="shared-folder-item-shared-with"
          align="left"
          className={classes.sharedUser}
        >
          <SharedUsers bucket={bucket}/>
        </TableCell>
        {desktop &&
        <TableCell align="left">
          {formatBytes(size, 2)}
        </TableCell>
        }
        <TableCell align="right">
          <Menu
            testId='file-item-kebab'
            icon={<MoreIcon className={classes.dropdownIcon}/>}
            options={menuItems}
            style={{ focusVisible: classes.focusVisible }}
          />
        </TableCell>
      </TableRow>
      {
        isRenaming && !desktop && (
          <>
            <CustomModal
              className={classes.modalRoot}
              injectedClass={{
                inner: classes.modalInner
              }}
              closePosition="none"
              active={isRenaming}
              onClose={() => setIsRenaming(false)}
            >
              <FormikProvider value={formik}>
                <Form className={classes.renameModal}>
                  <Typography
                    className={classes.renameHeader}
                    component="p"
                    variant="h5"
                  >
                    <Trans>Rename shared folder</Trans>
                  </Typography>
                  <FormikTextInput
                    label="Name"
                    className={classes.renameInput}
                    name="name"
                    placeholder={t`Please enter a folder name`}
                    autoFocus={isRenaming}
                  />
                  <footer className={classes.renameFooter}>
                    <CustomButton
                      onClick={() => setIsRenaming(false)}
                      size="medium"
                      variant={desktop ? "outline" : "gray"}
                      type="button"
                    >
                      <Trans>Cancel</Trans>
                    </CustomButton>
                    <Button
                      variant="primary"
                      size="medium"
                      type="submit"
                      className={classes.okButton}
                      disabled={!formik.dirty}
                    >
                      <Trans>Update</Trans>
                    </Button>
                  </footer>
                </Form>
              </FormikProvider>
            </CustomModal>
            <Typography>{name}</Typography>
          </>
        )
      }
    </>
  )
}

export default SharedFolderRow
