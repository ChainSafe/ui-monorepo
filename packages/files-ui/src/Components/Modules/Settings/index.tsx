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

type TabKey = "profile" | "plan"

const Settings: React.FC = () => {
  const [tabKey, setTabKey] = useState<TabKey>("profile")
  const classes = useStyles()
  const { loaders, profile, getProfile, updateProfile } = useUser()
  const [error, setError] = useState("")
  const { redirect } = useHistory()

  const [profileData, setProfileData] = useState(profile)

  useEffect(() => {
    getProfile()
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
      await updateProfile(
        profileData?.firstName || "",
        profileData?.lastName || "",
        profileData?.email || "",
      )
    } catch (err) {
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
        <Breadcrumb crumbs={crumbs} homeOnClick={() => redirect("/home")} />
        <Typography variant="h1">Settings</Typography>
      </div>
      <Divider />
      <div className={classes.tabsContainer}>
        <Tabs
          activeKey={tabKey}
          onTabSelect={(key) => setTabKey(key as TabKey)}
        >
          <TabPane title="Profile" tabKey="profile">
            {loaders.gettingProfile ? (
              <div className={classes.loadingContainer}>
                <Spinner loader={LOADER.CircleLoader} size="50px" />
              </div>
            ) : profile ? (
              <Profile
                firstName={profileData?.firstName}
                lastName={profileData?.lastName}
                email={profileData?.email}
                publicAddress={profileData?.publicAddress}
                handleValueChange={handleChange}
                onUpdateProfile={onUpdateProfile}
                updateLoading={loaders.updatingProfile}
              />
            ) : error ? (
              <div className={classes.container}>
                <Typography>{error}</Typography>
              </div>
            ) : (
              <div className={classes.container}>
                <Typography>Profile not available</Typography>
              </div>
            )}
          </TabPane>
          <TabPane title="Plan" tabKey="plan">
            <Plan />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
