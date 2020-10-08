import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React, { ChangeEvent } from "react"
import { SearchBar } from "@imploy/common-components"
import { useState } from "react"

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {},
  }),
)

const SearchModule: React.FC = () => {
  const classes = useStyles()
  const [, setSeachString] = useState<string>("")
  return (
    <section className={classes.root}>
      <SearchBar
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSeachString(e.target.value)
        }
      />
    </section>
  )
}

export default SearchModule
