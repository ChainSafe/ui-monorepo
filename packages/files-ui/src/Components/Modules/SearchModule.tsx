import {
  createStyles,
  debounce,
  makeStyles,
  useOnClickOutside,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import React, { ChangeEvent, useCallback, useRef } from "react"
import {
  ArrowLeftIcon,
  Button,
  SearchBar,
  Typography,
  useHistory
} from "@chainsafe/common-components"
import { useState } from "react"
import clsx from "clsx"
import { ROUTE_LINKS } from "../FilesRoutes"
import { useDrive, SearchEntry } from "../../Contexts/DriveContext"
import { CONTENT_TYPES } from "../../Utils/Constants"
import { getParentPathFromFilePath } from "../../Utils/pathUtils"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../Themes/types"

const useStyles = makeStyles(
  ({ breakpoints, palette, constants, animation, zIndex, shadows }: CSFTheme) =>
    createStyles({
      root: {
        position: "relative",
        [breakpoints.down("md")]: {
          display: "flex",
          "& input": {
            opacity: 0
          },
          "& svg": {
            height: `${24}px !important`
          }
        },
        "&.active": {
          [breakpoints.down("md")]: {
            "& input": {
              opacity: 1,
              width: "100%"
            }
          }
        }
      },
      searchBar: {
        [breakpoints.down("md")]: {
          height: "100%",
          width: "100%"
        }
      },
      backButton: {
        backgroundColor: "transparent",
        zIndex: zIndex?.layer1
      },
      backArrow: {
        "& svg": {
          fill: palette.additional["gray"][9]
        }
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
          top: Number(constants.mobileHeaderHeight)
        },
        [breakpoints.up("md")]: {
          marginTop: constants.generalUnit,
          boxShadow: shadows.shadow1
        },
        "&.active": {
          opacity: 1,
          height: "auto",
          [breakpoints.down("md")]: {
            height: `calc(100vh - ${constants.mobileHeaderHeight}px)`,
            "& input": {
              opacity: 1,
              width: "calc(100vw - 45px)"
            }
          }
        }
      },
      resultsBox: {
        backgroundColor:constants.searchModule.resultsBackground,
        padding: constants.generalUnit * 1
      },
      resultBackDrop: {
        height: "100%",
        backgroundColor: constants.searchModule.resultsBackdrop,
        opacity: 0.7
      },
      resultHead: {
        padding: `${constants.generalUnit * 0.5}px ${
          constants.generalUnit * 1
        }px`,
        color:constants.searchModule.resultsHeading
      },
      resultHeadFolder: {
        marginTop: constants.generalUnit * 0.5,
        padding: `${constants.generalUnit * 0.5}px  ${
          constants.generalUnit * 1
        }px`,
        color: constants.searchModule.resultsFolder
      },
      boldFont: {
        fontWeight: 700
      },
      resultRow: {
        padding: `${constants.generalUnit * 0.75}px  ${
          constants.generalUnit * 1
        }px`,
        cursor: "pointer",
        color:constants.searchModule.resultsRow,
        "&:hover": {
          backgroundColor: palette.additional["gray"][4]
        }
      },
      noResultsFound: {
        margin: `${constants.generalUnit}px 0`,
        color: constants.searchModule.noResults,
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      }
    })
)

interface ISearchModule {
  className?: string
  searchActive: boolean
  setSearchActive(searchActive: boolean): void
}

const SearchModule: React.FC<ISearchModule> = ({
  className,
  searchActive,
  setSearchActive
}: ISearchModule) => {
  const { themeKey, desktop } = useThemeSwitcher()
  const classes = useStyles({
    themeKey
  })

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{results: SearchEntry[]; query: string} | undefined>(undefined)
  const ref = useRef(null)
  const { getSearchResults, currentSearchBucket } = useDrive()

  const { redirect } = useHistory()

  const onSearch = async (searchString: string) => {
    try {
      const results = await getSearchResults(searchString)
      setSearchResults({ results, query: searchString })
    } catch (err) {
      //
    }
  }

  // TODO useCallback is maybe not needed here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(onSearch, 400), [
    currentSearchBucket?.bucketId
  ])

  const onSearchChange = (searchString: string) => {
    setSearchQuery(searchString)
    debouncedSearch(searchString)
  }

  useOnClickOutside(ref, () => {
    if (searchActive) {
      setSearchActive(false)
    }
  })

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchActive(false)
    redirect(ROUTE_LINKS.Search(searchQuery))
  }

  const searchResultsFiles = searchResults?.results.filter(
    (searchResult) =>
      searchResult.content.content_type !== CONTENT_TYPES.Directory &&
      searchResult.content.content_type !== CONTENT_TYPES.Drectory2
  )

  const searchResultsFolders = searchResults?.results.filter(
    (searchResult) =>
      searchResult.content.content_type === CONTENT_TYPES.Directory ||
      searchResult.content.content_type === CONTENT_TYPES.Drectory2
  )

  const onSearchEntryClickFolder = (searchEntry: SearchEntry) => {
    redirect(ROUTE_LINKS.Home(searchEntry.path))
    setSearchQuery("")
    setSearchActive(false)
  }

  const onSearchEntryClickFile = (searchEntry: SearchEntry) => {
    redirect(ROUTE_LINKS.Home(getParentPathFromFilePath(searchEntry.path)))
    setSearchQuery("")
    setSearchActive(false)
  }

  return (
    <section
      onClick={() => {
        if (!searchActive) setSearchActive(true)
      }}
      ref={ref}
      className={clsx(classes.root, className, {
        active: searchActive
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
            onSearchChange(e.target.value)
          }
          placeholder={t`Search...`}
        />
      </form>
      {searchQuery && searchResults ? (
        <div
          className={clsx(classes.resultsContainer, searchActive && "active")}
        >
          <div className={classes.resultsBox}>
            {searchResults?.query && !searchResults.results.length ? (
              <Typography className={classes.noResultsFound}>
                <Trans>No search results for {searchResults.query}</Trans>
              </Typography>
            ) : null}
            {searchResultsFiles && searchResultsFiles.length ? (
              <div>
                <div className={classes.resultHead}>
                  <Typography
                    variant="body1"
                    component="p"
                    className={classes.boldFont}
                  >
                    <Trans>Files</Trans>
                  </Typography>
                </div>
                {searchResultsFiles.map((searchResult, i) => (
                  <div
                    key={i}
                    className={classes.resultRow}
                    onClick={() => onSearchEntryClickFile(searchResult)}
                  >
                    <Typography component="p" variant="body1">
                      {searchResult.content.name}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : null}
            {searchResultsFolders && searchResultsFolders.length ? (
              <div>
                <div className={classes.resultHeadFolder}>
                  <Typography
                    variant="body1"
                    component="p"
                    className={classes.boldFont}
                  >
                    <Trans>Folders</Trans>
                  </Typography>
                </div>
                {searchResultsFolders.map((searchResult, i) => (
                  <div
                    key={i}
                    className={classes.resultRow}
                    onClick={() => onSearchEntryClickFolder(searchResult)}
                  >
                    <Typography component="p" variant="body1">
                      {searchResult.content.name}
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
      ) : null}
    </section>
  )
}

export default SearchModule
