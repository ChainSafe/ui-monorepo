export interface IDefaultPalette {
  root: {
    [key: string]: string
  }
  colorTags: {
    primary: 6
    background: 1
    border: 3
    hover: 5
    [key: number]: number
  }
  additional: {
    blue: {
      [key: number]: string
    }
    gray: {
      [key: number]: string
    }
    red: {
      [key: number]: string
    }
    volcano: {
      [key: number]: string
    }
    orange: {
      [key: number]: string
    }
    gold: {
      [key: number]: string
    }
    yellow: {
      [key: number]: string
    }
    lime: {
      [key: number]: string
    }
    green: {
      [key: number]: string
    }
    cyan: {
      [key: number]: string
    }
    geekblue: {
      [key: number]: string
    }
    purple: {
      [key: number]: string
    }
    magenta: {
      [key: number]: string
    }
  }
}

export const DefaultPalette: IDefaultPalette = {
  root: {
    "--blue1": "#e6f7ff",
    "--blue2": "#BAE7FF",
    "--blue3": "#91D5FF",
    "--blue4": "#69C0FF",
    "--blue5": "#40A9FF",
    "--blue6": "#1890FF",
    "--blue7": "#096DD9",
    "--blue8": "#0050B3",
    "--blue9": "#003A8C",
    "--blue10": "#002766",

    "--gray1": "#FFFFFF",
    "--gray2": "#FAFAFA",
    "--gray3": "#F5F5F5",
    "--gray4": "#E8E8E8",
    "--gray5": "#D9D9D9",
    "--gray6": "#BFBFBF",
    "--gray7": "#8C8C8C",
    "--gray8": "#595959",
    "--gray9": "#262626",
    "--gray10": "#000000",

    "--red1": "#FFF1F0",
    "--red2": "#FFCCC7",
    "--red3": "#FFA39E",
    "--red4": "#FF7875",
    "--red5": "#FF4D4F",
    "--red6": "#F5222D",
    "--red7": "#CF1322",
    "--red8": "#A8071A",
    "--red9": "#820014",
    "--red10": "#5C0011",

    "--volcano1": "#FFF2E8",
    "--volcano2": "#FFD8BF",
    "--volcano3": "#FFBB96",
    "--volcano4": "#FF9C6E",
    "--volcano5": "#FF7A45",
    "--volcano6": "#FA541C",
    "--volcano7": "#D4380D",
    "--volcano8": "#AD2102",
    "--volcano9": "#871400",
    "--volcano10": "#610B00",

    "--orange1": "#FFF7E6",
    "--orange2": "#FFE7BA",
    "--orange3": "#FFD591",
    "--orange4": "#FFC069",
    "--orange5": "#FFA940",
    "--orange6": "#FA8C16",
    "--orange7": "#D46B08",
    "--orange8": "#AD4E00",
    "--orange9": "#873800",
    "--orange10": "#612500",

    "--gold1": "#FFFBE6",
    "--gold2": "#FFF1B8",
    "--gold3": "#FFE58F",
    "--gold4": "#FFD666",
    "--gold5": "#FFC53D",
    "--gold6": "#FAAD14",
    "--gold7": "#D48806",
    "--gold8": "#AD6800",
    "--gold9": "#874D00",
    "--gold10": "#613400",

    "--yellow1": "#FEFFE6",
    "--yellow2": "#FFFFB8",
    "--yellow3": "#FFFB8F",
    "--yellow4": "#FFF566",
    "--yellow5": "#FFEC3D",
    "--yellow6": "#FADB14",
    "--yellow7": "#D4B106",
    "--yellow8": "#AD8B00",
    "--yellow9": "#876800",
    "--yellow10": "#614700",

    "--lime1": "#FCFFE6",
    "--lime2": "#F4FFB8",
    "--lime3": "#EAFF8F",
    "--lime4": "#D3F261",
    "--lime5": "#BAE637",
    "--lime6": "#A0D911",
    "--lime7": "#7CB305",
    "--lime8": "#5B8C00",
    "--lime9": "#3F6600",
    "--lime10": "#254000",

    "--green1": "#F6FFED",
    "--green2": "#D9F7BE",
    "--green3": "#B7EB8F",
    "--green4": "#95DE64",
    "--green5": "#73D13D",
    "--green6": "#52C41A",
    "--green7": "#389E0D",
    "--green8": "#237804",
    "--green9": "#135200",
    "--green10": "#092B00",

    "--cyan1": "#E6FFFB",
    "--cyan2": "#B5F5EC",
    "--cyan3": "#87E8DE",
    "--cyan4": "#5CDBD3",
    "--cyan5": "#36CFC9",
    "--cyan6": "#13C2C2",
    "--cyan7": "#08979C",
    "--cyan8": "#006D75",
    "--cyan9": "#00474F",
    "--cyan10": "#002329",

    "--geekblue1": "#F0F5FF",
    "--geekblue2": "#D6E4FF",
    "--geekblue3": "#ADC6FF",
    "--geekblue4": "#85A5FF",
    "--geekblue5": "#597EF7",
    "--geekblue6": "#2F54EB",
    "--geekblue7": "#1D39C4",
    "--geekblue8": "#10239E",
    "--geekblue9": "#061178",
    "--geekblue10": "#030852",

    "--purple1": "#F9F0FF",
    "--purple2": "#EFDBFF",
    "--purple3": "#D3ADF7",
    "--purple4": "#B37FEB",
    "--purple5": "#9254DE",
    "--purple6": "#722ED1",
    "--purple7": "#531DAB",
    "--purple8": "#391085",
    "--purple9": "#22075E",
    "--purple10": "#120338",

    "--magenta1": "#FFF0F6",
    "--magenta2": "#FFD6E7",
    "--magenta3": "#FFADD2",
    "--magenta4": "#FF85C0",
    "--magenta5": "#F759AB",
    "--magenta6": "#EB2F96",
    "--magenta7": "#C41D7F",
    "--magenta8": "#9E1068",
    "--magenta9": "#780650",
    "--magenta10": "#520339"
  },
  colorTags: {
    primary: 6,
    background: 1,
    border: 3,
    hover: 5
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
      10: "var(--blue10)"
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
      10: "var(--gray10)"
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
      10: "var(--red10)"
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
      10: "var(--volcano10)"
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
      10: "var(--orange10)"
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
      10: "var(--gold10)"
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
      10: "var(--yellow10)"
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
      10: "var(--lime10)"
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
      10: "var(--green10)"
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
      10: "var(--cyan10)"
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
      10: "var(--geekblue10)"
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
      10: "var(--purple10)"
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
      10: "var(--magenta10)"
    }
  }
}
