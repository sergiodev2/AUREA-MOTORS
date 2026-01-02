import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { VehicleGallery } from "@/components/vehicle/VehicleGallery"
import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Calendar, Gauge, Fuel, Zap, Settings2, Palette } from "lucide-react"
import type { Vehicle } from "@/types"
import { getTranslations, getLocale } from "next-intl/server"

export const revalidate = 0

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const t = await getTranslations('CarDetail')
    const supabase = await createClient()

    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single() as { data: Vehicle | null }

    if (!vehicle) {
        notFound()
    }

    const locale = await getLocale()
    // Type assertion or check for translations existence
    const translatedDesc = (vehicle.translations as any)?.[locale]?.description || vehicle.description

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <article className="flex-1 container mx-auto px-4 py-12">
                <div className="mb-6">
                    <Link href="/inventory" className="text-sm text-muted-foreground hover:text-primary mb-4 block">← {t('back')}</Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2">
                                {vehicle.brand} <span className="font-light">{vehicle.model}</span>
                            </h1>
                            <div className="flex gap-2">
                                <Badge variant="outline">{vehicle.year}</Badge>
                                <Badge variant="outline">{vehicle.body_type}</Badge>
                                {vehicle.featured && <Badge variant="luxury">{t('featured_collection')}</Badge>}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl md:text-4xl font-serif text-primary">{formatCurrency(vehicle.price)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <VehicleGallery images={vehicle.images} />

                        <div className="prose prose-invert max-w-none">
                            <h2 className="font-serif text-2xl mb-4">{t('description')}</h2>
                            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{translatedDesc}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="rounded-lg border bg-card p-6 space-y-6">
                            <h3 className="font-serif text-xl font-medium">{t('specifications')}</h3>
                            <dl className="space-y-4 text-sm divide-y divide-border/50">
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> {t('year')}</dt>
                                    <dd className="font-medium">{vehicle.year}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4" /> {t('mileage')}</dt>
                                    <dd className="font-medium">{formatNumber(vehicle.mileage)} km</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground flex items-center gap-2"><Fuel className="w-4 h-4" /> {t('fuel')}</dt>
                                    <dd className="font-medium">{vehicle.fuel}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground flex items-center gap-2"><Settings2 className="w-4 h-4" /> {t('transmission')}</dt>
                                    <dd className="font-medium">{vehicle.transmission}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-muted-foreground flex items-center gap-2"><Palette className="w-4 h-4" /> {t('color')}</dt>
                                    <dd className="font-medium">{vehicle.color}</dd>
                                </div>
                                {vehicle.power_hp && (
                                    <div className="flex justify-between py-2">
                                        <dt className="text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4" /> {t('power')}</dt>
                                        <dd className="font-medium">{vehicle.power_hp} HP</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center space-y-4">
                            <h3 className="font-serif text-xl font-medium">{t('cta_title')}</h3>
                            <p className="text-sm text-balance text-muted-foreground">{t('cta_desc')}</p>
                            <Button size="lg" className="w-full" asChild>
                                <Link href={`/contact?vehicle=${vehicle.id}`}>{t('cta_button')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    )
}
