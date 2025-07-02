"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Loader2, Copy, Check } from "lucide-react"
import { AppleIcon } from "@/components/icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CountrySelectorContent, getCountryByCode } from "@/components/country-selector"
import { SplitButton } from "@/components/ui/split-button"
import { lookupAppInAppStore, type ApplePathRule } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface AppleAppCardProps {
  appID: string
  paths: ApplePathRule[]
  serviceType: "applinks" | "webcredentials" | "activitycontinuation" | "appclips"
}

export function AppleAppCard({ appID, paths, serviceType }: AppleAppCardProps) {
  const [selectedCountry, setSelectedCountry] = useState("us")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  // Parse the app ID to extract team ID and bundle ID
  // Example: F8L28AU27D.com.abnamro.nl.bankieren -> ["F8L28AU27D", "com.abnamro.nl.bankieren"]
  const [teamID, bundleID] = appID.includes(".")
    ? [appID.split(".")[0], appID.substring(appID.indexOf(".") + 1)]
    : ["Unknown", appID]

  // Format the app name from the bundle ID
  const formatAppName = (bundleID: string) => {
    const parts = bundleID.split(".")
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1]
      return (
        lastPart.charAt(0).toUpperCase() +
        lastPart
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim()
      )
    }
    return bundleID
  }

  const appName = formatAppName(bundleID)

  // Format the developer name from the bundle ID
  const formatDeveloperName = (bundleID: string) => {
    const parts = bundleID.split(".")
    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    }
    return "Unknown"
  }

  const developerName = formatDeveloperName(bundleID)

  // Get service type badge
  const getServiceBadge = () => {
    switch (serviceType) {
      case "applinks":
        return null // Remove the Universal Links badge
      case "webcredentials":
        return <Badge variant="secondary">Shared Web Credentials</Badge>
      case "activitycontinuation":
        return <Badge variant="outline">Handoff</Badge>
      case "appclips":
        return <Badge className="bg-blue-500 hover:bg-blue-600">App Clips</Badge>
      default:
        return null
    }
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    setTimeout(() => {
      setCopied({ ...copied, [key]: false })
    }, 2000)
  }

  // Handle the lookup action
  const handleLookup = async () => {
    setIsLoading(true)

    try {
      const result = await lookupAppInAppStore(bundleID, selectedCountry)

      if (result.success && result.trackViewUrl) {
        // Open the App Store URL in a new tab
        window.open(result.trackViewUrl, "_blank", "noopener,noreferrer")
      } else {
        // Show error toast
        toast({
          title: "App Store Lookup Failed",
          description: result.errorMessage || "Could not find app in the App Store",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get the current selected country
  const country = getCountryByCode(selectedCountry)

  return (
    <Card className="overflow-hidden shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
            <AppleIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg break-all whitespace-normal overflow-hidden w-full">{bundleID}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-1">{getServiceBadge()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">App Identifier</h4>
          <div className="relative group">
            <div
              className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-muted hover:bg-muted/80 cursor-pointer"
              onClick={() => copyToClipboard(appID, "appID")}
            >
              {copied["appID"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </div>
            <div
              className="text-sm font-mono bg-muted p-2 rounded-md cursor-pointer overflow-hidden"
              onClick={() => copyToClipboard(appID, "appID")}
            >
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {teamID}.{bundleID}
              </div>
            </div>
          </div>
        </div>

        {serviceType === "applinks" && paths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Path Patterns</h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="paths">
                <AccordionTrigger className="text-sm">
                  {paths.length} {paths.length === 1 ? "pattern" : "patterns"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {paths.map((pathRule, index) => (
                      <div
                        key={index}
                        className={`relative group text-xs p-2 rounded-md flex items-start gap-2 ${
                          pathRule.exclude
                            ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                            : "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                        }`}
                      >
                        <div
                          className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/50 hover:bg-white/90 dark:hover:bg-black/70 cursor-pointer"
                          onClick={() => copyToClipboard(pathRule.path, `path-${index}`)}
                        >
                          {copied[`path-${index}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </div>
                        <FileText
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            pathRule.exclude ? "text-red-500" : "text-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div
                            className="font-mono cursor-pointer"
                            onClick={() => copyToClipboard(pathRule.path, `path-${index}`)}
                          >
                            {pathRule.path}
                          </div>

                          {pathRule.queryParameters && Object.keys(pathRule.queryParameters).length > 0 && (
                            <div className="mt-1">
                              <div className="text-xs font-medium mb-0.5">Query Parameters:</div>
                              {Object.entries(pathRule.queryParameters).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="pl-2 text-xs opacity-80 cursor-pointer"
                                  onClick={() => {
                                    const valueText = Array.isArray(value) ? value.join(", ") : value
                                    copyToClipboard(`${key}: ${valueText}`, `query-${index}-${key}`)
                                  }}
                                >
                                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                                  {copied[`query-${index}-${key}`] && <Check className="inline-block ml-1 h-3 w-3" />}
                                </div>
                              ))}
                            </div>
                          )}

                          {pathRule.fragment && (
                            <div className="mt-1">
                              <div className="text-xs font-medium mb-0.5">Fragment:</div>
                              <div
                                className="pl-2 text-xs opacity-80 cursor-pointer"
                                onClick={() => copyToClipboard(pathRule.fragment || "", `fragment-${index}`)}
                              >
                                {pathRule.fragment}
                                {copied[`fragment-${index}`] && <Check className="inline-block ml-1 h-3 w-3" />}
                              </div>
                            </div>
                          )}

                          {pathRule.comment && <div className="mt-1 text-xs italic opacity-70">{pathRule.comment}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {serviceType !== "applinks" && (
          <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
            {serviceType === "webcredentials" && "This app can use your website's credentials for authentication."}
            {serviceType === "activitycontinuation" && "This app supports Handoff with your website."}
            {serviceType === "appclips" && "This app provides App Clips for your website."}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <SplitButton
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLookup}
          dropdownTrigger={<span>{country.emoji}</span>}
          dropdownContent={<CountrySelectorContent onSelect={setSelectedCountry} />}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Looking up...</span>
            </>
          ) : (
            <>
              <span>Lookup on App Store</span>
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </>
          )}
        </SplitButton>
      </CardFooter>
    </Card>
  )
}
