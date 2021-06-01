import React, { useCallback, useMemo } from "react"
import Profile from "./Profile"
import { Tabs,
  TabPane as TabPaneOrigin,
  Typography, Divider,
  Breadcrumb,
  Crumb,
  useParams,
  useHistory,
  ITabPaneProps,
  CaretRightIcon,
  LockIcon
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { ROUTE_LINKS, SettingsPath, SETTINGS_BASE } from "../../FilesRoutes"
import { t, Trans } from "@lingui/macro"
// import Plan from "./Plan"
import { ProfileIcon } from "@chainsafe/common-components"
import clsx from "clsx"
import Security from "./Security"

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
        borderRadius: 0,
        marginTop: 0
      }
    },
    tabPane: {
      flex: 1,
      padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 4}px`,
      "&.securityPane": {
        [breakpoints.down("lg")]: {
          paddingLeft: constants.generalUnit,
          paddingRight: constants.generalUnit
        }
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px`
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px 0`
      }
    },
    lockIcon : {
      width: "1rem",
      marginRight: "0.5rem"
    },
    hideTabPane: {
      display: "none"
    },
    injectedTabRoot: {
      display: "flex"
    },
    injectedTabList: {
      padding: 0,
      marginBottom: 0,
      display: "flex",
      flexDirection: "column",
      width: 226,
      borderRightColor: palette.additional["gray"][4],
      borderRightWidth: 1,
      borderRightStyle: "solid",

      "&.wide" : {
        width: "100%",
        borderRightStyle: "none"
      },

      "&.hidden": {
        display: "none"
      }
    },
    injectedTabBar: {
      padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`,
      marginRight: 0,
      display: "flex",
      borderBottom: "none",

      "& .iconRight": {
        flex: 1,
        textAlign: "right"
      },

      "&.selected": {
        borderBottom: "none",
        fontWeight: "normal",
        backgroundColor: palette.additional["gray"][4],
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
      }
    }
  })
)

const Settings: React.FC = () => {
  const { desktop } = useThemeSwitcher()
  const { path = desktop ? "profile" : "" } = useParams<{path: SettingsPath}>()
  const classes = useStyles()
  const { redirect } = useHistory()


  const onSelectTab = useCallback(
    (key: string) => redirect(`${SETTINGS_BASE}/${key}`)
    , [redirect])

  const crumbs: Crumb[] = useMemo(() => [
    {
      text: t`Settings`
    }
  ], [])

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Breadcrumb
          crumbs={crumbs}
          homeOnClick={() => redirect(ROUTE_LINKS.Drive(""))}
        />
        <Typography
          variant="h1"
          component="p"
          className={classes.title}
        >
          <Trans>Settings</Trans>
        </Typography>
      </div>
      {desktop && <Divider />}
      {
        <div className={classes.tabsContainer}>
          <Tabs
            activeKey={path}
            onTabSelect={onSelectTab}
            injectedClass={{
              root: classes.injectedTabRoot,
              tabBar: classes.injectedTabBar,
              tabList: clsx(
                !desktop
                  ? !path
                    ? "wide"
                    : "hidden"
                  : "",
                classes.injectedTabList)
            }}
          >
            <TabPane
              className={clsx(classes.tabPane, (!desktop && !path) ? classes.hideTabPane : "")}
              icon={<ProfileIcon/>}
              iconRight={<CaretRightIcon/>}
              title={t`Profile and Display`}
              tabKey="profile"
              testId="profile-tab"
            >
              <Profile />
            </TabPane>
            <TabPane
              className={clsx(classes.tabPane, "securityPane", (!desktop && !path) ? classes.hideTabPane : "")}
              icon={<LockIcon className={classes.lockIcon}/>}
              iconRight={<CaretRightIcon/>}
              title={t`Security`}
              tabKey="security"
              testId="security-tab"
            >
              <Security />
            </TabPane>
            {/* <TabPane title={t`Plan`} tabKey="plan">
              <Plan />
            </TabPane> */}
          </Tabs>
        </div>
      }
    </div>
  )
}

export default Settings
