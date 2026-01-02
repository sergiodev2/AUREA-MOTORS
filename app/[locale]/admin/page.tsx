import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-server"
import { AdminVehicleTable } from "@/components/admin/AdminVehicleTable"
import type { Vehicle } from "@/types"

export const revalidate = 0

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Vehicle[] | null }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-medium">Inventory Management</h1>
                <Button asChild>
                    <Link href="/admin/vehicles/new"><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <AdminVehicleTable vehicles={vehicles || []} />
            </div>
        </div>
    )
}
