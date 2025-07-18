"use server"

import { URL } from "url";
import * as https from 'https';
import * as http from 'http';

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

// Helper function to normalize URL
function normalizeUrl(inputUrl: string): string {
  // Process URL (add https:// if needed)
  let baseUrl = inputUrl.trim()
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`
  }

  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, "")
}

// Helper function to initialize discovery result structure
function initializeDiscoveryResult(baseUrl: string): DiscoveryResult {
  return {
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
}

// Helper function to fetch Android assetlinks.json
async function fetchAndroidLinks(baseUrl: string, androidResult: any): Promise<void> {
  await fetchAndProcessUrl(`${baseUrl}/.well-known/assetlinks.json`, androidResult.logs, (data) => {
    androidResult.data = data
    androidResult.valid = Array.isArray(data)
  })
}

// Helper function to fetch Apple app-site-association with fallback
async function fetchAppleLinks(baseUrl: string, appleResult: any): Promise<void> {
  // Fetch Apple app-site-association (primary location)
  const primaryResult = await fetchAndProcessUrl(
    `${baseUrl}/.well-known/apple-app-site-association`,
    appleResult.logs,
    (data) => processAppleData(data, appleResult),
  )

  // If primary Apple location fails, try fallback
  if (!primaryResult) {
    await fetchAndProcessUrl(
      `${baseUrl}/apple-app-site-association`, 
      appleResult.logs, 
      (data) => processAppleData(data, appleResult)
    )
  }
}

export async function checkUniversalLinks(inputUrl: string): Promise<DiscoveryResult> {
  const baseUrl = normalizeUrl(inputUrl)
  const discoveryResult = initializeDiscoveryResult(baseUrl)

  // Fetch both Android and Apple data
  await fetchAndroidLinks(baseUrl, discoveryResult.android)
  await fetchAppleLinks(baseUrl, discoveryResult.apple)

  return discoveryResult
}

// Helper function to process Apple app-site-association data
function processAppleData(data: any, appleResult: any): void {
  appleResult.data = data
  appleResult.valid = data && typeof data === "object" && "applinks" in data

  // If valid, parse the Apple AASA data
  if (appleResult.valid) {
    appleResult.parsedData = parseAppleUniversalLinksData(data)
  }
}

// Helper function to parse applinks service
function parseAppleApplinksService(data: any): AppleAppConfig[] {
  const applinks: AppleAppConfig[] = []
  
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

        applinks.push(appConfig)
      })
    })
  }

  return applinks
}

// Helper function to parse simple service (webcredentials, activitycontinuation, appclips)
function parseSimpleAppleService(data: any, serviceName: string): { apps: string[] } | undefined {
  if (data[serviceName] && data[serviceName].apps && Array.isArray(data[serviceName].apps)) {
    return { apps: data[serviceName].apps }
  }
  return undefined
}

// Function to parse Apple Universal Links data
function parseAppleUniversalLinksData(data: any): AppleUniversalLinksData | null {
  try {
    if (!data || typeof data !== "object" || !data.applinks) {
      return null
    }

    const result: AppleUniversalLinksData = {
      applinks: parseAppleApplinksService(data),
    }

    // Parse other services
    const webcredentials = parseSimpleAppleService(data, "webcredentials")
    if (webcredentials) result.webcredentials = webcredentials

    const activitycontinuation = parseSimpleAppleService(data, "activitycontinuation")
    if (activitycontinuation) result.activitycontinuation = activitycontinuation

    const appclips = parseSimpleAppleService(data, "appclips")
    if (appclips) result.appclips = appclips

    return result
  } catch (error) {
    console.error("Error parsing Apple Universal Links data:", error)
    return null
  }
}

// Helper function to make HTTP/HTTPS requests without Sec-* headers
function makeHttpRequest(url: string, options: any = {}): Promise<{
  statusCode: number,
  headers: Record<string, string | string[]>,
  body: string
}> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'AppLinkExplorer/1.0',
        'Accept': '*/*',
        ...options.headers
      },
      timeout: options.timeout || 30000
    }

    const req = client.request(requestOptions, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          headers: res.headers as Record<string, string | string[]>,
          body
        })
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
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
    // Use the custom HTTP request function instead of fetch
    const response = await makeHttpRequest(url)

    const endTime = performance.now()
    log.duration = Math.round(endTime - startTime)
    log.status = response.statusCode
    log.contentType = Array.isArray(response.headers['content-type']) 
      ? response.headers['content-type'][0] 
      : response.headers['content-type'] || null

    // Log all response headers for debugging
    const headers: Record<string, string> = {}
    Object.entries(response.headers).forEach(([key, value]) => {
      headers[key] = Array.isArray(value) ? value.join(', ') : value
    })
    log.headers = headers

    // Always try to get the response body as text for logging
    log.responseBody = response.body.substring(0, 1000) // Limit to first 1000 chars to avoid huge logs

    if (response.statusCode >= 200 && response.statusCode < 300) {
      try {
        const data = JSON.parse(response.body)
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
      log.error = `HTTP ${response.statusCode}`
      logs.push(log)
      console.error(log)
      return false
    }
  } catch (error) {
    const endTime = performance.now()
    log.duration = Math.round(endTime - startTime)
    log.success = false
    log.error = error instanceof Error ? error.message : String(error)
    logs.push(log)
    console.error(error)
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

    const response = await makeHttpRequest(url, {
      timeout: 10000, // 10 second timeout
    })

    if (response.statusCode < 200 || response.statusCode >= 300) {
      return {
        success: false,
        errorMessage: `App Store lookup failed with status: ${response.statusCode}`,
      }
    }

    const data = JSON.parse(response.body)

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
