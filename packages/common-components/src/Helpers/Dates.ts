export const standardDateFormat = (input: Date): string =>
  `${`${input.getDate()}`.padStart(2, '0')}/${`${
    input.getMonth() + 1
  }`.padStart(2, '0')}/${`${input.getFullYear()}`.substr(2, 4)}`

export const standardlongDateFormat = (input: Date): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${`${input.getDay()}`.padStart(2, '0')} ${`${
    months[input.getMonth()]
  }`} ${`${input.getFullYear()}`.substr(0, 4)}`
}