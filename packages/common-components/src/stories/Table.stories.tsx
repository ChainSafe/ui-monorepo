import React from "react"
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  AlignOption,
  SortDirection,
} from "../Table"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"

export default {
  title: "Table",
  component: Table,
  decorators: [withKnobs],
}

const alignOptions: AlignOption[] = ["inherit", "center", "left", "right"]
const sortDirectionOptions: SortDirection[] = ["none", "ascend", "descend"]

export const MainDemo = (): React.ReactNode => (
  <Table
    fullWidth={boolean("full width", true)}
    dense={boolean("dense", true)}
    striped={boolean("striped", true)}
    hover={boolean("hover", true)}
  >
    <TableHead>
      <TableHeadCell>Filename</TableHeadCell>
      <TableHeadCell>Modified at</TableHeadCell>
      <TableHeadCell
        align={select("align", alignOptions, "center")}
        sortButtons={boolean("sort buttons", false)}
        onSortChange={action("onSortChange")}
        sortDirection={select("sort direction", sortDirectionOptions, "none")}
      >
        Size
      </TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      <TableRow selected={boolean("selected row 1", false)}>
        <TableCell>movies.mp4</TableCell>
        <TableCell>last minute</TableCell>
        <TableCell>1 GB</TableCell>
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell>texts.txt</TableCell>
        <TableCell>4 hours ago</TableCell>
        <TableCell>1 MB</TableCell>
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell>songs.mp3</TableCell>
        <TableCell>a week back</TableCell>
        <TableCell>1.3 KB</TableCell>
        <TableCell />
      </TableRow>
    </TableBody>
  </Table>
)
