"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { AppleAppCard } from "@/components/apple-app-card"
import type { AppleUniversalLinksData } from "@/app/actions"

interface AppleAppsVisualizationProps {
  data: AppleUniversalLinksData | null | undefined
}

export function AppleAppsVisualization({ data }: AppleAppsVisualizationProps) {
  if (!data || !data.applinks || data.applinks.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Apple Universal Links found</AlertTitle>
        <AlertDescription>No valid Apple Universal Links configuration was found for this domain.</AlertDescription>
      </Alert>
    )
  }

  // Count total number of apps across all services
  const applinksCount = data.applinks.length
  const webcredentialsCount = data.webcredentials?.apps.length || 0
  const activitycontinuationCount = data.activitycontinuation?.apps.length || 0
  const appclipsCount = data.appclips?.apps.length || 0

  const totalApps = applinksCount + webcredentialsCount + activitycontinuationCount + appclipsCount

  return (
    <div className="space-y-6">
      <p className="text-base">
        Found {applinksCount} iOS {applinksCount === 1 ? "app" : "apps"} linked to this domain
      </p>

      {/* Universal Links (applinks) */}
      {data.applinks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Universal Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.applinks.map((app, index) => (
              <AppleAppCard key={`applink-${index}`} appID={app.appID} paths={app.paths} serviceType="applinks" />
            ))}
          </div>
        </div>
      )}

      {/* Shared Web Credentials */}
      {data.webcredentials && data.webcredentials.apps.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Shared Web Credentials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.webcredentials.apps.map((appID, index) => (
              <AppleAppCard key={`webcred-${index}`} appID={appID} paths={[]} serviceType="webcredentials" />
            ))}
          </div>
        </div>
      )}

      {/* Handoff */}
      {data.activitycontinuation && data.activitycontinuation.apps.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Handoff</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.activitycontinuation.apps.map((appID, index) => (
              <AppleAppCard key={`handoff-${index}`} appID={appID} paths={[]} serviceType="activitycontinuation" />
            ))}
          </div>
        </div>
      )}

      {/* App Clips */}
      {data.appclips && data.appclips.apps.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">App Clips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.appclips.apps.map((appID, index) => (
              <AppleAppCard key={`appclip-${index}`} appID={appID} paths={[]} serviceType="appclips" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
