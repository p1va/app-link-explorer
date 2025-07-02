"use client"

import { AndroidAppCard } from "@/components/android-app-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { AndroidAppInfo } from "@/app/actions"
import { useState } from "react"

interface AndroidAppsVisualizationProps {
  data: any[] | null
}

export function AndroidAppsVisualization({ data }: AndroidAppsVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true)

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Android App Links found</AlertTitle>
        <AlertDescription>No valid Android App Links configuration was found for this domain.</AlertDescription>
      </Alert>
    )
  }

  // Parse the Android assetlinks.json data with more robust error handling
  const apps: AndroidAppInfo[] = data
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      try {
        if (!item.target || !item.target.package_name) {
          return null
        }

        return {
          packageName: item.target.package_name,
          relation: Array.isArray(item.relation) ? item.relation : [],
          fingerprints: Array.isArray(item.target.sha256_cert_fingerprints) ? item.target.sha256_cert_fingerprints : [],
        }
      } catch (error) {
        console.error("Error parsing app data:", error)
        return null
      }
    })
    .filter(Boolean) as AndroidAppInfo[]

  if (apps.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Invalid App Links format</AlertTitle>
        <AlertDescription>The Android App Links configuration was found but has an invalid format.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-base">
        Found {apps.length} Android {apps.length === 1 ? "app" : "apps"} linked to this domain
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app, index) => (
          <AndroidAppCard
            key={index}
            packageName={app.packageName}
            relation={app.relation}
            fingerprints={app.fingerprints}
          />
        ))}
      </div>
    </div>
  )
}
