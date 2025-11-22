import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardDrive, Upload, Lock, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            <span className="text-xl font-bold">Storage Server</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Secure Cloud Storage for Your Files
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Upload, manage, and share your files with ease. Get 100GB of secure cloud storage with advanced file
              management features.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-slate-50 py-24 text-black">
          <div className="container px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-center text-3xl font-bold tracking-tight">Everything you need for file storage</h2>
              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Easy Upload</h3>
                  <p className="mt-2 text-muted-foreground">
                    Drag and drop files or browse to upload. Support for all file types.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Secure Storage</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your files are encrypted and protected with enterprise-grade security.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Lightning Fast</h3>
                  <p className="mt-2 text-muted-foreground">
                    Download and access your files instantly from anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2025 Storage Server. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
