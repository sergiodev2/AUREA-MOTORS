"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { motion } from "framer-motion"
import { Fuel, Gauge, Calendar, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { useTranslations } from "next-intl"

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    const t = useTranslations('VehicleCard');

    return (
        <Link href={`/vehicle/${vehicle.id}`} className="group block h-full">
            <Card className="h-full overflow-hidden border-border/50 bg-card/50 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                    {vehicle.images?.[0] ? (
                        <Image
                            src={vehicle.images[0]}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                            {t('no_image')}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button size="icon" variant="luxury" className="rounded-full">
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </div>
                    {vehicle.featured && (
                        <Badge variant="luxury" className="absolute left-4 top-4 backdrop-blur-md">
                            {t('featured')}
                        </Badge>
                    )}
                </div>

                <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">{vehicle.brand}</p>
                            <h3 className="font-serif text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                                {vehicle.model}
                            </h3>
                        </div>
                        <p className="font-serif text-lg text-primary">
                            {formatCurrency(vehicle.price)}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex flex-col items-center gap-1 rounded-md bg-secondary/30 p-2">
                            <Calendar className="h-3.5 w-3.5 opacity-70" />
                            <span>{vehicle.year}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-md bg-secondary/30 p-2">
                            <Gauge className="h-3.5 w-3.5 opacity-70" />
                            <span>{formatNumber(vehicle.mileage)} km</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-md bg-secondary/30 p-2">
                            <Fuel className="h-3.5 w-3.5 opacity-70" />
                            <span>{vehicle.fuel}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
