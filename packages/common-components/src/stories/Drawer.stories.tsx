import React from "react"
import { Drawer } from "../Drawer"
import { withKnobs, select, number, boolean } from "@storybook/addon-knobs"

export default {
  title: "Drawer",
  component: Drawer,
  decorators: [withKnobs]
}

export const DrawerDemo = (): React.ReactNode => {
  const [open, setOpen] = React.useState(false)

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <button onClick={() => setOpen(!open)}>drawer</button>
      </div>
      <Drawer
        position={select(
          "position",
          ["left", "top", "right", "bottom"],
          "right"
        )}
        open={open}
        size={number("size", 250)}
        backdrop={boolean("backdrop", true)}
        onClose={() => setOpen(false)}
      >
        <div style={{ padding: 16 }}>
          <h2>Drawer Child</h2>
          <p>Demo data</p>
          <p>Demo data</p>
          <p>Demo data</p>
          <button onClick={() => setOpen(!open)}>close</button>
        </div>
      </Drawer>
    </div>
  )
}
