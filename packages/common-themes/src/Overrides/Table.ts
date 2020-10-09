import { CSSProperties } from "react"

export interface ITableOverride {
  table?: {
    root?: CSSProperties
    dense?: CSSProperties
    hover?: CSSProperties
    striped?: CSSProperties
  }

  tableHead?: CSSProperties
  headCell?: {
    root?: CSSProperties
    left?: CSSProperties
    center?: CSSProperties
    right?: CSSProperties

    sortContainer?: CSSProperties
    sortContainerChildren?: CSSProperties

    caretContainer?: CSSProperties
    caretContainerChildren?: CSSProperties
    sortButton?: {
      root?: CSSProperties
      hover?: CSSProperties
    }
  }

  row?: {
    root?: CSSProperties
    selected?: CSSProperties
    classic?: CSSProperties
    grid?: CSSProperties
  }

  cell?: {
    root?: CSSProperties
    left?: CSSProperties
    center?: CSSProperties
    right?: CSSProperties
  }
}
