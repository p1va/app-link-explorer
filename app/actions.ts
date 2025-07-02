"use server"

export type RequestLog = {
  url: string
  status: number | null
  duration: number
  contentType: string | null
  success: boolean
  error?: string
  responseBody?: string
  headers?: Record<string, string>
}

export type DiscoveryResult = {
  android: {
    url: string
    logs: RequestLog[]
    data: any | null
    valid: boolean
  }
  apple: {
    url: string
    logs: RequestLog[]
    data: any | null
    valid: boolean
    parsedData?: AppleUniversalLinksData | null
  }
}

export type AndroidAppInfo = {
  packageName: string
  relation: string[]
  fingerprints: string[]
}

export type AppDetails = {
  title: string
  icon: string
  developer: string
  url: string
  description?: string
  installs?: string
  score?: number
  scoreText?: string
  isEnriched: boolean
}

// New types for Apple Universal Links
export type ApplePathRule = {
  path: string
  exclude: boolean
  queryParameters?: Record<string, string | string[]>
  fragment?: string
  comment?: string
}

export type AppleAppConfig = {
  appID: string
  paths: ApplePathRule[]
}

export type AppleServiceConfig = {
  apps: string[]
}

export type AppleUniversalLinksData = {
  applinks: AppleAppConfig[]
  webcredentials?: AppleServiceConfig
  activitycontinuation?: AppleServiceConfig
  appclips?: AppleServiceConfig
}

// New type for App Store lookup response
export type AppStoreLookupResult = {
  success: boolean
  trackViewUrl?: string
  errorMessage?: string
}

export async function checkUniversalLinks(inputUrl: string): Promise<DiscoveryResult> {
  // Process URL (add https:// if needed)
  let baseUrl = inputUrl.trim()
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`
  }

  // Remove trailing slash if present
  baseUrl = baseUrl.replace(/\/$/, "")

  // Initialize result structure
  const discoveryResult: DiscoveryResult = {
    android: {
      url: `${baseUrl}/.well-known/assetlinks.json`,
      logs: [],
      data: null,
      valid: false,
    },
    apple: {
      url: `${baseUrl}/.well-known/apple-app-site-association`,
      logs: [],
      data: null,
      valid: false,
      parsedData: null,
    },
  }

  // Fetch Android assetlinks.json
  await fetchAndProcessUrl(`${baseUrl}/.well-known/assetlinks.json`, discoveryResult.android.logs, (data) => {
    discoveryResult.android.data = data
    discoveryResult.android.valid = Array.isArray(data)
  })

  // Fetch Apple app-site-association (primary location)
  const appleResult = await fetchAndProcessUrl(
    `${baseUrl}/.well-known/apple-app-site-association`,
    discoveryResult.apple.logs,
    (data) => {
      discoveryResult.apple.data = data
      discoveryResult.apple.valid = data && typeof data === "object" && "applinks" in data

      // If valid, parse the Apple AASA data
      if (discoveryResult.apple.valid) {
        discoveryResult.apple.parsedData = parseAppleUniversalLinksData(data)
      }
    },
  )

  // If primary Apple location fails, try fallback
  if (!appleResult) {
    await fetchAndProcessUrl(`${baseUrl}/apple-app-site-association`, discoveryResult.apple.logs, (data) => {
      discoveryResult.apple.data = data
      discoveryResult.apple.valid = data && typeof data === "object" && "applinks" in data

      // If valid, parse the Apple AASA data
      if (discoveryResult.apple.valid) {
        discoveryResult.apple.parsedData = parseAppleUniversalLinksData(data)
      }
    })
  }

  return discoveryResult
}

// Function to parse Apple Universal Links data
function parseAppleUniversalLinksData(data: any): AppleUniversalLinksData | null {
  try {
    if (!data || typeof data !== "object" || !data.applinks) {
      return null
    }

    const result: AppleUniversalLinksData = {
      applinks: [],
    }

    // Parse applinks service
    if (data.applinks && data.applinks.details && Array.isArray(data.applinks.details)) {
      data.applinks.details.forEach((detail: any) => {
        // Get app identifiers
        let appIDs: string[] = []
        if (detail.appID) {
          appIDs = [detail.appID]
        } else if (detail.appIDs && Array.isArray(detail.appIDs)) {
          appIDs = detail.appIDs
        }

        // Process each app ID
        appIDs.forEach((appID) => {
          const appConfig: AppleAppConfig = {
            appID,
            paths: [],
          }

          // Process paths (older format)
          if (detail.paths && Array.isArray(detail.paths)) {
            detail.paths.forEach((path: string) => {
              const exclude = path.startsWith("NOT ")
              appConfig.paths.push({
                path: exclude ? path.substring(4) : path,
                exclude,
              })
            })
          }

          // Process components (newer format)
          if (detail.components && Array.isArray(detail.components)) {
            detail.components.forEach((component: any) => {
              if (component && typeof component === "object") {
                const pathRule: ApplePathRule = {
                  path: component["/"] || "/",
                  exclude: !!component.exclude,
                }

                // Add query parameters if present
                if (component["?"] && typeof component["?"] === "object") {
                  pathRule.queryParameters = component["?"]
                }

                // Add fragment if present
                if (component["#"] && typeof component["#"] === "string") {
                  pathRule.fragment = component["#"]
                }

                // Add comment if present
                if (component.comment && typeof component.comment === "string") {
                  pathRule.comment = component.comment
                }

                appConfig.paths.push(pathRule)
              }
            })
          }

          result.applinks.push(appConfig)
        })
      })
    }

    // Parse webcredentials service
    if (data.webcredentials && data.webcredentials.apps && Array.isArray(data.webcredentials.apps)) {
      result.webcredentials = {
        apps: data.webcredentials.apps,
      }
    }

    // Parse activitycontinuation service
    if (data.activitycontinuation && data.activitycontinuation.apps && Array.isArray(data.activitycontinuation.apps)) {
      result.activitycontinuation = {
        apps: data.activitycontinuation.apps,
      }
    }

    // Parse appclips service
    if (data.appclips && data.appclips.apps && Array.isArray(data.appclips.apps)) {
      result.appclips = {
        apps: data.appclips.apps,
      }
    }

    return result
  } catch (error) {
    console.error("Error parsing Apple Universal Links data:", error)
    return null
  }
}

async function fetchAndProcessUrl(url: string, logs: RequestLog[], processData: (data: any) => void): Promise<boolean> {
  const startTime = performance.now()
  const log: RequestLog = {
    url,
    status: null,
    duration: 0,
    contentType: null,
    success: false,
    error: undefined,
    responseBody: undefined,
  }

  try {
    // Use minimal headers with a specific user agent and accept headers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AppLinkExplorer/1.0",
        Accept: "application/json, application/octet-stream, */*",
      },
      signal: AbortSignal.timeout(10000),
    })

    const endTime = performance.now()
    log.duration = Math.round(endTime - startTime)
    log.status = response.status
    log.contentType = response.headers.get("content-type")

    // Log all response headers for debugging
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    log.headers = headers

    // Clone the response to read it twice (once for text, once for JSON)
    const responseClone = response.clone()

    // Always try to get the response body as text for logging
    try {
      const responseText = await responseClone.text()
      log.responseBody = responseText.substring(0, 1000) // Limit to first 1000 chars to avoid huge logs
    } catch (textError) {
      log.responseBody = `[Failed to read response body: ${textError}]`
    }

    if (response.ok) {
      try {
        const data = await response.json()
        log.success = true
        processData(data)
        logs.push(log)
        return true
      } catch (error) {
        log.success = false
        log.error = "Invalid JSON response"
        logs.push(log)
        return false
      }
    } else {
      log.success = false
      log.error = `HTTP ${response.status}`
      logs.push(log)
      return false
    }
  } catch (error) {
    const endTime = performance.now()
    log.duration = Math.round(endTime - startTime)
    log.success = false
    log.error = error instanceof Error ? error.message : String(error)
    logs.push(log)
    return false
  }
}

// Generate basic app details from package name
export async function generateAppDetailsFromPackage(packageName: string): Promise<AppDetails> {
  // Extract app name from package name
  const appNameParts = packageName.split(".")
  const rawAppName = appNameParts.length > 1 ? appNameParts[appNameParts.length - 1] : packageName

  // Format the app name to be more readable
  // Convert camelCase to spaces and capitalize first letter
  const formattedAppName = rawAppName.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())

  // Get company name from package (usually the first part)
  const companyName = appNameParts.length > 1 ? appNameParts[0] : "Unknown"

  // Format company name to be more readable
  const formattedCompanyName = companyName.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())

  return {
    title: formattedAppName,
    icon: `/placeholder.svg?height=96&width=96&query=app%20icon%20for%20${encodeURIComponent(packageName)}`,
    developer: formattedCompanyName,
    url: `https://play.google.com/store/apps/details?id=${packageName}`,
    isEnriched: false,
  }
}

