"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Star, Download, Copy, Check } from "lucide-react"
import { getEnrichedAppDetails, type AppDetails } from "@/app/actions"
import { AndroidIcon } from "@/components/icons"

interface AndroidAppCardProps {
  packageName: string
  relation: string[]
  fingerprints: string[]
}

export function AndroidAppCard({ packageName, relation, fingerprints }: AndroidAppCardProps) {
  const [appDetails, setAppDetails] = useState<AppDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  // Use useEffect to call the async server action
  useEffect(() => {
    fetchAppDetails()
  }, [packageName])

  const fetchAppDetails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Now we fetch enriched details directly
      const details = await getEnrichedAppDetails(packageName)
      setAppDetails(details)
    } catch (error) {
      console.error("Error fetching app details:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch app details")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    setTimeout(() => {
      setCopied({ ...copied, [key]: false })
    }, 2000)
  }

  const formatFingerprint = (fingerprint: string) => {
    return fingerprint.substring(0, 16) + "..." + fingerprint.substring(fingerprint.length - 16)
  }

  // Check if the relation includes handle_all_urls permission
  const hasHandleAllUrls = relation.some((rel) => rel.includes("handle_all_urls"))

  // Extract app name from package name for display (fallback)
  const appNameParts = packageName.split(".")
  const appName =
    appNameParts.length > 1 ? appNameParts[appNameParts.length - 1].replace(/([a-z])([A-Z])/g, "$1 $2") : packageName
  const formattedAppName = appName.charAt(0).toUpperCase() + appName.slice(1)
  const companyName =
    appNameParts.length > 2
      ? `${appNameParts[0]}.${appNameParts[1]}`
      : appNameParts.length > 1
        ? appNameParts[0]
        : "Unknown"

  return (
    <Card className="overflow-hidden shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
            {isLoading ? (
              <AndroidIcon className="h-10 w-10 text-muted-foreground animate-pulse" />
            ) : (
              <AndroidIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg break-all whitespace-normal overflow-hidden w-full" title={packageName}>
                {packageName}
              </CardTitle>
            </div>

            {appDetails?.isEnriched && appDetails.score && (
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{appDetails.scoreText || appDetails.score.toFixed(1)}</span>
                </div>
                {appDetails.installs && (
                  <div className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{appDetails.installs}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        {appDetails?.isEnriched && appDetails.description && (
          <div>
            <p className="text-sm text-muted-foreground">{appDetails.description}</p>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-950/20 rounded-md">Error: {error}</div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-1">Package Name</h4>
          <div className="relative group">
            <div
              className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-muted hover:bg-muted/80 cursor-pointer"
              onClick={() => copyToClipboard(packageName, "package")}
            >
              {copied["package"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </div>
            <p
              className="text-sm font-mono bg-muted p-2 rounded-md cursor-pointer"
              onClick={() => copyToClipboard(packageName, "package")}
            >
              {packageName}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {relation.map((rel, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {rel.replace("delegate_permission/", "")}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Certificate Fingerprints</h4>
          <div className="space-y-2">
            {fingerprints.map((fingerprint, index) => (
              <div key={index} className="relative group">
                <div
                  className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-muted hover:bg-muted/80 cursor-pointer"
                  onClick={() => copyToClipboard(fingerprint, `fingerprint-${index}`)}
                >
                  {copied[`fingerprint-${index}`] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </div>
                <div
                  className="text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto flex items-center gap-2 cursor-pointer"
                  onClick={() => copyToClipboard(fingerprint, `fingerprint-${index}`)}
                >
                  <Shield className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span>{formatFingerprint(fingerprint)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={appDetails?.url || `https://play.google.com/store/apps/details?id=${packageName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <span>View on Google Play</span>
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
