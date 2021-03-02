import { createTheme } from "@chainsafe/common-theme"
import { UI_COLORS, UI_CONSTANTS } from "./Constants"

export const lightTheme = createTheme({
  themeConfig: {
    palette: {
      primary: {
        main: "var(--gray9)",
        hover: "var(--gray1)",
      },
      secondary: {
        main: "var(--gray1)",
        hover: "var(--gray10)",
      },
    },
    constants: {
      ...UI_CONSTANTS,
      ...({
        landing: {
          logoText: "var(--gray1)"
        },
        modalDefault: {
          fadebackground: "var(--gray10)",
          background: "var(--gray10)",
        },
        header: {
          rootBackground: "var(--gray1)",
          optionsBackground: "var(--gray1)",
          optionsTextColor: "initial",
          optionsBorder: "initial",
          menuItemTextColor: "var(--gray8)",
          iconColor: "initial",
          hamburger: "var(--gray10)"
        },
        nav: {
          backgroundColor: "var(--gray3)",
          blocker: "var(--gray1)",
          mobileBackgroundColor: "var(--gray3)",
          headingColor: "initial",
          itemColor: "initial",
          itemColorHover: "initial",
          itemIconColor: "var(--gray8)",
          itemIconColorHover: "initial",
        },
        createFolder: {
          backgroundColor: "var(--gray10)",
          color: "var(--gray1)"
        },
        previewModal: {
          controlsBackground: "var(--gray9)",
          controlsColor: "var(--gray8)",
          closeButtonColor: "var(--gray2)",
          fileOpsColor: "var(--gray2)",
          fileNameColor: "var(--gray1)",
          optionsBackground: "initial",
          optionsTextColor: "initial",
          optionsBorder: "initial",
          menuItemIconColor: "var(--gray7)",
          menuItemTextColor: "var(--gray8)",
        },
        searchModule:{
          resultsBackground: "var(--gray1)",
          resultsBackdrop: "var(--gray9)",
          resultsHeading: "var(--gray8)",
          resultsFolder: "var(--gray8)",
          resultsRow: "var(--gray8)",
          noResults: "var(--gray7)"
        },
        uploadModal: {
          background: "var(--gray1)",
          color: "var(--gray1)",
          icon: "var(--gray10)",
          iconHover: "var(--gray10)"
        },
        fileInfoModal: {
          background: "initial",
          color: "initial",
          copyButtonBackground: "var(--gray1)",
          copyButtonColor: "var(--gray10)",
          infoContainerBorderTop: "var(--gray5)"
        },
        moveFileModal: {
          background: "var(--gray10)",
          color: "var(--gray1)"
        },
        filesTable: {
          color: ""
        },
        fileSystemItemRow: {
          icon: "var(--gray8)",
          menuIcon: "var(--gray7)",
          dropdownIcon: "initial",
          optionsBackground: "initial",
          optionsColor: "initial",
          optionsBorder: "initial",
          itemBackground: "initial",
          itemColor: "initial"
        },
        masterkey: {
          desktop: {
            color: "var(--gray10)",
            link: "var(--gray10)",
            checkbox: "var(--gray1)"
          },
          mobile: {
            color: "var(--gray1)",
            link: "var(--gray1)",
            checkbox: "var(--gray9)"
          }
        },
        profile: {
          icon: "initial"
        },
        uploadAlert: {
          icon: "initial"
        }
      } as UI_COLORS)
    },
    overrides: {
      Typography: {
        h5: {
          fontWeight: 600,
          color: "var(--gray10)",
        },
      },
      Button: {
        variants: {
          primary: {
            active: {
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
            hover: {
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
            focus: {
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
          },
        },
      },
    },
  },
})
