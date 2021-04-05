import React, { useState, useEffect } from "react"
import Profile from "./Profile"
// import Plan from "./Plan"
import {
  Tabs,
  TabPane,
  Typography,
  Divider,
  Breadcrumb,
  Crumb,
  useHistory,
  useToaster,
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { useUser } from "@chainsafe/common-contexts"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, breakpoints }: ITheme) =>
  createStyles({
    title: {
      marginTop: constants.generalUnit,
      [breakpoints.down("md")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${constants.generalUnit}px 0`,
      },
    },
    divider: {
      [breakpoints.down("md")]: {
        fontSize: 20,
        lineHeight: "28px",
        margin: `${constants.generalUnit}px 0`,
      },
    },
    container: {
      marginTop: constants.generalUnit * 2,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: constants.generalUnit * 3,
    },
    headerContainer: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`,
        marginTop: constants.generalUnit * 4,
        marginBottom: constants.generalUnit * 2,
      },
    },
    tabsContainer: {
      marginTop: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit * 2,
        padding: `0 ${constants.generalUnit * 2}px`,
      },
    },
  }),
)

type TabKey = "profileView" | "planView"

const Settings: React.FC = () => {
  const [tabKey, setTabKey] = useState<TabKey>("profileView")
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
      setUpdatingProfile(true)
      await updateProfile(firstName, lastName, email)
      addToastMessage({
        message: "Profile updated",
      })
      setUpdatingProfile(false)
    } catch (error) {
      addToastMessage({
        message: error,
        appearance: "error",
      })
      setUpdatingProfile(false)
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
          <Trans>Settings</Trans>
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
          {/* <TabPane title="Plan" tabKey="planView">
            {/* <Plan />
          </TabPane> */}
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
