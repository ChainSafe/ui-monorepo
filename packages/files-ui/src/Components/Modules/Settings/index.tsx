import React, { useState } from "react"
import Profile from "./Profile"
import Plan from "./Plan"
import {
  Tabs,
  TabPane,
  Typography,
  Divider,
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      paddingTop: 40,
      // width: 1000,
      marginLeft: 200,
    },
    headerContainer: {
      marginBottom: 40,
    },
    tabsContainer: {
      marginTop: 40,
    },
  }),
)

type TabKey = "profile" | "plan"

const Settings: React.FC = () => {
  const [tabKey, setTabKey] = useState<TabKey>("profile")
  const classes = useStyles()

  const [web2Inputs, setWeb2Inputs] = useState({
    name: "",
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setWeb2Inputs((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="h1">Settings</Typography>
      </div>
      <Divider />
      <div className={classes.tabsContainer}>
        <Tabs
          activeKey={tabKey}
          onTabSelect={(key) => setTabKey(key as TabKey)}
        >
          <TabPane title="Profile" tabKey="profile">
            <Profile
              name={web2Inputs.name}
              email={web2Inputs.email}
              handleValueChange={handleChange}
            />
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
