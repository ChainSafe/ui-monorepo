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
    title: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${theme.constants.generalUnit}px 0`,
      },
    },
    divider: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${theme.constants.generalUnit}px 0`,
      },
    },
    container: {
      marginTop: theme.constants.generalUnit * 2,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.constants.generalUnit * 3,
    },
    headerContainer: {
      marginBottom: theme.constants.generalUnit * 4,
      [theme.breakpoints.down("sm")]: {
        padding: `0 ${theme.constants.generalUnit * 2}px`,
        marginTop: theme.constants.generalUnit * 4,
        marginBottom: theme.constants.generalUnit * 2,
      },
    },
    tabsContainer: {
      marginTop: theme.constants.generalUnit * 4,
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.constants.generalUnit * 2,
        padding: `0 ${theme.constants.generalUnit * 2}px`,
      },
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
    if (profile) {
      setProfileData({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        publicAddress: profile?.publicAddress,
      })
    }
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
        <Typography variant="h1" component="p" className={classes.title}>
          Settings
        </Typography>
      </div>
      <Divider />
      <div className={classes.tabsContainer}>
        <Tabs
          activeKey={tabKey}
          onTabSelect={(key) => setTabKey(key as TabKey)}
        >
          <TabPane title="Profile" tabKey="profileView">
            {profileData ? (
              <Profile
                profile={profileData}
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
