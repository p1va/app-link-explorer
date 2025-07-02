"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Check, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { checkUniversalLinks, type DiscoveryResult } from "@/app/actions"
import { AndroidIcon, AppleIcon } from "@/components/icons"
import { CodeBlock } from "@/components/code-block"
import { AndroidAppsVisualization } from "@/components/android-apps-visualization"
import { AppleAppsVisualization } from "@/components/apple-apps-visualization"
import Image from "next/image"

export default function LinkDiscovery() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiscoveryResult | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})
  const [favicon, setFavicon] = useState<string | null>(null)
  const [faviconLoaded, setFaviconLoaded] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  // Use a ref to track if we're handling a manual submission
  const isManualSubmission = useRef(false)

  // Extract domain from path or params when component loads
  useEffect(() => {
    // Skip if this is a manual submission (we're already handling the check)
    if (isManualSubmission.current) {
      isManualSubmission.current = false
      return
    }

    // Check if we have a domain parameter
    const domain = params?.domain as string | undefined

    if (domain) {
      // Set the URL input and trigger the check
      setUrl(domain)
      checkDomain(domain)
    }
  }, [params])

  // Function to fetch favicon
  const fetchFavicon = (domain: string) => {
    // Reset favicon state
    setFavicon(null)
    setFaviconLoaded(false)

    // Use Google's favicon service for reliable favicon fetching
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

    // Set the favicon URL
    setFavicon(faviconUrl)
  }

  const checkDomain = async (domainToCheck: string) => {
    if (!domainToCheck.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      // Try to fetch the favicon for the domain
      fetchFavicon(domainToCheck)

      // Call the server action to check universal links
      const discoveryResult = await checkUniversalLinks(domainToCheck)
      setResult(discoveryResult)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process URL: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) return

    // Extract domain from URL
    let domain = url.trim()

    // Remove protocol if present
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      domain = domain.replace(/^https?:\/\//, "")
    }

    // Remove path and query parameters if present
    domain = domain.split("/")[0]

    // Set the manual submission flag to true to prevent double checking
    isManualSubmission.current = true

    // Update the URL path without forcing a full navigation
    // Use replace instead of push to avoid adding to browser history
    router.replace(`/${domain}`, { scroll: false })

    // Check the domain
    checkDomain(domain)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    setTimeout(() => {
      setCopied({ ...copied, [key]: false })
    }, 2000)
  }

  const getCurlCommand = (url: string) => {
    return `curl -s "${url}" | jq`
  }

  const formatJson = (json: any) => {
    return JSON.stringify(json, null, 2)
  }

  const handleFaviconLoad = () => {
    setFaviconLoaded(true)
  }

  const handleFaviconError = () => {
    setFaviconLoaded(false)
    setFavicon(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardDescription>
            Enter a URL or exact domain to explore which iOS and Android apps are linked to it and support seamlessly
            opening the link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="relative flex-1 flex items-center">
              {favicon ? (
                <div className="absolute left-3 flex items-center justify-center">
                  <Image
                    src={favicon || "/placeholder.svg"}
                    alt="Site favicon"
                    width={16}
                    height={16}
                    className={`${faviconLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
                    onLoad={handleFaviconLoad}
                    onError={handleFaviconError}
                  />
                  {!faviconLoaded && <Globe className="h-4 w-4 text-muted-foreground" />}
                </div>
              ) : (
                <div className="absolute left-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <Input
                placeholder="https://chat.openai.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 flex-1"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !url.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking
                </>
              ) : (
                "Check"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Tabs defaultValue="android" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="android" className="flex items-center gap-2">
              <AndroidIcon className="h-4 w-4" />
              <span>Android</span>
              {result.android.valid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <span className="h-4 w-4 text-red-500">✕</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="apple" className="flex items-center gap-2">
              <AppleIcon className="h-4 w-4" />
              <span>Apple</span>
              {result.apple.valid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <span className="h-4 w-4 text-red-500">✕</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="android" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AndroidIcon className="h-5 w-5" />
                  Android
                </CardTitle>
                <CardDescription>
                  {result.android.valid
                    ? "Valid Android App Links configuration found"
                    : "No valid Android App Links configuration found"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apps Section - Moved to the top */}
                {result.android.valid && result.android.data && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Apps</h3>
                    <AndroidAppsVisualization data={result.android.data} />
                  </div>
                )}

                {/* Technical Details Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Technical Details</h3>

                  {/* Request Logs - Now directly visible */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Request Logs</h3>
                    {result.android.logs.map((log, index) => (
                      <div key={index} className="text-sm border rounded-md p-3 bg-muted/30">
                        <div className="flex justify-between">
                          <span className="font-mono break-all">{log.url}</span>
                          <span className={log.success ? "text-green-500" : "text-red-500"}>
                            {log.success ? "Success" : "Failed"}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 space-y-1">
                          <div>Status: {log.status || "N/A"}</div>
                          <div>Duration: {log.duration}ms</div>
                          <div>Content-Type: {log.contentType || "N/A"}</div>
                          {log.error && <div>Error: {log.error}</div>}
                          {log.responseBody && (
                            <div className="mt-2">
                              <div className="font-medium text-xs mb-1">Response Body:</div>
                              <div className="text-xs text-muted-foreground italic">
                                [Response body available in the Response Data section below]
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Copy as curl button - Now directly visible */}
                  {result.android.logs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getCurlCommand(result.android.url), "android-curl")}
                    >
                      {copied["android-curl"] ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy as curl
                    </Button>
                  )}

                  {/* Response Data - Only this is collapsible now */}
                  {result.android.data && (
                    <div className="space-y-2">
                      <Accordion type="single" collapsible defaultValue="">
                        <AccordionItem value="response-data">
                          <AccordionTrigger className="text-sm font-medium py-0">Response Data</AccordionTrigger>
                          <AccordionContent>
                            <div className="text-xs text-muted-foreground mb-1">Click anywhere in the code to copy</div>
                            <CodeBlock code={formatJson(result.android.data)} language="json" />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apple" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppleIcon className="h-5 w-5" />
                  Apple
                </CardTitle>
                <CardDescription>
                  {result.apple.valid
                    ? "Valid Apple Universal Links configuration found"
                    : "No valid Apple Universal Links configuration found"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apps Section - Moved to the top */}
                {result.apple.valid && result.apple.data && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Apps</h3>
                    <AppleAppsVisualization data={result.apple.parsedData} />
                  </div>
                )}

                {/* Technical Details Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Technical Details</h3>

                  {/* Request Logs - Now directly visible */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Request Logs</h3>
                    {result.apple.logs.map((log, index) => (
                      <div key={index} className="text-sm border rounded-md p-3 bg-muted/30">
                        <div className="flex justify-between">
                          <span className="font-mono break-all">{log.url}</span>
                          <span className={log.success ? "text-green-500" : "text-red-500"}>
                            {log.success ? "Success" : "Failed"}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 space-y-1">
                          <div>Status: {log.status || "N/A"}</div>
                          <div>Duration: {log.duration}ms</div>
                          <div>Content-Type: {log.contentType || "N/A"}</div>
                          {log.error && <div>Error: {log.error}</div>}
                          {log.responseBody && (
                            <div className="mt-2">
                              <div className="font-medium text-xs mb-1">Response Body:</div>
                              <div className="text-xs text-muted-foreground italic">
                                [Response body available in the Response Data section below]
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Copy as curl button - Now directly visible */}
                  {result.apple.logs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getCurlCommand(result.apple.url), "apple-curl")}
                    >
                      {copied["apple-curl"] ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy as curl
                    </Button>
                  )}

                  {/* Response Data - Only this is collapsible now */}
                  {result.apple.data && (
                    <div className="space-y-2">
                      <Accordion type="single" collapsible defaultValue="">
                        <AccordionItem value="response-data">
                          <AccordionTrigger className="text-sm font-medium py-0">Response Data</AccordionTrigger>
                          <AccordionContent>
                            <div className="text-xs text-muted-foreground mb-1">Click anywhere in the code to copy</div>
                            <CodeBlock code={formatJson(result.apple.data)} language="json" />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
