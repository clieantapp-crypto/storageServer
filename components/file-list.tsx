"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  File,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
  Search,
  ImageIcon,
  FileText,
  FileVideo,
  FileAudio,
  Archive,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileEditDialog } from "@/components/file-edit-dialog"

interface FileItem {
  id: string
  filename: string
  file_type: string
  file_size: number
  blob_url: string
  is_public: boolean
  created_at: string
}

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [editFile, setEditFile] = useState<FileItem | null>(null)
  const { toast } = useToast()

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files")
      if (!response.ok) throw new Error("Failed to fetch files")
      const data = await response.json()
      setFiles(data.files || [])
      setFilteredFiles(data.files || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files)
    } else {
      const filtered = files.filter((file) => file.filename.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredFiles(filtered)
    }
  }, [searchQuery, files])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete file")

      toast({
        title: "Success",
        description: "File deleted successfully",
      })

      fetchFiles()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setDeleteFileId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (fileType.startsWith("video/")) return <FileVideo className="h-5 w-5" />
    if (fileType.startsWith("audio/")) return <FileAudio className="h-5 w-5" />
    if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="h-5 w-5" />
    if (fileType.includes("zip") || fileType.includes("archive")) return <Archive className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredFiles.length === 0 ? (
        <Card className="p-8 text-center">
          <File className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No files found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery ? "Try a different search query" : "Upload your first file to get started"}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1 text-muted-foreground">{getFileIcon(file.file_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{file.filename}</h4>
                      {file.is_public && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.open(file.blob_url, "_blank")}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const a = document.createElement("a")
                        a.href = file.blob_url
                        a.download = file.filename
                        a.click()
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditFile(file)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteFileId(file.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file from your storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFileId && handleDelete(deleteFileId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editFile && (
        <FileEditDialog
          file={editFile}
          open={!!editFile}
          onOpenChange={(open) => !open && setEditFile(null)}
          onSuccess={fetchFiles}
        />
      )}
    </div>
  )
}
