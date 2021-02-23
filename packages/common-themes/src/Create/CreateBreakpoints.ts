/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 *
 * @internal
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U

type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never
  }[keyof T],
  string
>

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 *
 * @internal
 */
export type OverridableStringUnion<T, U = {}> = GenerateStringUnion<
  Overwrite<T, U>
>

export type BreakpointDefaults = Record<
  "xs" | "sm" | "md" | "lg" | "xl" | string,
  true
>
export interface BreakpointOverrides {}

export type Breakpoint = OverridableStringUnion<
  BreakpointDefaults,
  BreakpointOverrides
>
export type BreakpointValues = { [key in Breakpoint]: number }
export const keys: Breakpoint[] = []

export interface IBreakpoints {
  keys: Breakpoint[];
  values: BreakpointValues;
  up: (key: Breakpoint | number) => string;
  down: (key: Breakpoint | number) => string;
  between: (start: Breakpoint | number, end: Breakpoint | number) => string;
  only: (key: Breakpoint) => string;
  width: (key: Breakpoint) => number;
}

export type BreakpointsOptions = Partial<
  {
    unit: string;
    step: number;
  } & IBreakpoints
>

// Keep in mind that @media is inclusive by the CSS specification.
export const createBreakpoints = (
  breakpoints: BreakpointsOptions
): IBreakpoints => {
  const {
    // The breakpoint **start** at this value.
    // For instance with the first breakpoint xs: [xs, sm).
    values = {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    },
    unit = "px",
    step = 5,
    ...other
  } = breakpoints

  const keys = Object.keys(values) as Breakpoint[]

  function up(key: Breakpoint | number) {
    const value = typeof values[key] === "number" ? values[key] : key
    return `@media (min-width:${value}${unit})`
  }

  function down(key: Breakpoint | number) {
    const value =
      typeof values[key] === "number" ? values[key] : (key as number)
    return `@media (max-width:${value - step / 100}${unit})`
  }

  function between(start: Breakpoint | number, end: Breakpoint | number) {
    const endIndex = keys.indexOf(end as string)

    return (
      `@media (min-width:${
        typeof values[start] === "number" ? values[start] : start
      }${unit}) and ` +
      `(max-width:${
        (endIndex !== -1 && typeof values[keys[endIndex]] === "number"
          ? values[keys[endIndex]]
          : (end as number)) -
        step / 100
      }${unit})`
    )
  }

  function only(key: Breakpoint) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1] as number | Breakpoint)
      // return between(key, keys[keys.indexOf(key) + 1]);
    }

    return up(key)
  }

  function width(key: Breakpoint) {
    return values[key]
  }

  return {
    keys,
    values,
    up,
    down,
    between,
    only,
    width,
    ...other
  }
}
