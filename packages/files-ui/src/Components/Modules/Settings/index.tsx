import React, { useState, useEffect } from "react"
import Profile from "./Profile"
import Plan from "./Plan"
import {
  Tabs,
  TabPane,
  Typography,
  Divider,
  Spinner,
  LOADER,
  Breadcrumb,
  Crumb,
  useHistory,
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-themes"
import { useUser } from "@chainsafe/common-contexts"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: theme.constants.generalUnit * 2,
      marginBottom: 160,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.constants.generalUnit * 3,
    },
    headerContainer: {
      marginBottom: theme.constants.generalUnit * 4,
    },
    tabsContainer: {
      marginTop: theme.constants.generalUnit * 4,
    },
  }),
)

type TabKey = "profileView" | "planView"

const Settings: React.FC = () => {
  const [tabKey, setTabKey] = useState<TabKey>("profileView")
  const classes = useStyles()
  const { profile, refreshProfile, updateProfile } = useUser()
  const [, setUpdateLoading] = useState(false)
  const [error, setError] = useState("")
  const { redirect } = useHistory()

  const [profileData, setProfileData] = useState(profile)

  useEffect(() => {
    refreshProfile()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setProfileData({
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      publicAddress: profile?.publicAddress,
    })
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setProfileData((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }))
  }

  const onUpdateProfile = async () => {
    try {
      setUpdateLoading(true)
      await updateProfile(
        profileData?.firstName || "",
        profileData?.lastName || "",
        profileData?.email || "",
      )
      setUpdateLoading(false)
    } catch (err) {
      setUpdateLoading(false)
      setError(err)
    }
  }

  const crumbs: Crumb[] = [
    {
      text: "Settings",
    },
  ]

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Breadcrumb
          crumbs={crumbs}
          homeOnClick={() => redirect(ROUTE_LINKS.Home)}
        />
        <Typography variant="h1">Settings</Typography>
      </div>
      <Divider />
      <div className={classes.tabsContainer}>
        <Tabs
          activeKey={tabKey}
          onTabSelect={(key) => setTabKey(key as TabKey)}
        >
          <TabPane title="Profile" tabKey="profileView">
            {profile ? (
              <Profile
                firstName={profileData?.firstName}
                lastName={profileData?.lastName}
                email={profileData?.email}
                publicAddress={profileData?.publicAddress}
                handleValueChange={handleChange}
                onUpdateProfile={onUpdateProfile}
              />
            ) : error ? (
              <div className={classes.container}>
                <Typography>{error}</Typography>
              </div>
            ) : null}
          </TabPane>
          <TabPane title="Plan" tabKey="planView">
            <Plan />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
