import { Suspense } from "react"
import { Link } from "@/i18n/routing"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { VehicleCard } from "@/components/vehicle/VehicleCard"
import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/types"
import { getTranslations } from "next-intl/server"

export const revalidate = 0

// Client filters usually require a bit more work with URL params. 
// For MVP, we can fetch all (or limit) and filter on server if we use searchParams.
// Let's implement basic server-side filtering via searchParams.

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next 15 searchParams is a Promise
}) {
    const t = await getTranslations('Collection');
    const params = await searchParams
    const supabase = await createClient()

    let query = supabase.from('vehicles').select('*')

    if (params.brand) {
        query = query.ilike('brand', `%${params.brand}%`)
    }
    // Add more filters as needed

    // Filter by Price
    if (params.minPrice) {
        query = query.gte('price', params.minPrice)
    }
    if (params.maxPrice) {
        query = query.lte('price', params.maxPrice)
    }

    // Filter by Mileage
    if (params.maxKm) {
        query = query.lte('mileage', params.maxKm)
    }

    const { data: vehicles } = await query.order('created_at', { ascending: false }) as { data: Vehicle[] | null }

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="font-serif text-4xl mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('desc')}</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8">
                        <form className="space-y-6">
                            {/* Brand Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('search_brand')}</label>
                                <input
                                    name="brand"
                                    defaultValue={typeof params.brand === 'string' ? params.brand : ''}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g. Porsche..."
                                />
                            </div>

                            {/* Price Filters */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('min_price')}</label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        defaultValue={typeof params.minPrice === 'string' ? params.minPrice : ''}
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('max_price')}</label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        defaultValue={typeof params.maxPrice === 'string' ? params.maxPrice : ''}
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Mileage Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('max_mileage')}</label>
                                <input
                                    type="number"
                                    name="maxKm"
                                    defaultValue={typeof params.maxKm === 'string' ? params.maxKm : ''}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Max km"
                                />
                            </div>

                            <Button type="submit" className="w-full">{t('apply_filters')}</Button>
                            <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/5 hover:text-primary" asChild>
                                <Link href="/inventory">{t('clear_filters')}</Link>
                            </Button>
                        </form>
                    </aside>

                    <div className="flex-1">
                        {vehicles && vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vehicles.map(v => (
                                    <VehicleCard key={v.id} vehicle={v} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 border border-dashed rounded-lg">
                                <p className="text-lg text-muted-foreground">{t('no_matches')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
