import React, { useState, useEffect } from "react"
import { i18n } from "@lingui/core"
import { messages as catalogEn } from "./locales/en/messages"
import { I18nProvider } from "@lingui/react"

export type LanguageContext = {
  availableLanguages: Language[]
  selectedLanguage: string
  selectedLocale: string
  setActiveLanguage(newLanguage: string): void | Promise<void>
  formatLocaleDate(date: Date): string
}

type Language = {
  id: string
  label: string
}

type LanguageProviderProps = {
  children: React.ReactNode | React.ReactNode[]
  availableLanguages: Language[]
}

const LanguageContext = React.createContext<LanguageContext | undefined>(
  undefined,
)

const getLanguages = (): string[] => {
  // @ts-ignore
  const { languages, language, userLanguage } = window.navigator

  if (Array.isArray(languages)) {
    // Dedupe array of languages
    return [...new Set(languages.map((l) => l.split("-")[0]))]
  }

  if (language) {
    return [language.split("-")[0]]
  }

  if (userLanguage) {
    return [userLanguage.split("-")[0]]
  }
  // If language not detected use english
  return ["en"]
}

const getLocales = (): string[] => {
  // @ts-ignore
  const { languages, language, userLanguage } = window.navigator
  const localeRegex = new RegExp("[a-z]{2,3}-[A-Z]{2}")

  if (Array.isArray(languages)) {
    return languages.filter((l) => localeRegex.test(l))
  }

  if (language && localeRegex.test(language)) {
    return [language]
  }

  if (userLanguage && localeRegex.test(userLanguage)) {
    return [userLanguage]
  }
  // If language not detected use english
  return ["en-GB"]
}

const LanguageProvider = ({
  children,
  availableLanguages,
}: LanguageProviderProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const userLocales = getLocales()

  useEffect(() => {
    const userLanguages = getLanguages()

    const matchingLanguages = [...new Set(userLanguages)].filter((x) =>
      new Set(availableLanguages.map((l) => l.id)).has(x),
    )
    const defaultLanguage = matchingLanguages[0] || "en"
    //@ts-ignore
    i18n.load(defaultLanguage, catalogEn)
    i18n.activate(defaultLanguage)
    setSelectedLanguage(defaultLanguage)
  }, [availableLanguages])

  const formatLocaleDate = (date: Date) => {
    const result = new Intl.DateTimeFormat(userLocales[0], {
      timeZone: "UTC",
      timeZoneName: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(date)

    return result
  }

  const setLanguage = async (newLanguage: string) => {
    if (!availableLanguages.map((l) => l.id).includes(newLanguage)) {
      console.log("This locale is not available")
      return
    }

    // const newCatalog = await import(`../locales/${newLanguage}/messages.js`)
    // i18n.load(newLanguage, neimport { messagesascatalogEn } from "locales/en/messages.mjs";
    // i18n.activate(newLanguage)
    setSelectedLanguage(newLanguage)
  }

  return (
    <LanguageContext.Provider
      value={{
        availableLanguages: availableLanguages,
        selectedLanguage: selectedLanguage,
        setActiveLanguage: setLanguage,
        selectedLocale: userLocales[0],
        formatLocaleDate,
      }}
    >
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </LanguageContext.Provider>
  )
}

function useLanguageContext() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguageContext must be used within a LanguageProvider")
  }
  return context
}

export { LanguageProvider, useLanguageContext }
