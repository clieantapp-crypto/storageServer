import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { StorageStats } from "@/components/storage-stats"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} profile={profile} />

      <main className="flex-1 bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Storage Dashboard</h1>
            <p className="text-muted-foreground">Upload, manage, and organize your files</p>
          </div>

          <StorageStats profile={profile} />

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Upload Files</h2>
              <FileUpload />
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Your Files</h2>
              <FileList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
