export const ENV_VARS: {
  [index: string]: any[]
} = {
  CHAIN_ID: [process.env.CHAIN_ID, '1'],
  SENTRY_DSN: [process.env.SENTRY_DSN, ''],
  COMMIT_SHA: [process.env.COMMIT_SHA, ''],
  BUILD: [process.env.BUILD, ''],
  NODE_ENV: [process.env.NODE_ENV, 'development'],

  SITE_DESCRIPTION: [process.env.SITE_DESCRIPTION, 'Chainsafe Files'],
  SITE_TITLE: [process.env.SITE_DESCRIPTION, 'Chainsafe Files'],
  SITE_URL: [process.env.SITE_URL, '']
}

export const environment = (name: string) => {
  const envVar = ENV_VARS[name]
  if (!envVar) {
    return null
  }
  return envVar[0] === undefined ? envVar[1] : envVar[0].trim()
}

export function fullEnvironment() {
  return Object.fromEntries(
    Object.keys(ENV_VARS).map(key => [key, environment(key)])
  )
}
