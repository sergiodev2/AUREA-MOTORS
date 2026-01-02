"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function VehicleGallery({ images }: { images: string[] }) {
    const [selected, setSelected] = useState(0)

    if (!images || images.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image
                    src={images[selected]}
                    alt="Vehicle View"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={cn(
                            "relative h-20 w-32 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                            selected === idx ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`View ${idx}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
