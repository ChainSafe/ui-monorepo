import React, { useState, useEffect } from "react"
import Profile from "./Profile"
import Plan from "./Plan"
import {
  Tabs,
  TabPane,
  Typography,
  Divider,
  Breadcrumb,
  Crumb,
  useHistory,
  useToaster,
} from "@imploy/common-components"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"
import { useUser } from "@imploy/common-contexts"
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
  const { profile, updateProfile } = useUser()
  const [updatingProfile, setUpdateLoading] = useState(false)
  const { redirect } = useHistory()
  const { addToastMessage } = useToaster()

  const [profileData, setProfileData] = useState(profile)

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

  const onUpdateProfile = async (
    firstName: string,
    lastName: string,
    email: string,
  ) => {
    try {
      setUpdateLoading(true)
      await updateProfile(firstName, lastName, email)
      setUpdateLoading(false)
      addToastMessage({
        message: "Profile updated",
      })
    } catch (error) {
      addToastMessage({
        message: error,
        appearance: "error",
      })
      setUpdateLoading(false)
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
                updatingProfile={updatingProfile}
              />
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
