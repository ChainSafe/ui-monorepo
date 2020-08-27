import React from "react"
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "../Table"
import { withKnobs, select } from "@storybook/addon-knobs"

export default {
  title: "Table",
  component: Table,
  decorators: [withKnobs],
}

const tablePaddingOptions = [true, false]

export const MainDemo = (): React.ReactNode => (
  <Table fullWidth dense={select("dense", tablePaddingOptions, false)}>
    <TableHead>
      <TableHeadCell>Filename</TableHeadCell>
      <TableHeadCell>Modified at</TableHeadCell>
      <TableHeadCell>Size</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      <TableRow>
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
