import { Button, ShareAltSvg, Typography, Grid, TextInput, MenuDropdown, CrossIcon } from "@chainsafe/common-components"
import { createStyles, debounce, makeStyles, useOnClickOutside, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useState, useCallback, useMemo, ReactNode, useRef } from "react"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useEffect } from "react"
import { SharedFolderModalMode, SharedUserData } from "./types"
import { useCreateOrEditSharedFolder } from "./hooks/useCreateOrEditSharedFolder"
import { useLookupSharedFolderUser } from "./hooks/useLookupUser"
import { nameValidator } from "../../../Utils/validationSchema"
import { getUserDisplayName } from "../../../Utils/getUserDisplayName"
import { NonceResponsePermission, LookupUser } from "@chainsafe/files-api-client"
import clsx from "clsx"
import { Hashicon } from "@emeraldpay/hashicon-react"
import LinkList from "./LinkSharing/LinkList"

const useStyles = makeStyles(
  ({ breakpoints, constants, typography, palette, zIndex }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 3,
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        [breakpoints.down("sm")]: {
          padding: constants.generalUnit
        }
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
      },
      heading: {
        color: constants.modalDefault.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 10
      },
      iconBacking: {
        backgroundColor: constants.modalDefault.iconBackingColor,
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: constants.generalUnit * 2,
        marginTop: constants.generalUnit,
        "& > svg": {
          width: 16,
          height: 16,
          fill: palette.primary.main,
          position: "relative",
          display: "block",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%"
        }
      },
      modalFlexItem: {
        width: "100%",
        marginBottom: constants.generalUnit * 2
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: 600
      },
      shareFolderNameInput: {
        display: "block",
        margin: "0px !important"
      },
      footer: {
        width: "100%",
        paddingTop: constants.generalUnit * 2
      },
      errorText: {
        marginLeft: constants.generalUnit * 1.5,
        color: palette.error.main
      },
      permissionDropdownNoBorder: {
        padding: `0px ${constants.generalUnit * 0.75}px`,
        backgroundColor: palette.additional["gray"][1],
        width: "150px"
      },
      permissionDropDownBorders: {
        border: `1px solid ${palette.additional["gray"][5]}`,
        width: "inherit",
        marginRight: constants.generalUnit,
        borderRadius: "2px"
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: constants.fileSystemItemRow.menuIcon
      },
      menuItem: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: constants.header.menuItemTextColor,
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit,
          fill: palette.additional["gray"][7],
          stroke: palette.additional["gray"][7]
        }
      },
      icon: {
        "& svg": {
          fill: constants.header.iconColor
        }
      },
      options: {
        backgroundColor: constants.header.optionsBackground,
        color: constants.header.optionsTextColor,
        border: `1px solid ${constants.header.optionsBorder}`,
        minWidth: 145
      },
      dropdownTitle: {
        padding: `${constants.generalUnit * 0.75}px ${constants.generalUnit}px`,
        "& p": {
          fontSize: "16px"
        }
      },
      userNameSuggest: {
        position: "relative",
        width: "100%",
        margin: 5
      },
      suggestionsDropDown: {
        position: "absolute",
        width: "100%",
        backgroundColor: palette.common.white.main,
        border: `1px solid ${palette.additional["gray"][5]}`,
        zIndex: zIndex?.layer1
      },
      suggestionsBody: {
        width: "100%",
        padding: constants.generalUnit * 2
      },
      usernameBox: {
        color: palette.additional["gray"][8],
        padding: constants.generalUnit * 2,
        cursor: "pointer",
        ...typography.body1,
        fontSize: "16px",
        "&:hover": {
          backgroundColor: palette.additional["blue"][1]
        }
      },
      boldLabel: {
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: 2
      },
      usernameTextInput: {
        margin: "0px !important",
        width: "100%",
        "& input": {
          border: "0px",
          "&:focus": {
            border: "0px"
          }
        }
      },
      usernameDropdownWrapper: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${palette.additional["gray"][6]}`,
        borderRadius: "2px",
        "&.focus": {
          borderColor: palette.primary.border,
          boxShadow: "0px 0px 4px rgba(24, 144, 255, 0.5)"
        }
      },
      subtitle: {
        color: palette.additional["gray"][7]
      },
      usersWrapper: {
        margin: `${constants.generalUnit * 1.5}px 0`,
        width: "100%"
      },
      addedUserBox: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        padding: `${constants.generalUnit * 0.5}px 0px ${constants.generalUnit * 0.5}px ${constants.generalUnit}px`
      },
      addedUserLabel: {
        fontSize: "16px",
        fontWeight: 600
      },
      hashIcon: {
        marginRight: constants.generalUnit * 2,
        marginTop: constants.generalUnit
      },
      flexContainer: {
        display: "flex",
        alignItems: "center"
      },
      crossButton: {
        padding: "0px !important",
        "& svg": {
          fill: palette.additional["gray"][7]
        }
      },
      linksContainer: {
        width: "100%"
      }
    })
  }
)

interface LinkMenuItems {
  id: NonceResponsePermission
  onClick: () => void
  contents: ReactNode
}

interface ICreateOrManageSharedFolderProps {
  mode?: SharedFolderModalMode
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

const readRights = t`view-only`
const editRights = t`can-edit`
export const translatedPermission = (permission: NonceResponsePermission) => permission === "read" ? readRights : editRights

const CreateOrManageSharedFolder = ({ mode, onClose, bucketToEdit }: ICreateOrManageSharedFolderProps) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { handleCreateSharedFolder, handleEditSharedFolder, isEditingSharedFolder, isCreatingSharedFolder } = useCreateOrEditSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const { sharedFolderReaders,
    sharedFolderWriters,
    onAddNewUser,
    setSharedFolderReaders,
    setSharedFolderWriters,
    handleLookupUser,
    usersError,
    resetUsers
  } = useLookupSharedFolderUser()
  const [hasPermissionsChanged, setHasPermissionsChanged] = useState(false)
  const [nameError, setNameError] = useState("")
  const [newLinkPermission, setNewLinkPermission] = useState<NonceResponsePermission>("read")
  const [usernameSearch, setUsernameSearch] = useState("")
  const [suggestedUsers, setSuggestedUsers] = useState<{label: string; value: string; data: LookupUser }[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [searchActive, setSearchActive] = useState(false)

  const onReset = useCallback(() => {
    setSharedFolderName("")
    setHasPermissionsChanged(false)
    resetUsers()
  }, [resetUsers])

  useEffect(() => {
    onReset()

    if (!bucketToEdit) return

    const newReaders = bucketToEdit.readers.map((reader) => ({
      label: getUserDisplayName(reader),
      value: reader.uuid || "",
      data: reader
    })
    ) || []

    const newWriters = bucketToEdit.writers.map((writer) => ({
      label: getUserDisplayName(writer),
      value: writer.uuid || "",
      data: writer
    })
    ) || []

    setSharedFolderReaders(newReaders)
    setSharedFolderWriters(newWriters)
  }, [bucketToEdit, setSharedFolderReaders, setSharedFolderWriters, onReset])

  const onNameChange = useCallback((value?: string | number) => {
    if (value === undefined) return

    const name = value.toString()
    setSharedFolderName(name)

    nameValidator
      .validate({ name })
      .then(() => {
        setNameError("")
      })
      .catch((e: Error) => {
        setNameError(e.message)
      })
  }, [])

  const handleClose = useCallback(() => {
    onReset()
    onClose()
  }, [onClose, onReset])

  const onCreateSharedFolder = useCallback(() => {
    handleCreateSharedFolder(sharedFolderName, sharedFolderReaders, sharedFolderWriters)
      .catch(console.error)
      .finally(handleClose)
  }, [handleCreateSharedFolder, sharedFolderName, sharedFolderWriters, sharedFolderReaders, handleClose])

  const onEditSharedFolder = useCallback(() => {
    if (!bucketToEdit) return
    handleEditSharedFolder(bucketToEdit, sharedFolderReaders, sharedFolderWriters)
      .catch(console.error)
      .finally(handleClose)
  }, [handleEditSharedFolder, sharedFolderWriters, sharedFolderReaders, handleClose, bucketToEdit])

  const menuItems: LinkMenuItems[] = useMemo(() => [
    {
      id: "read",
      onClick: () => setNewLinkPermission("read"),
      contents: (
        <div
          data-cy="menu-read"
          className={classes.menuItem}
        >
          {readRights}
        </div>
      )
    },
    {
      id: "write",
      onClick: () => setNewLinkPermission("write"),
      contents: (
        <div
          data-cy="menu-write"
          className={classes.menuItem}
        >
          {editRights}
        </div>
      )
    }
  ], [classes.menuItem])

  const getUserMenuItems = useCallback((user: SharedUserData, permission: NonceResponsePermission) => ([
    {
      id: "read",
      onClick: () => {
        if (permission === "write") {
          setHasPermissionsChanged(true)
          setSharedFolderWriters(sharedFolderWriters.filter((sr) => sr.value !== user.value))
          setSharedFolderReaders([...sharedFolderReaders, user])
        }
      },
      contents: (
        <div
          data-cy="menu-read"
          className={classes.menuItem}
        >
          {readRights}
        </div>
      )
    },
    {
      id: "write",
      onClick: () => {
        if (permission === "read") {
          setHasPermissionsChanged(true)
          setSharedFolderReaders(sharedFolderReaders.filter((sr) => sr.value !== user.value))
          setSharedFolderWriters([...sharedFolderWriters, user])
        }
      },
      contents: (
        <div
          data-cy="menu-write"
          className={classes.menuItem}
        >
          {editRights}
        </div>
      )
    }
  ]), [classes.menuItem, setSharedFolderReaders, setSharedFolderWriters, sharedFolderReaders, sharedFolderWriters])

  const onLookupUser = (inputText: string) => {
    handleLookupUser(inputText)
      .then(setSuggestedUsers)
      .catch(console.error)
      .finally(() => setLoadingUsers(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleLookupUser = useCallback(debounce(onLookupUser, 400), [handleLookupUser])

  const onUsernameChange = async (v: string) => {
    setLoadingUsers(true)
    setUsernameSearch(v)
    debouncedHandleLookupUser(v)
  }

  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    if (searchActive) {
      setSearchActive(false)
    }
  })

  return (
    <div className={classes.root}>
      <div className={classes.iconBacking}>
        <ShareAltSvg />
      </div>
      <div className={classes.heading}>
        <Typography className={classes.inputLabel}>
          {mode === "create"
            ? <Trans>Create Shared Folder</Trans>
            : <Trans>Manage Shared Folder</Trans>
          }

        </Typography>
      </div>
      {mode === "create" &&
        <div className={classes.modalFlexItem}>
          <TextInput
            className={classes.shareFolderNameInput}
            labelClassName={classes.inputLabel}
            placeholder={t`Shared Folder Name`}
            label={t`Shared Folder Name`}
            value={sharedFolderName}
            onChange={onNameChange}
            autoFocus
            state={nameError ? "error" : "normal"}
            data-cy="input-shared-folder-name"
            size="large"
          />
          {nameError && (
            <Typography
              component="p"
              variant="body1"
              className={classes.errorText}
            >
              {nameError}
            </Typography>
          )}
        </div>
      }
      <div
        className={classes.userNameSuggest}
        ref={ref}
        onClick={() => { !searchActive && setSearchActive(true)}}
      >
        {mode === "create" && <Typography
          className={classes.boldLabel}
          component="p"
        >
          Add users to shared folder
        </Typography>
        }
        <div className={clsx(classes.usernameDropdownWrapper, searchActive && "focus")}>
          <TextInput
            placeholder={t`Username, wallet address or ENS`}
            size="large"
            value={usernameSearch}
            onChange={(v) => onUsernameChange(v as string)}
            className={classes.usernameTextInput}
            onFocus={() => setSearchActive(true)}
          />
          <MenuDropdown
            title={(newLinkPermission && translatedPermission(newLinkPermission)) || ""}
            anchor="bottom-right"
            className={classes.permissionDropdownNoBorder}
            classNames={{
              icon: classes.icon,
              options: classes.options,
              title: classes.dropdownTitle
            }}
            testId="permission"
            menuItems={menuItems}
          />
        </div>
        {(!!usernameSearch && searchActive) && <div className={classes.suggestionsDropDown}>
          {suggestedUsers.length
            ? <div>
              {suggestedUsers.map((u) => <div
                key={u.value}
                className={classes.usernameBox}
                onClick={() => {
                  onAddNewUser(u, newLinkPermission)
                  setSearchActive(false)
                  setUsernameSearch("")
                  setSuggestedUsers([])
                  setHasPermissionsChanged(true)
                }}
              >
                {u.label}
              </div>)
              }
            </div>
            : <div className={classes.suggestionsBody}>
              <Typography
                component="p"
                variant="body1"
                className={classes.subtitle}
              >
                {loadingUsers
                  ? <Trans>Loading...</Trans>
                  : <Trans>No users found</Trans>
                }
              </Typography>
            </div>
          }
        </div>
        }
      </div>
      <div className={classes.usersWrapper}>
        {sharedFolderReaders.map((sr) => <div
          key={sr.value}
          className={classes.addedUserBox}
        >
          <div className={classes.flexContainer}>
            <div className={classes.hashIcon}>
              <Hashicon
                value={sr.value}
                size={28}
              />
            </div>
            <Typography
              className={classes.addedUserLabel}
              component="p"
            >
              {sr.label}
            </Typography>
          </div>
          <div className={classes.flexContainer}>
            <MenuDropdown
              title={(translatedPermission("read")) || ""}
              anchor="bottom-right"
              className={clsx(classes.permissionDropdownNoBorder, classes.permissionDropDownBorders)}
              classNames={{
                icon: classes.icon,
                options: classes.options,
                title: classes.dropdownTitle
              }}
              testId="permission"
              menuItems={getUserMenuItems(sr, "read")}
            />
            <Button
              variant="link"
              className={classes.crossButton}
              onClick={() => {
                setHasPermissionsChanged(true)
                setSharedFolderReaders(sharedFolderReaders.filter((r) => r.value !== sr.value))
              }}
            >
              <CrossIcon />
            </Button>
          </div>
        </div>
        )}
        {sharedFolderWriters.map((sw) => <div
          key={sw.value}
          className={classes.addedUserBox}
        >
          <div className={classes.flexContainer}>
            <div className={classes.hashIcon}>
              <Hashicon
                value={sw.value}
                size={28}
              />
            </div>
            <Typography
              className={classes.addedUserLabel}
              component="p"
            >
              {sw.label}
            </Typography>
          </div>
          <div className={classes.flexContainer}>
            <MenuDropdown
              title={(translatedPermission("write")) || ""}
              anchor="bottom-right"
              className={clsx(classes.permissionDropdownNoBorder, classes.permissionDropDownBorders)}
              classNames={{
                icon: classes.icon,
                options: classes.options,
                title: classes.dropdownTitle
              }}
              testId="permission"
              menuItems={getUserMenuItems(sw, "write")}
            />
            <Button
              variant="link"
              className={classes.crossButton}
              onClick={() => {
                setHasPermissionsChanged(true)
                setSharedFolderWriters(sharedFolderWriters.filter((r) => r.value !== sw.value))
              }}
            >
              <CrossIcon />
            </Button>
          </div>
        </div>
        )}
      </div>
      {mode === "edit" && !!bucketToEdit && <div className={classes.linksContainer}>
        <LinkList
          bucketEncryptionKey={bucketToEdit.encryptionKey}
          bucketId={bucketToEdit.id}
        />
      </div>
      }
      <Grid
        item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        className={classes.footer}
      >
        {!!usersError && (
          <Typography
            component="p"
            variant="body1"
            className={classes.errorText}
          >
            {usersError}
          </Typography>
        )}
        <Grid
          item
          flexDirection="row"
          justifyContent="flex-end"
        >
          <CustomButton
            onClick={handleClose}
            size="large"
            variant={desktop ? "outline" : "gray"}
            type="button"
            data-cy="button-cancel-create-shared-folder"
          >
            <Trans>Close</Trans>
          </CustomButton>
          <Button
            variant="primary"
            size="large"
            type="submit"
            className={classes.okButton}
            loading={isCreatingSharedFolder || isEditingSharedFolder}
            onClick={mode === "create" ? onCreateSharedFolder : onEditSharedFolder}
            disabled={mode === "create" ? (!!usersError || !!nameError) : !hasPermissionsChanged || !!usersError}
            data-cy={mode === "create" ? "button-create-shared-folder" : "button-update-shared-folder"}
          >
            {mode === "create"
              ? <Trans>Create</Trans>
              : <Trans>Update</Trans>
            }
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateOrManageSharedFolder
