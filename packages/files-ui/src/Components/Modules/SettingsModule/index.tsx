import React, { useState, useEffect } from "react"
import ProfileView from "./tabs/ProfileView"
import PlanView from "./tabs/PlanView"
import {
  Tabs,
  TabPane,
  Typography,
  Divider,
  Breadcrumb,
  Crumb,
  useHistory,
  useToaster,
  useRouteMatch,
  useParams,
} from "@imploy/common-components"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"
import { useUser } from "@imploy/common-contexts"
import { ROUTE_LINKS } from "../../FilesRoutes"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    title: {
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit,
      },
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

export enum TabKey {
  Profile = "profile",
  Plan = "plan",
  _routeParam = ":tab",
}

const SettingsModule: React.FC = () => {
  const classes = useStyles()
  const { profile, updateProfile } = useUser()
  const [updatingProfile, setUpdateLoading] = useState(false)
  const { redirect } = useHistory()
  const { addToastMessage } = useToaster()

  const [profileData, setProfileData] = useState(profile)

  const { tab } = useParams<{
    tab: string
  }>()

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

  const { history } = useHistory()

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
          activeKey={tab}
          onTabSelect={(key) =>
            history.push(ROUTE_LINKS.Settings(key as TabKey))
          }
        >
          <TabPane title="Profile" tabKey={TabKey.Profile}>
            {profileData ? (
              <ProfileView
                profile={profileData}
                handleValueChange={handleChange}
                onUpdateProfile={onUpdateProfile}
                updatingProfile={updatingProfile}
              />
            ) : null}
          </TabPane>
          <TabPane title="Plan" tabKey={TabKey.Plan}>
            <PlanView />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingsModule
