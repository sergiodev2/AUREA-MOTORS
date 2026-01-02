import { AdminVehicleForm } from "@/components/admin/AdminVehicleForm"

export default function NewVehiclePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-medium">Add New Vehicle</h1>
            <AdminVehicleForm />
        </div>
    )
}
