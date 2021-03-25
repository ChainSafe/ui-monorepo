import React, { useState, useEffect } from "react"
import Profile from "./Profile"
import { Tabs,
  TabPane as TabPaneOrigin,
  Typography, Divider,
  Breadcrumb,
  Crumb,
  useToaster,
  useParams,
  useHistory,
  ITabPaneProps
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { useUser } from "@chainsafe/common-contexts"
import { ROUTE_LINKS, SettingsPath, SETTINGS_BASE } from "../../FilesRoutes"
import { t, Trans } from "@lingui/macro"
import Plan from "./Plan"
import { ProfileIcon } from "@chainsafe/common-components"

const TabPane = (props: ITabPaneProps<SettingsPath>) => TabPaneOrigin(props)
const useStyles = makeStyles(({ constants, breakpoints, palette }: ITheme) =>
  createStyles({
    title: {
      marginTop: constants.generalUnit,
      [breakpoints.down("md")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${constants.generalUnit}px 0`
      }
    },
    divider: {
      [breakpoints.down("md")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${constants.generalUnit}px 0`
      }
    },
    container: {
      marginTop: constants.generalUnit * 2
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: constants.generalUnit * 3
    },
    headerContainer: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`,
        marginTop: constants.generalUnit * 4,
        marginBottom: constants.generalUnit * 2
      }
    },
    tabsContainer: {
      borderRadius: 10,
      backgroundColor: palette.additional["gray"][3],
      marginTop: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit * 2,
        padding: `0 ${constants.generalUnit * 2}px`
      }
    },
    tabPane: {
      flex: 1,
      padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 5}px`
    }
  })
)

const Settings: React.FC = () => {
  const { path } = useParams<{path: SettingsPath}>()
  const classes = useStyles()
  const { profile, updateProfile } = useUser()
  const { redirect } = useHistory()
  const { addToastMessage } = useToaster()

  const [profileData, setProfileData] = useState(profile)
  const [updatingProfile, setUpdatingProfile] = useState(false)

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        publicAddress: profile?.publicAddress
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setProfileData((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value
    }))
  }

  const onUpdateProfile = async (firstName: string, lastName: string, email: string) => {
    try {
      setUpdatingProfile(true)
      await updateProfile(firstName, lastName, email)
      addToastMessage({ message: t`Profile updated` })
      setUpdatingProfile(false)
    } catch (error) {
      addToastMessage({ message: error, appearance: "error" })
      setUpdatingProfile(false)
    }
  }

  const crumbs: Crumb[] = [
    {
      text: t`Settings`
    },
    {
      text: path
    }
  ]

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Breadcrumb
          crumbs={crumbs}
          homeOnClick={() => redirect(ROUTE_LINKS.Home())}
        />
        <Typography variant="h1" component="p" className={classes.title}>
          <Trans>Settings</Trans>
        </Typography>
      </div>
      <Divider />
      <div className={classes.tabsContainer}>
        <Tabs
          activeKey={path}
          onTabSelect={(key: SettingsPath) => redirect(`${SETTINGS_BASE}/${key}`)}
        >
          <TabPane
            className={classes.tabPane}
            title={t`Profile and Display`}
            tabKey="profile"
            icon={<ProfileIcon/>}
          >
            {profileData ? (
              <Profile
                profile={profileData}
                handleValueChange={handleChange}
                onUpdateProfile={onUpdateProfile}
                updatingProfile={updatingProfile}
              />
            ) : null}
          </TabPane>
          {/* <TabPane title={t`Plan`} tabKey="purchase">
            <Plan />
          </TabPane> */}
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
