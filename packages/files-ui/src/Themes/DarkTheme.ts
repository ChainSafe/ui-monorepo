import { createTheme } from "@chainsafe/common-theme"
import { UI_CONSTANTS } from "./Constants"

export const darkTheme = createTheme({
  globalStyling: {
    body: {
      backgroundColor: "#141414",
      color: "#DBDBDB",
    },
  },
  themeConfig: {
    palette: {
      primary: {
        main: "#262626",
        hover: "#FFF",
      },
      secondary: {
        main: "#FFF",
        hover: "#000",
      },
      additional: {
        blue: {
          1: "#111D2C",
          2: "#112A45",
          3: "#15395B",
          4: "#164C7E",
          5: "#1765AD",
          6: "#177DDC",
          7: "#3C9AE8",
          8: "#65B7F3",
          9: "#8DCFF8",
          10: "#B7E3FA",
        },
        gray: {
          1: "#141414",
          2: "#1D1D1D",
          3: "#262626",
          4: "#303030",
          5: "#434343",
          6: "#5A5A5A",
          7: "#7D7D7D",
          8: "#ACACAC",
          9: "#DBDBDB",
          10: "#FFFFFF",
        },
        red: {
          1: "#2A1215",
          2: "#431418",
          3: "#58181C",
          4: "#791A1F",
          5: "#A61D24",
          6: "#D32029",
          7: "#E84749",
          8: "#F37370",
          9: "#F89F9A",
          10: "#FAC8C3",
        },
        volcano: {
          1: "#2B1611",
          2: "#441D12",
          3: "#592716",
          4: "#7C3118",
          5: "#AA3E19",
          6: "#D84A1B",
          7: "#E87040",
          8: "#F3956A",
          9: "#F8B692",
          10: "#FAD4BC",
        },
        orange: {
          1: "#2B1D11",
          2: "#442A11",
          3: "#593815",
          4: "#7C4A15",
          5: "#AA6215",
          6: "#D87A16",
          7: "#E89A3C",
          8: "#F3B765",
          9: "#F8CF8D",
          10: "#FAE3B7",
        },
        gold: {
          1: "#2B2111",
          2: "#443111",
          3: "#594214",
          4: "#7C5914",
          5: "#AA7714",
          6: "#D89614",
          7: "#E8B339",
          8: "#F3CC62",
          9: "#F8DF8B",
          10: "#FAEDB5",
        },
        yellow: {
          1: "#2B2611",
          2: "#443B11",
          3: "#595014",
          4: "#595014",
          5: "#AA9514",
          6: "#D8BD14",
          7: "#E8D639",
          8: "#F3EA62",
          9: "#F8F48B",
          10: "#FAFAB5",
        },
        lime: {
          1: "#1F2611",
          2: "#2E3C10",
          3: "#3E4F13",
          4: "#536D13",
          5: "#6F9412",
          6: "#8BBB11",
          7: "#A9D134",
          8: "#C9E75D",
          9: "#E4F88B",
          10: "#F0FAB5",
        },
        green: {
          1: "#162312",
          2: "#1D3712",
          3: "#274916",
          4: "#306317",
          5: "#3C8618",
          6: "#49AA19",
          7: "#6ABE39",
          8: "#8FD460",
          9: "#8FD460",
          10: "#D5F2BB",
        },
        cyan: {
          1: "#112123",
          2: "#113536",
          3: "#144848",
          4: "#146262",
          5: "#138585",
          6: "#13A8A8",
          7: "#33BCB7",
          8: "#58D1C9",
          9: "#84E2D8",
          10: "#B2F1E8",
        },
        geekblue: {
          1: "#131629",
          2: "#161D40",
          3: "#1C2755",
          4: "#203175",
          5: "#263EA0",
          6: "#2B4ACB",
          7: "#5273E0",
          8: "#7F9EF3",
          9: "#A8C1F8",
          10: "#D2E0FA",
        },
        purple: {
          1: "#1A1325",
          2: "#24163A",
          3: "#301C4D",
          4: "#3E2069",
          5: "#51258F",
          6: "#642AB5",
          7: "#854ECA",
          8: "#AB7AE0",
          9: "#CDA8F0",
          10: "#EBD7FA",
        },
        magenta: {
          1: "#291321",
          2: "#40162F",
          3: "#551C3B",
          4: "#75204F",
          5: "#A02669",
          6: "#CB2B83",
          7: "#E0529C",
          8: "#F37FB7",
          9: "#F8A8CC",
          10: "#FAD2E3",
        },
      },
    },
    constants: {
      ...UI_CONSTANTS,
    },
    overrides: {
      SearchBar: {
        input: {
          root: {
            backgroundColor: "#141414",
            color: "#DBDBDB",
          },
        },
      },
      TextInput: {
        label: {
          color: "#DBDBDB",
        },
        input: {
          root: {
            backgroundColor: "#141414",
            borderColor: "#303030",
            color: "#DBDBDB",
          },
        },
      },
      Breadcrumb: {
        home: {
          fill: "#DBDBDB",
        },
      },
      Typography: {
        root: {
          "& a": {
            color: "#DBDBDB",
          },
        },
        h5: {
          fontWeight: 600,
          color: "#DBDBDB",
        },
      },
      Button: {
        variants: {
          primary: {
            active: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
            hover: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
            focus: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
          },
          outline: {
            root: {
              backgroundColor: "#262626 !important",
              borderColor: "#303030",
              color: "#DBDBDB",
              "& svg": {
                fill: "#DBDBDB",
              },
            },
          },
        },
      },
    },
  },
})
