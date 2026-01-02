"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createVehicle, updateVehicle } from "@/lib/actions"
import { useState, useTransition } from "react"
import type { Vehicle } from "@/types"

// This schema mirrors the one in actions.ts roughly
const formSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    year: z.coerce.number().min(1900),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel: z.string().min(1),
    transmission: z.string().min(1),
    body_type: z.string().min(1),
    color: z.string().min(1),
    power_hp: z.coerce.number().optional(),
    description: z.string().optional(),
    featured: z.boolean().optional(),
    images: z.string().optional() // Comma separated for MVP
})

type FormData = z.infer<typeof formSchema>

export function AdminVehicleForm({ vehicle }: { vehicle?: Vehicle }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [existingImages, setExistingImages] = useState<string[]>(vehicle?.images || [])
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    // Remove images from our Zod schema since we handle them manually with FormData
    const defaultValues: Partial<FormData> = vehicle ? {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        body_type: vehicle.body_type,
        color: vehicle.color,
        power_hp: vehicle.power_hp ?? undefined,
        description: vehicle.description ?? undefined,
        featured: vehicle.featured,
    } : {
        year: new Date().getFullYear(),
        featured: false,
        price: 0,
        mileage: 0
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues as any
    })

    function removeExistingImage(index: number) {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setNewFiles(prev => [...prev, ...files])

            // Create preview URLs
            const newPreviews = files.map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...newPreviews])
        }
    }

    function removeNewFile(index: number) {
        setNewFiles(prev => prev.filter((_, i) => i !== index))
        setPreviewUrls(prev => {
            // Revoke the URL to avoid memory leaks
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    async function onSubmit(data: FormData) {
        setError(null)
        startTransition(async () => {
            const formData = new FormData()

            // Append standard fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString())
                }
            })

            // Append existing images
            existingImages.forEach(url => {
                formData.append("existing_images", url)
            })

            // Append new files from state
            newFiles.forEach(file => {
                formData.append("image_files", file)
            })

            let result;
            if (vehicle) {
                result = await updateVehicle(vehicle.id, null, formData)
            } else {
                result = await createVehicle(null, formData)
            }

            if (result && result.error) {
                setError(result.error)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-card p-6 rounded-lg border">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Input {...register("brand")} placeholder="Mercedes-Benz" />
                    {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input {...register("model")} placeholder="C-Class" />
                    {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Input type="number" {...register("year")} />
                    {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (€)</label>
                    <Input type="number" {...register("price")} />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Mileage (km)</label>
                    <Input type="number" {...register("mileage")} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Fuel Type</label>
                    <Input {...register("fuel")} placeholder="Petrol, Diesel, Electric..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Transmission</label>
                    <Input {...register("transmission")} placeholder="Automatic" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Body Type</label>
                    <Input {...register("body_type")} placeholder="SUV, Sedan..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input {...register("color")} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Power (HP)</label>
                    <Input type="number" {...register("power_hp")} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("description")}
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium">Vehicle Images</label>

                {/* Existing Images Preview */}
                {existingImages.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Existing Images</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="relative group aspect-square rounded-md overflow-hidden border">
                                    <img src={url} alt="Vehicle" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Files Preview */}
                {previewUrls.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">New Uploads</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={`new-${index}`} className="relative group aspect-square rounded-md overflow-hidden border border-primary/50">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(index)}
                                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* File Upload Input */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="image_upload" className="text-xs text-muted-foreground">Add Images</label>
                    <Input
                        id="image_upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                        // Reset value to allow selecting same file again if deleted (optional)
                        value=""
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" {...register("featured")} className="h-4 w-4" />
                <label htmlFor="featured" className="text-sm font-medium">Featured Vehicle</label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Saving..." : vehicle ? "Update Vehicle" : "Create Vehicle"}
            </Button>
        </form>
    )
}
