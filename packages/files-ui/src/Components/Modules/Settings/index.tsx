import React, { useCallback } from "react"
import ProfileTab from "./ProfileTab"
import {
  Tabs,
  TabPane as TabPaneOrigin,
  Typography,
  Divider,
  useParams,
  useHistory,
  ITabPaneProps,
  CaretRightIcon,
  LockIcon,
  UserIcon,
  CaretLeftIcon
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { ROUTE_LINKS, SettingsPath } from "../../FilesRoutes"
import { t, Trans } from "@lingui/macro"
import SubscriptionTab from "./SubscriptionTab"
import { ProfileIcon, SubscriptionPlanIcon } from "@chainsafe/common-components"
import clsx from "clsx"
import SecurityTab from "./SecurityTab"
import DisplayTab from "./DisplayTab"
import { useBilling } from "../../../Contexts/BillingContext"

const TabPane = (props: ITabPaneProps<SettingsPath>) => TabPaneOrigin(props)
const useStyles = makeStyles(({ constants, breakpoints, palette }: ITheme) =>
  createStyles({
    title: {
      marginTop: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        fontSize: 18,
        lineHeight: "22px",
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
      display: "flex",
      alignItems: "center",
      marginBottom: constants.generalUnit * 4,
      width: "fit-content",
      [breakpoints.down("md")]: {
        cursor: "pointer",
        padding: `0 ${constants.generalUnit * 2}px`,
        marginTop: constants.generalUnit * 4,
        marginBottom: constants.generalUnit * 2
      },
      "& svg": {
        fill: palette.additional["gray"][9]
      }
    },
    caretLeft: {
      marginTop: "2px"
    },
    tabsContainer: {
      borderRadius: 10,
      backgroundColor: palette.additional["gray"][3],
      marginTop: constants.generalUnit * 2,
      [breakpoints.down("md")]: {
        borderRadius: 0,
        marginTop: 0
      }
    },
    tabPane: {
      flex: 1,
      padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`,
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px 0`
      }
    },
    lockIcon : {
      width: "1rem",
      marginRight: "0.5rem",
      "& svg": {
        fill: palette.additional["gray"][9]
      }
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
        backgroundColor: palette.additional["gray"][4],
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
      }
    },
    profileIcon : {
      "& path": {
        stroke: palette.additional["gray"][9]
      }
    }
  })
)

const Settings: React.FC = () => {
  const { desktop } = useThemeSwitcher()
  const { path = desktop ? "profile" : undefined } = useParams<{path: SettingsPath}>()
  const classes = useStyles()
  const { redirect, history } = useHistory()
  const { isBillingEnabled } = useBilling()

  const onSelectTab = useCallback(
    (key: SettingsPath) => redirect(ROUTE_LINKS.SettingsPath(key))
    , [redirect])

  return (
    <div className={classes.container}>
      <div
        className={classes.headerContainer}
        onClick={() => !desktop && !!path && history.push(ROUTE_LINKS.SettingsDefault)}
      >
        {!desktop && !!path && <CaretLeftIcon className={classes.caretLeft} />}
        <Typography
          variant="h1"
          component="p"
          className={classes.title}
          data-cy="title-label-settings"
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
              icon={<UserIcon className={classes.lockIcon}/>}
              iconRight={<CaretRightIcon/>}
              title={t`Profile`}
              tabKey="profile"
              testId="tab-profile"
            >
              <ProfileTab />
            </TabPane>
            <TabPane
              className={clsx(classes.tabPane, (!desktop && !path) ? classes.hideTabPane : "")}
              title={t`Display`}
              tabKey="display"
              testId="tab-display"
              icon={<ProfileIcon className={classes.profileIcon} />}
              iconRight={<CaretRightIcon />}
            >
              <DisplayTab />
            </TabPane>
            <TabPane
              className={clsx(classes.tabPane, (!desktop && !path) ? classes.hideTabPane : "")}
              icon={<LockIcon className={classes.lockIcon}/>}
              iconRight={<CaretRightIcon/>}
              title={t`Security`}
              tabKey="security"
              testId="tab-security"
            >
              <SecurityTab />
            </TabPane>
            {isBillingEnabled
              ? <TabPane
                className={clsx(classes.tabPane, (!desktop && !path) ? classes.hideTabPane : "")}
                title={t`Subscription Plan`}
                tabKey="plan"
                testId="tab-subscription"
                icon={<SubscriptionPlanIcon className={classes.lockIcon} />}
                iconRight={<CaretRightIcon/>}
              >
                <SubscriptionTab />
              </TabPane>
              : null}
          </Tabs>
        </div>
      }
    </div>
  )
}

export default Settings
