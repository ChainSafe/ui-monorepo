export interface ITableOverride {
  table?: {
    root?: Record<string, any>
    dense?: Record<string, any>
    hover?: Record<string, any>
    striped?: Record<string, any>
  }

  tableHead?: Record<string, any>
  headCell?: {
    root?: Record<string, any>
    left?: Record<string, any>
    center?: Record<string, any>
    right?: Record<string, any>

    sortContainer?: Record<string, any>
    sortContainerChildren?: Record<string, any>

    caretContainer?: Record<string, any>
    caretContainerChildren?: Record<string, any>
    sortButton?: {
      root?: Record<string, any>
      hover?: Record<string, any>
    }
  }

  row?: {
    root?: Record<string, any>
    selected?: Record<string, any>
    classic?: Record<string, any>
    grid?: Record<string, any>
  }

  cell?: {
    root?: Record<string, any>
    left?: Record<string, any>
    center?: Record<string, any>
    right?: Record<string, any>
  }
}
