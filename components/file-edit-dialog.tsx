"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface FileEditDialogProps {
  file: {
    id: string
    filename: string
    is_public: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FileEditDialog({ file, open, onOpenChange, onSuccess }: FileEditDialogProps) {
  const [filename, setFilename] = useState(file.filename)
  const [isPublic, setIsPublic] = useState(file.is_public)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          is_public: isPublic,
        }),
      })

      if (!response.ok) throw new Error("Failed to update file")

      toast({
        title: "Success",
        description: "File updated successfully",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File Details</DialogTitle>
          <DialogDescription>Update the filename and visibility settings for this file.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-switch">Public Access</Label>
              <p className="text-sm text-muted-foreground">Allow anyone with the link to view this file</p>
            </div>
            <Switch id="public-switch" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
