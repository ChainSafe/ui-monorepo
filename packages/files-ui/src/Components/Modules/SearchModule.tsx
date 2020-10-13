import {
  createStyles,
  ITheme,
  makeStyles,
  useOnClickOutside,
} from "@imploy/common-themes"
import React, { ChangeEvent, useRef } from "react"
import { SearchBar } from "@imploy/common-components"
import { useState } from "react"
import clsx from "clsx"

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(({ breakpoints }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("sm")]: {
        cursor: "pointer",
        "& input": {
          opacity: 0,
          width: 50,
        },
        "& svg": {
          height: `${24}px !important`,
        },
      },
      "&.active": {
        [breakpoints.down("sm")]: {
          "& input": {
            opacity: 1,
            width: "100%",
          },
        },
      },
    },
    searchBar: {
      [breakpoints.down("sm")]: {
        height: "100%",
      },
    },
  }),
)

interface ISearchModule {
  className?: string
}

const SearchModule: React.FC<ISearchModule> = ({
  className,
}: ISearchModule) => {
  const classes = useStyles()
  const [, setSeachString] = useState<string>("")
  const [searchActive, setSearchActive] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    if (searchActive) {
      setSearchActive(false)
    }
  })
  return (
    <section
      onClick={() => setSearchActive(true)}
      ref={ref}
      className={clsx(classes.root, className, {
        active: searchActive,
      })}
    >
      <SearchBar
        className={classes.searchBar}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSeachString(e.target.value)
        }
      />
    </section>
  )
}

export default SearchModule
