import Link from "next/link"
import { signOut } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 border-r bg-muted/40 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold">AUREA<span className="text-primary">.</span></span>
                    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">ADMIN</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/admin">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/admin/vehicles/new">Add Vehicle</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/">View Site</Link>
                    </Button>
                </nav>

                <div className="mt-auto">
                    <form action={signOut}>
                        <Button variant="outline" className="w-full">Sign Out</Button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-12">
                {children}
            </main>
        </div>
    )
}
