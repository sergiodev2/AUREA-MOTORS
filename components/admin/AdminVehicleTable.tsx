"use client"

import Link from "next/link"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteVehicle } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import type { Vehicle } from "@/types"

export function AdminVehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
    if (vehicles.length === 0) {
        return <div className="p-12 text-center text-muted-foreground">No vehicles found. Add one to get started.</div>
    }

    return (
        <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vehicle</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Year</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle font-medium">
                                {vehicle.brand} {vehicle.model}
                            </td>
                            <td className="p-4 align-middle">{formatCurrency(vehicle.price)}</td>
                            <td className="p-4 align-middle">{vehicle.year}</td>
                            <td className="p-4 align-middle">
                                {vehicle.featured ? (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/20 text-primary">Featured</span>
                                ) : (
                                    <span className="text-muted-foreground">Standard</span>
                                )}
                            </td>
                            <td className="p-4 align-middle text-right flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Link>
                                </Button>
                                <form action={async () => {
                                    if (confirm('Are you sure you want to delete this vehicle?')) {
                                        await deleteVehicle(vehicle.id)
                                    }
                                }}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
