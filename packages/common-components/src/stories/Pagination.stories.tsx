import React from "react"
import { withKnobs, boolean, number } from "@storybook/addon-knobs"
import { Pagination } from "../Pagination"

export default {
  title: "Pagination",
  component: Pagination,
  decorators: [withKnobs]
}

export const PaginationDemo = (): React.ReactNode => {
  return (
    <Pagination
      showPageNumbers={boolean("Show page numbers", true)}
      pageNo={number("page number", 1)}
      totalPages={number("total pages", 5)}
      isNextDisabled={boolean("next disabled", false)}
      isPreviousDisabled={boolean("previous disabled", false)}
      loadingNext={boolean("next loading", false)}
      loadingPrevious={boolean("previous loading", false)}
    />
  )
}
