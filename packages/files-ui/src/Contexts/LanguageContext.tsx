import React, { useState, useEffect, useCallback } from "react"
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import * as plurals from "make-plural/plurals"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import dayjs from "dayjs"

export type LanguageContext = {
  availableLanguages: Language[]
  selectedLanguage: string
  selectedLocale: string
  setActiveLanguage(newLanguage: string): void | Promise<void>
}

type Language = {
  id: string
  label: string
}

type LanguageProviderProps = {
  children: React.ReactNode | React.ReactNode[]
  availableLanguages: Language[]
}

const DEFAULT_LANGUAGE = "en"
const DEFAULT_LOCALE = "en-GB"
const PREFERED_LANGUAGE_KEY = "csf.preferedLanguage"

const defaultContext: LanguageContext =   {
  availableLanguages: [],
  selectedLanguage: DEFAULT_LANGUAGE,
  selectedLocale: DEFAULT_LOCALE,
  setActiveLanguage: () => {console.error("setActiveLanguage not implemented")}
}

const LanguageContext = React.createContext<LanguageContext>(defaultContext)

const getLanguages = (preferred = ""): string[] => {
  const { languages, language } = window.navigator

  if (Array.isArray(languages)) {
    // Dedupe array of languages
    const deduped = [...new Set(languages.map((l) => l.split("-")[0]))]
    const preferredFirst = preferred
      ? [preferred, ...deduped.filter((lang) => preferred !== lang)]
      : deduped

    return preferredFirst
  }

  if (language) {
    return [preferred, language.split("-")[0]]
  }

  // If language not detected use english
  return [preferred, DEFAULT_LANGUAGE]
}

const getLocales = (): string[] => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
  return [DEFAULT_LOCALE]
}

const LanguageProvider = ({ children, availableLanguages }: LanguageProviderProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const userLocales = getLocales()

  const setLanguage = useCallback((newLanguage: string, setPrefered = true) => {
    if (!availableLanguages.find((l) => l.id === newLanguage)) {
      console.error("Locale is not available, evalutaing:", newLanguage)
      return
    }

    import(`../locales/${newLanguage}/messages.js`)
      .then((newCatalog) => {
        i18n.load(newLanguage, newCatalog.default.messages)
        i18n.loadLocaleData(newLanguage, { plurals: (plurals as Record<string, any>)[newLanguage] })
        i18n.activate(newLanguage)
        setSelectedLanguage(newLanguage)
        setPrefered && localStorageSet(PREFERED_LANGUAGE_KEY, newLanguage)
        dayjs.locale(newLanguage)
      })
      .catch(console.error)
  }, [availableLanguages, localStorageSet])


  useEffect(() => {
    const prefered = localStorageGet(PREFERED_LANGUAGE_KEY)
    const userLanguages = getLanguages(prefered || "")
    const matchingLanguages = [...new Set(userLanguages)].filter((x) =>
      new Set(availableLanguages.map((l) => l.id)).has(x)
    )

    const defaultLanguage = matchingLanguages[0] || DEFAULT_LANGUAGE

    // passing false because this language wasn't
    // set explicitely by the user
    setLanguage(defaultLanguage, false)
  }, [availableLanguages, localStorageGet, setLanguage])

  return (
    <LanguageContext.Provider
      value={{
        availableLanguages,
        selectedLanguage,
        setActiveLanguage: setLanguage,
        selectedLocale: userLocales[0]
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
