// Returns a number whose value is limited to the given range.
function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(min, value), max)
}

export type ColorFormat = "rgb" | "rgba" | "hsl" | "hsla";
export type ColorValues = number[];
export interface IColorObject {
  type: ColorFormat;
  values: ColorValues;
}

function intToHex(int: number): string {
  const hex = int.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

// Converts a color from CSS hex format to CSS rgb format.
export function hexToRgb(color: string): string {
  color = color.substr(1)

  const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, "g")
  let colors = color.match(re)

  if (colors && colors[0].length === 1) {
    colors = colors.map((n) => n + n)
  }

  return colors
    ? `rgb${colors.length === 4 ? "a" : ""}(${colors
      .map((n, index) => {
        return index < 3
          ? parseInt(n, 16)
          : Math.round((parseInt(n, 16) / 255) * 1000) / 1000
      })
      .join(", ")})`
    : ""
}

// Converts a color from CSS rgb format to CSS hex format.
export function rgbToHex(color: string): string {
  if (color.indexOf("#") === 0) {
    return color
  }

  const { values } = decomposeColor(color)
  return `#${values.map((n) => intToHex(n)).join("")}`
}

// Converts a color from hsl format to rgb format.

export function hslToRgb(color: string): string {
  const colorObj = decomposeColor(color)
  const { values } = colorObj
  const h = values[0]
  const s = values[1] / 100
  const l = values[2] / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

  let type = "rgb"
  const rgb = [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255)
  ]

  if (colorObj.type === "hsla") {
    type += "a"
    rgb.push(values[3] ? values[3] : 1)
  }

  return recomposeColor({
    type: type as ColorFormat,
    values: rgb as ColorValues
  })
}

// Returns an object with the type and values of a color.
export function decomposeColor(color: string): IColorObject {
  if (color.charAt(0) === "#") {
    return decomposeColor(hexToRgb(color))
  }

  const marker = color.indexOf("(")
  const type = color.substring(0, marker)

  if (["rgb", "rgba", "hsl", "hsla"].indexOf(type) === -1) {
    throw new Error(
      "Material-UI: Unsupported `%s` color.\n" +
        "We support the following formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()."
    )
  }

  const valuesStrings = color
    .substring(marker + 1, color.length - 1)
    .split(",")
  const values = valuesStrings.map((value) => parseFloat(value))

  return { type: type as ColorFormat, values: values as ColorValues }
}

// Converts a color object with type and values to a string.
export function recomposeColor(color: IColorObject) {
  const { type } = color
  const { values } = color

  let valuesArray: (number | string)[] = values

  if (type.indexOf("rgb") !== -1) {
    // Only convert the first 3 values to int (i.e. not alpha)
    valuesArray = values.map((n, i) => (i < 3 ? n : n)) as ColorValues
  } else if (type.indexOf("hsl") !== -1) {
    valuesArray[1] = `${values[1]}%`
    valuesArray[2] = `${values[2]}%`
  }

  return `${type}(${values.join(", ")})`
}

// Calculates the contrast ratio between two colors.

export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const lumA = getLuminance(foreground)
  const lumB = getLuminance(background)
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05)
}

// The relative brightness of any point in a color space,normalized to 0 for darkest black and 1 for lightest white.

export function getLuminance(color: string): number {
  const colorObj = decomposeColor(color)

  let rgb =
    colorObj.type === "hsl"
      ? decomposeColor(hslToRgb(color)).values
      : colorObj.values
  rgb = rgb.map((val) => {
    val /= 255 // normalized
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4
  }) as ColorValues

  // Truncate at 3 digits
  return Number(
    (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3)
  )
}

/**
 * Darken or lighten a color, depending on its luminance.
 * Light colors are darkened, dark colors are lightened.
 */
export function emphasize(color: string, coefficient = 0.15): string {
  return getLuminance(color) > 0.5
    ? darken(color, coefficient)
    : lighten(color, coefficient)
}

/**
 * Set the absolute transparency of a color.
 * Any existing alpha values are overwritten.
 */
export function fade(color: string, value: number): string {
  const colorObj = decomposeColor(color)
  value = clamp(value)

  if (colorObj.type === "rgb" || colorObj.type === "hsl") {
    colorObj.type += "a"
  }
  colorObj.values[3] = value

  return recomposeColor(colorObj)
}

/**
 * Darkens a color.
 */
export function darken(color: string, coefficient: number): string {
  const colorObj = decomposeColor(color)
  coefficient = clamp(coefficient)

  if (colorObj.type.indexOf("hsl") !== -1) {
    colorObj.values[2] *= 1 - coefficient
  } else if (colorObj.type.indexOf("rgb") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      colorObj.values[i] *= 1 - coefficient
    }
  }
  return recomposeColor(colorObj)
}

/**
 * Lightens a color.
 */
export function lighten(color: string, coefficient: number): string {
  const colorObj = decomposeColor(color)
  coefficient = clamp(coefficient)

  if (colorObj.type.indexOf("hsl") !== -1) {
    colorObj.values[2] += (100 - colorObj.values[2]) * coefficient
  } else if (colorObj.type.indexOf("rgb") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      colorObj.values[i] += (255 - colorObj.values[i]) * coefficient
    }
  }

  return recomposeColor(colorObj)
}
