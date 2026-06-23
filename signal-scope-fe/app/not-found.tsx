import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
        <span className="text-xs text-muted-foreground">404 — Not Found</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-elevated/40">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="font-mono text-5xl font-bold tracking-tight text-foreground/20">
            404
          </div>
          <h1 className="mt-3 text-xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Use the sidebar to navigate to a valid section.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              <Home className="h-3.5 w-3.5" />
              Go to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
