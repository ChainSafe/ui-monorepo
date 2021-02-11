import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useOnClickOutside,
  useTheme,
} from "@chainsafe/common-theme"
import React, { ChangeEvent, useRef } from "react"
import {
  ArrowLeftIcon,
  Button,
  SearchBar,
  Typography,
  useHistory,
} from "@chainsafe/common-components"
import { useState } from "react"
import clsx from "clsx"
import { ROUTE_LINKS } from "../FilesRoutes"

const searchResults = {
  files: [
    {
      name: "file1",
    },
    {
      name: "file2",
    },
  ],
  folders: [
    {
      name: "folder1",
    },
    {
      name: "folder2",
    },
  ],
}

const useStyles = makeStyles(
  ({ breakpoints, palette, constants, animation, zIndex, shadows }: ITheme) =>
    createStyles({
      root: {
        position: "relative",
        [breakpoints.down("md")]: {
          display: "flex",
          "& input": {
            opacity: 0,
          },
          "& svg": {
            height: `${24}px !important`,
          },
        },
        "&.active": {
          [breakpoints.down("md")]: {
            "& input": {
              opacity: 1,
              width: "100%",
            },
          },
        },
      },
      searchBar: {
        [breakpoints.down("md")]: {
          height: "100%",
          width: "100%",
        },
      },
      backButton: {
        backgroundColor: "transparent",
        zIndex: zIndex?.layer1,
      },
      backArrow: {
        "& svg": {
          fill: palette.additional["gray"][9],
        },
      },
      resultsContainer: {
        width: "100%",
        opacity: 0,
        position: "absolute",
        overflow: "hidden",
        height: 0,
        transition: `opacity ${animation.transform}ms ease`,
        zIndex: zIndex?.layer3,
        [breakpoints.down("md")]: {
          top: constants.mobileHeaderHeight as number,
        },
        [breakpoints.up("md")]: {
          marginTop: constants.generalUnit,
          boxShadow: shadows.shadow1,
        },
        "&.active": {
          opacity: 1,
          height: "auto",
          [breakpoints.down("md")]: {
            height: `calc(100vh - ${constants.mobileHeaderHeight}px)`,
            "& input": {
              opacity: 1,
              width: `calc(100vw - 45px)`,
            },
          },
        },
      },
      resultsBox: {
        backgroundColor: palette.common.white.main,
        padding: constants.generalUnit * 2,
      },
      resultBackDrop: {
        height: "100%",
        backgroundColor: palette.additional["gray"][9],
        opacity: 0.7,
      },
      resultHead: {
        padding: `${constants.generalUnit * 0.5}px 0`,
      },
      resultRow: {
        padding: `${constants.generalUnit * 0.5}px 0`,
        cursor: "pointer",
      },
    }),
)

interface ISearchModule {
  className?: string
  searchActive: boolean
  setSearchActive(searchActive: boolean): void
}

const SearchModule: React.FC<ISearchModule> = ({
  className,
  searchActive,
  setSearchActive,
}: ISearchModule) => {
  const classes = useStyles()
  const [searchString, setSearchString] = useState<string>("")
  const ref = useRef(null)

  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))
  const { redirect } = useHistory()

  useOnClickOutside(ref, () => {
    if (searchActive) {
      setSearchActive(false)
    }
  })

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    redirect(ROUTE_LINKS.Search(searchString))
  }

  return (
    <section
      onClick={() => {
        if (!searchActive) setSearchActive(true)
      }}
      ref={ref}
      className={clsx(classes.root, className, {
        active: searchActive,
      })}
    >
      {!desktop && searchActive && (
        <Button
          className={classes.backButton}
          onClick={() => {
            setSearchActive(false)
          }}
        >
          <ArrowLeftIcon className={classes.backArrow} />
        </Button>
      )}
      <form className={classes.searchBar} onSubmit={onSearchSubmit}>
        <SearchBar
          className={classes.searchBar}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
        />
      </form>
      <div className={clsx(classes.resultsContainer, searchActive && "active")}>
        <div className={classes.resultsBox}>
          {searchResults.files && searchResults.files.length ? (
            <div>
              <div className={classes.resultHead}>
                <Typography variant="body1" component="p">
                  <strong>Files</strong>
                </Typography>
              </div>
              {searchResults.files.map((file) => (
                <div className={classes.resultRow}>
                  <Typography component="p" variant="body1">
                    {file.name}
                  </Typography>
                </div>
              ))}
            </div>
          ) : null}
          {searchResults.folders && searchResults.folders.length ? (
            <div>
              <div className={classes.resultHead}>
                <Typography variant="body1" component="p">
                  <strong>Folders</strong>
                </Typography>
              </div>
              {searchResults.folders.map((folder) => (
                <div className={classes.resultRow}>
                  <Typography component="p" variant="body1">
                    {folder.name}
                  </Typography>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {!desktop ? (
          <div
            className={classes.resultBackDrop}
            onClick={() => setSearchActive(false)}
          />
        ) : null}
      </div>
    </section>
  )
}

export default SearchModule
