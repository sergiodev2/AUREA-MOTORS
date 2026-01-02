import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { AdminVehicleForm } from "@/components/admin/AdminVehicleForm"
import type { Vehicle } from "@/types"

export default async function EditVehiclePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: vehicle } = await supabase.from('vehicles').select('*').eq('id', id).single()

    if (!vehicle) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-medium">Edit Vehicle</h1>
            <AdminVehicleForm vehicle={vehicle as Vehicle} />
        </div>
    )
}
