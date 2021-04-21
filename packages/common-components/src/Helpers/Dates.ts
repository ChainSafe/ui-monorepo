export const standardDateFormat = (input: Date): string =>
  `${`${input.getDate()}`.padStart(2, "0")}/${`${
    input.getMonth() + 1
  }`.padStart(2, "0")}/${`${input.getFullYear()}`.substr(2, 4)}`

export const formatAMPM = (date: Date) => {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "pm" : "am"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`
}

export const standardlongDateFormat = (input: Date, time?: boolean, fullMonth: boolean = false): string => {
  const months = fullMonth ? [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ] : [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ]

  return `${`${input.getDay()}`.padStart(2, "0")} ${`${
    months[input.getMonth()].substr(0, 4)
  }`} ${`${input.getFullYear()}`.substr(0, 4)}${time ? ` ${formatAMPM(input)}` : ""}`
}