import { createTheme } from "@chainsafe/common-theme"
import { CsfColors, UI_CONSTANTS } from "./Constants"

export const darkTheme = createTheme<CsfColors>({
  globalStyling: {
    ":root": {
      "--blue1": "#111D2C",
      "--blue2": "#112A45",
      "--blue3": "#15395B",
      "--blue4": "#164C7E",
      "--blue5": "#1765AD",
      "--blue6": "#177DDC",
      "--blue7": "#3C9AE8",
      "--blue8": "#65B7F3",
      "--blue9": "#8DCFF8",
      "--blue10": "#B7E3FA",

      "--gray1": "#141414",
      "--gray2": "#1D1D1D",
      "--gray3": "#262626",
      "--gray4": "#303030",
      "--gray5": "#434343",
      "--gray6": "#5A5A5A",
      "--gray7": "#7D7D7D",
      "--gray8": "#ACACAC",
      "--gray9": "#DBDBDB",
      "--gray10": "#FFFFFF",

      "--red1": "#2A1215",
      "--red2": "#431418",
      "--red3": "#58181C",
      "--red4": "#791A1F",
      "--red5": "#A61D24",
      "--red6": "#D32029",
      "--red7": "#E84749",
      "--red8": "#F37370",
      "--red9": "#F89F9A",
      "--red10": "#FAC8C3",

      "--volcano1": "#2B1611",
      "--volcano2": "#441D12",
      "--volcano3": "#592716",
      "--volcano4": "#7C3118",
      "--volcano5": "#AA3E19",
      "--volcano6": "#D84A1B",
      "--volcano7": "#E87040",
      "--volcano8": "#F3956A",
      "--volcano9": "#F8B692",
      "--volcano10": "#FAD4BC",

      "--orange1": "#2B1D11",
      "--orange2": "#442A11",
      "--orange3": "#593815",
      "--orange4": "#7C4A15",
      "--orange5": "#AA6215",
      "--orange6": "#D87A16",
      "--orange7": "#E89A3C",
      "--orange8": "#F3B765",
      "--orange9": "#F8CF8D",
      "--orange10": "#FAE3B7",

      "--gold1": "#2B2111",
      "--gold2": "#443111",
      "--gold3": "#594214",
      "--gold4": "#7C5914",
      "--gold5": "#AA7714",
      "--gold6": "#D89614",
      "--gold7": "#E8B339",
      "--gold8": "#F3CC62",
      "--gold9": "#F8DF8B",
      "--gold10": "#FAEDB5",

      "--yellow1": "#2B2611",
      "--yellow2": "#443B11",
      "--yellow3": "#595014",
      "--yellow4": "#595014",
      "--yellow5": "#AA9514",
      "--yellow6": "#D8BD14",
      "--yellow7": "#E8D639",
      "--yellow8": "#F3EA62",
      "--yellow9": "#F8F48B",
      "--yellow10": "#FAFAB5",

      "--lime1": "#1F2611",
      "--lime2": "#2E3C10",
      "--lime3": "#3E4F13",
      "--lime4": "#536D13",
      "--lime5": "#6F9412",
      "--lime6": "#8BBB11",
      "--lime7": "#A9D134",
      "--lime8": "#C9E75D",
      "--lime9": "#E4F88B",
      "--lime10": "#F0FAB5",

      "--green1": "#162312",
      "--green2": "#1D3712",
      "--green3": "#274916",
      "--green4": "#306317",
      "--green5": "#3C8618",
      "--green6": "#49AA19",
      "--green7": "#6ABE39",
      "--green8": "#8FD460",
      "--green9": "#B2E58B",
      "--green10": "#D5F2BB",

      "--cyan1": "#112123",
      "--cyan2": "#113536",
      "--cyan3": "#144848",
      "--cyan4": "#146262",
      "--cyan5": "#138585",
      "--cyan6": "#13A8A8",
      "--cyan7": "#33BCB7",
      "--cyan8": "#58D1C9",
      "--cyan9": "#84E2D8",
      "--cyan10": "#B2F1E8",

      "--geekblue1": "#131629",
      "--geekblue2": "#161D40",
      "--geekblue3": "#1C2755",
      "--geekblue4": "#203175",
      "--geekblue5": "#263EA0",
      "--geekblue6": "#2B4ACB",
      "--geekblue7": "#5273E0",
      "--geekblue8": "#7F9EF3",
      "--geekblue9": "#A8C1F8",
      "--geekblue10": "#D2E0FA",

      "--purple1": "#1A1325",
      "--purple2": "#24163A",
      "--purple3": "#301C4D",
      "--purple4": "#3E2069",
      "--purple5": "#51258F",
      "--purple6": "#642AB5",
      "--purple7": "#854ECA",
      "--purple8": "#AB7AE0",
      "--purple9": "#CDA8F0",
      "--purple10": "#EBD7FA",

      "--magenta1": "#291321",
      "--magenta2": "#40162F",
      "--magenta3": "#551C3B",
      "--magenta4": "#75204F",
      "--magenta5": "#A02669",
      "--magenta6": "#CB2B83",
      "--magenta7": "#E0529C",
      "--magenta8": "#F37FB7",
      "--magenta9": "#F8A8CC",
      "--magenta10": "#FAD2E3",
    },
    body: {
      backgroundColor: "var(--gray1)",
      color: "var(--gray9)",
    },
  },
  themeConfig: {
    palette: {
      primary: {
        main: "var(--gray3)",
        hover: "var(--gray10)",
      },
      secondary: {
        main: "var(--gray10)",
        hover: "#000",
      },
      common: {
        black: {
          main: "var(--gray1)"
        }
      },  
      additional: {
        blue: {
          1: "var(--blue1)",
          2: "var(--blue2)",
          3: "var(--blue3)",
          4: "var(--blue4)",
          5: "var(--blue5)",
          6: "var(--blue6)",
          7: "var(--blue7)",
          8: "var(--blue8)",
          9: "var(--blue9)",
          10: "var(--blue10)",
        },
        gray: {
          1: "var(--gray1)",
          2: "var(--gray2)",
          3: "var(--gray3)",
          4: "var(--gray4)",
          5: "var(--gray5)",
          6: "var(--gray6)",
          7: "var(--gray7)",
          8: "var(--gray8)",
          9: "var(--gray9)",
          10: "var(--gray10)",
        },
        red: {
          1: "var(--red1)",
          2: "var(--red2)",
          3: "var(--red3)",
          4: "var(--red4)",
          5: "var(--red5)",
          6: "var(--red6)",
          7: "var(--red7)",
          8: "var(--red8)",
          9: "var(--red9)",
          10: "var(--red10)",
        },
        volcano: {
          1: "var(--volcano1)",
          2: "var(--volcano2)",
          3: "var(--volcano3)",
          4: "var(--volcano4)",
          5: "var(--volcano5)",
          6: "var(--volcano6)",
          7: "var(--volcano7)",
          8: "var(--volcano8)",
          9: "var(--volcano9)",
          10: "var(--volcano10)",
        },
        orange: {
          1: "var(--orange1)",
          2: "var(--orange2)",
          3: "var(--orange3)",
          4: "var(--orange4)",
          5: "var(--orange5)",
          6: "var(--orange6)",
          7: "var(--orange7)",
          8: "var(--orange8)",
          9: "var(--orange9)",
          10: "var(--orange10)",
        },
        gold: {
          1: "var(--gold1)",
          2: "var(--gold2)",
          3: "var(--gold3)",
          4: "var(--gold4)",
          5: "var(--gold5)",
          6: "var(--gold6)",
          7: "var(--gold7)",
          8: "var(--gold8)",
          9: "var(--gold9)",
          10: "var(--gold10)",
        },
        yellow: {
          1: "var(--yellow1)",
          2: "var(--yellow2)",
          3: "var(--yellow3)",
          4: "var(--yellow4)",
          5: "var(--yellow5)",
          6: "var(--yellow6)",
          7: "var(--yellow7)",
          8: "var(--yellow8)",
          9: "var(--yellow9)",
          10: "var(--yellow10)",
        },
        lime: {
          1: "var(--lime1)",
          2: "var(--lime2)",
          3: "var(--lime3)",
          4: "var(--lime4)",
          5: "var(--lime5)",
          6: "var(--lime6)",
          7: "var(--lime7)",
          8: "var(--lime8)",
          9: "var(--lime9)",
          10: "var(--lime10)",
        },
        green: {
          1: "var(--green1)",
          2: "var(--green2)",
          3: "var(--green3)",
          4: "var(--green4)",
          5: "var(--green5)",
          6: "var(--green6)",
          7: "var(--green7)",
          8: "var(--green8)",
          9: "var(--green9)",
          10: "var(--green10)",
        },
        cyan: {
          1: "var(--cyan1)",
          2: "var(--cyan2)",
          3: "var(--cyan3)",
          4: "var(--cyan4)",
          5: "var(--cyan5)",
          6: "var(--cyan6)",
          7: "var(--cyan7)",
          8: "var(--cyan8)",
          9: "var(--cyan9)",
          10: "var(--cyan10)",
        },
        geekblue: {
          1: "var(--geekblue1)",
          2: "var(--geekblue2)",
          3: "var(--geekblue3)",
          4: "var(--geekblue4)",
          5: "var(--geekblue5)",
          6: "var(--geekblue6)",
          7: "var(--geekblue7)",
          8: "var(--geekblue8)",
          9: "var(--geekblue9)",
          10: "var(--geekblue10)",
        },
        purple: {
          1: "var(--purple1)",
          2: "var(--purple2)",
          3: "var(--purple3)",
          4: "var(--purple4)",
          5: "var(--purple5)",
          6: "var(--purple6)",
          7: "var(--purple7)",
          8: "var(--purple8)",
          9: "var(--purple9)",
          10: "var(--purple10)",
        },
        magenta: {
          1: "var(--magenta1)",
          2: "var(--magenta2)",
          3: "var(--magenta3)",
          4: "var(--magenta4)",
          5: "var(--magenta5)",
          6: "var(--magenta6)",
          7: "var(--magenta7)",
          8: "var(--magenta8)",
          9: "var(--magenta9)",
          10: "var(--magenta10)",
        },
      },
    },
    constants: {
      ...UI_CONSTANTS,
      ...({
        landing: {
          logoText: "var(--gray10)"
        },
        modalDefault: {
          fadebackground: "var(--gray2)",
          background: "var(--gray2)",
        },
        header: {
          rootBackground: "var(--gray1)" ,
          optionsBackground: "var(--gray2)",
          optionsTextColor: "var(--gray5)",
          optionsBorder: "var(--gray5)",
          menuItemTextColor: "var(--gray10)",
          iconColor: "var(--gray7)",
          hamburger: "var(--gray10)"
        },
        nav: {
          backgroundColor: "var(--gray1)",
          blocker: "var(--gray1)",
          mobileBackgroundColor: "var(--gray1)",
          headingColor: "var(--gray8)",
          itemColor: "var(--gray7)",
          itemColorHover: "var(--gray9)",
          itemIconColor: "var(--gray7)",
          itemIconColorHover: "var(--gray9)",
        },
        createFolder: {
          backgroundColor: "var(--gray2)",
          color: "var(--gray9)"
        },
        previewModal: {
          controlsBackground: "var(--gray1)",
          controlsColor: "var(--gray10)",
          closeButtonColor: "var(--gray9)",
          fileOpsColor: "var(--gray9)",
          fileNameColor: "var(--gray9)",
          optionsBackground: "var(--gray2)",
          optionsTextColor: "var(--gray9)",
          optionsBorder: "var(--gray5)",
          menuItemIconColor: "var(--gray9)",
          menuItemTextColor: "var(--gray10)",
          message: "var(--gray8)",
        },
        searchModule: {
          resultsBackground: "var(--gray2)",
          resultsBackdrop: "var(--gray2)",
          resultsHeading: "var(--gray9)",
          resultsFolder: "var(--gray9)",
          resultsRow: "var(--gray9)",
          noResults: "var(--gray9)"
        },
        uploadModal: {
          background: "var(--gray2)",
          color: "var(--gray9)",
          icon: "var(--gray9)",
          iconHover: "var(--gray9)",
          addMore: "var(--gray9)",
          addMoreBackground: "var(--gray4)",
          footerBackground: "var(--gray2)"
        },
        fileInfoModal: {
          background: "var(--gray2)",
          color: "var(--gray9)",
          copyButtonBackground: "var(--gray1)",
          copyButtonColor: "var(--gray8)",
          infoContainerBorderTop: "var(--gray4)"
        },
        moveFileModal: {
          background: "var(--gray2)",
          color: "var(--gray9)"
        },
        filesTable: {
          color: "var(--gray7)"
        },
        fileSystemItemRow: {
          icon: "var(--gray9)",
          menuIcon: "var(--gray9)",
          dropdownIcon: "var(--gray9)",
          optionsBackground: "var(--gray2)",
          optionsColor: "var(--gray9)",
          optionsBorder: "var(--gray5)",
          itemBackground: "var(--gray1)",
          itemColor: "var(--gray9)"
        },
        masterkey: {
          desktop: {
            color: "var(--gray9)",
            link: "var(--gray10)",
            checkbox: "var(--gray9)"
          },
          mobile: {
            color: "var(--gray9)",
            link: "var(--gray10)",
            checkbox: "var(--gray9)"
          }
        },
        profile: {
          icon: "var(--gray9)"
        },
        uploadAlert: {
          icon: "var(--gray9)"
        }
      } as CsfColors)
    },
    overrides: {
      SearchBar: {
        input: {
          root: {
            backgroundColor: "var(--gray1)",
            color: "var(--gray9)",
          },
        },
      },
      TextInput: {
        label: {
          color: "var(--gray9)",
        },
        input: {
          root: {
            backgroundColor: "var(--gray1)",
            borderColor: "var(--gray4)",
            color: "var(--gray9)",
          },
        },
      },
      Breadcrumb: {
        home: {
          fill: "var(--gray9)",
        },
      },
      Typography: {
        root: {
          "& a": {
            color: "var(--gray9)",
          },
        },
        h5: {
          fontWeight: 600,
          color: "var(--gray9)",
        },
      },
      Toaster: {
        closeIcon: {
          fill: "var(--gray9)",
        },
        message: {
          color: "var(--gray9)",
        },
        typeIcon: {
          root: {
            fill: "var(--gray9)",
          },
          success: {
            fill: "var(--green8)",
          },
          error: {
            fill: "var(--red8)",
          },
        },
      },
      Button: {
        variants: {
          primary: {
            root: {
              backgroundColor: "var(--gray5)",
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },  
            active: {
              backgroundColor: "var(--gray7)",
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
            hover: {
              backgroundColor: "var(--gray7)",
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
            focus: {
              backgroundColor: "var(--gray7)",
              color: "var(--gray9)",
              "& svg": {
                fill: "var(--gray9)",
              },
            },
          },
          outline: {
            root: {
              backgroundColor: "var(--gray3) !important",
              borderColor: "var(--gray4)",
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