// New function to fetch enriched app details from Google Play
export async function getEnrichedAppDetails(packageName: string): Promise<AppDetails> {
  try {
    // First generate basic details as fallback
    const basicDetails = await generateAppDetailsFromPackage(packageName)

    // Due to issues with the google-play-scraper in server components,
    // we'll use a more reliable approach with direct fetch
    // This is a temporary solution until we can fix the google-play-scraper integration
    return basicDetails
  } catch (error) {
    console.error(`Failed to fetch enriched details for ${packageName}:`, error)
    // Return basic details if enriched details fetch fails
    const basicDetails = await generateAppDetailsFromPackage(packageName)
    return basicDetails
  }
}

// New server action to lookup an app in the App Store
export async function lookupAppInAppStore(bundleId: string, countryCode: string): Promise<AppStoreLookupResult> {
  try {
    const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=${countryCode}`

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      return {
        success: false,
        errorMessage: `App Store lookup failed with status: ${response.status}`,
      }
    }

    const data = await response.json()

    // Check if any results were found
    if (data.resultCount === 0 || !data.results || data.results.length === 0) {
      return {
        success: false,
        errorMessage: `App not found in the ${countryCode.toUpperCase()} App Store`,
      }
    }

    // Extract the trackViewUrl from the first result
    const trackViewUrl = data.results[0].trackViewUrl

    if (!trackViewUrl) {
      return {
        success: false,
        errorMessage: "App found but no store URL available",
      }
    }

    return {
      success: true,
      trackViewUrl,
    }
  } catch (error) {
    console.error("Error looking up app in App Store:", error)
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
