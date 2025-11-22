"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HardDrive, File, Database } from "lucide-react"

interface StorageStatsProps {
  profile: {
    storage_used?: number
    storage_limit?: number
  } | null
}

export function StorageStats({ profile }: StorageStatsProps) {
  const storageUsed = profile?.storage_used || 0
  const storageLimit = profile?.storage_limit || 107374182400 // 100GB
  const usagePercentage = (storageUsed / storageLimit) * 100

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatBytes(storageUsed)} of {formatBytes(storageLimit)} used
            </span>
            <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="rounded-full bg-primary/10 p-2">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Used</div>
              <div className="text-sm font-semibold">{formatBytes(storageUsed)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="rounded-full bg-green-500/10 p-2">
              <File className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Available</div>
              <div className="text-sm font-semibold">{formatBytes(storageLimit - storageUsed)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="rounded-full bg-blue-500/10 p-2">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-sm font-semibold">{formatBytes(storageLimit)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
