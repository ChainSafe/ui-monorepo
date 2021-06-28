import React, { useCallback, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher, useDoubleClick } from "@chainsafe/common-theme"
import {
  Button,
  CheckSvg,
  DeleteSvg,
  EditSvg,
  FolderFilledIcon,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  MenuDropdown,
  MoreIcon,
  TableCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import { Bucket, BucketUser } from "@chainsafe/files-api-client"
import { desktopSharedGridSettings, mobileSharedGridSettings } from "../../SharedFoldersOverview"
import SharedUsers from "../../../../Elements/SharedUser"
import { t, Trans } from "@lingui/macro"
import { FormikProvider, Form, useFormik } from "formik"
import { object, string } from "yup"
import clsx from "clsx"

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
      "& svg": {
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
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    },
    dropdownOptions: {
      backgroundColor: constants.fileSystemItemRow.optionsBackground,
      color: constants.fileSystemItemRow.optionsColor,
      border: `1px solid ${constants.fileSystemItemRow.optionsBorder}`
    },
    dropdownItem: {
      backgroundColor: constants.fileSystemItemRow.itemBackground,
      color: constants.fileSystemItemRow.itemColor
    }
  })
})

interface Props {
  bucket: Bucket
  handleRename: (bucket: Bucket, newName: string) => void
}

const SharedFolderItem = ({ bucket, handleRename }: Props) => {
  const classes = useStyles()
  const { name, size } = bucket
  const { desktop } = useThemeSwitcher()
  const [editing, setEditing] = useState(false)

  const menuItems: IMenuItem[] = [
    {
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setEditing(true)
    },
    {
      contents: (
        <>
          <DeleteSvg className={classes.menuIcon} />
          <span data-cy="menu-delete">
            <Trans>Delete</Trans>
          </span>
        </>
      ),
      onClick: () => console.log("not implemented")
    }
  ]

  const onSingleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop 
      } else {
        // on mobile
      }
    },
    [desktop]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
      } else {
        // on mobile
        return
      }
    },
    [desktop]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderClick = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  const getUserIds = (users: BucketUser[]): string[] => {
    return users.reduce((acc: string[], user): string[] => {
      return user.uuid ? [...acc, user.uuid] :  acc
    }, [] as string[])
  }

  const userIds = [...getUserIds(bucket.owners), ...getUserIds(bucket.readers), ...getUserIds(bucket.writers)]

  const invalidFilenameRegex = new RegExp("/")
  const renameSchema = object().shape({
    fileName: string()
      .min(1, t`Please enter a name`)
      .max(65, t`Name too long`)
      .test(
        t`Invalid name`,
        t`Name cannot contain '/' character`,
        (val: string | null | undefined) =>
          !invalidFilenameRegex.test(val || "")
      )
      .required(t`A name is required`)
  })

  const formik = useFormik({
    initialValues:{
      fileName: name
    },
    validationSchema:renameSchema,
    onSubmit:(values, { resetForm }) => {
      handleRename && values.fileName &&
        handleRename(
          bucket,
          values.fileName
        )
      setEditing(false)
      resetForm()
    }
  })

  return  (
    <TableRow
      data-cy="shared-folder-item-row"
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
        data-cy="shared-folder-item-name"
        align="left"
        className={clsx(classes.filename, desktop && editing && "editing")}
        onClick={(e) => onFolderClick(e)}
      >
        {!editing
          ? <Typography>{name}</Typography>
          : <FormikProvider value={formik}>
            <Form
              className={classes.desktopRename}
              data-cy='rename-form'
              onBlur={() => setEditing(false)}
            >
              <FormikTextInput
                className={classes.renameInput}
                name="fileName"
                inputVariant="minimal"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setEditing(false)
                  }
                }}
                placeholder = {t`Please enter a folder name`}
                autoFocus={editing}
              />
              <Button
                data-cy='rename-submit-button'
                variant="dashed"
                size="small"
                type="submit"
                disabled={!formik.dirty}
              >
                <CheckSvg />
              </Button>
            </Form>
          </FormikProvider>
        }
      </TableCell>
      <TableCell
        data-cy="shared-folder-item-shared-with"
        align="left"
        className={classes.sharedUser}
      >
        <SharedUsers sharedUsers={userIds}/>
      </TableCell>
      {desktop &&
        <TableCell align="left">
          {formatBytes(size)}
        </TableCell>
      }
      <TableCell align="right">
        <MenuDropdown
          testId='sharedFolderDropdown'
          animation="none"
          anchor={desktop ? "bottom-center" : "bottom-right"}
          menuItems={menuItems}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions,
            item: classes.dropdownItem
          }}
          indicator={MoreIcon}
        />
      </TableCell>
    </TableRow>
  )
}

export default SharedFolderItem
