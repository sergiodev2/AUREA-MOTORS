"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"
import type { Vehicle, VehicleInsert } from "@/types"

// --- Auth Actions ---

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    return redirect("/admin")
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect("/admin/login")
}

import { saveLocalFile, deleteLocalFile } from "@/lib/storage"

// --- Vehicle Actions ---

import { generateVehicleTranslations } from "@/lib/translation"

const vehicleSchema = z.object({
    brand: z.string().min(1),
    model: z.string().min(1),
    year: z.coerce.number().min(1900),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel: z.string().min(1),
    transmission: z.string().min(1),
    body_type: z.string().min(1),
    color: z.string().min(1),
    power_hp: z.coerce.number().nullable(),
    description: z.string().nullable(),
    featured: z.coerce.boolean(),
    // images are handled separately now
})

export async function createVehicle(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const rawData = {
        brand: formData.get("brand"),
        model: formData.get("model"),
        year: formData.get("year"),
        price: formData.get("price"),
        mileage: formData.get("mileage"),
        fuel: formData.get("fuel"),
        transmission: formData.get("transmission"),
        body_type: formData.get("body_type"),
        color: formData.get("color"),
        power_hp: formData.get("power_hp"),
        description: formData.get("description"),
        featured: formData.get("featured") === "true",
    }

    const result = vehicleSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Validation failed", issues: result.error.flatten() }
    }

    // Generate Translations
    let translations = {}
    if (result.data.description) {
        translations = await generateVehicleTranslations(result.data.description)
    }

    // Handle Image Uploads
    const imageFiles = formData.getAll("image_files") as File[]
    const imageUrls: string[] = []
    const uploadErrors: string[] = []

    for (const file of imageFiles) {
        if (file.size > 0) {
            try {
                const url = await saveLocalFile(file)
                imageUrls.push(url)
            } catch (e) {
                uploadErrors.push(`Failed to upload ${file.name}`)
            }
        }
    }

    if (uploadErrors.length > 0) {
        return { error: `Image upload failed: ${uploadErrors.join(", ")}` }
    }

    const { error } = await supabase
        .from("vehicles")
        .insert({
            ...result.data,
            translations, // Add translations to insert
            images: imageUrls
        })

    if (error) return { error: error.message }

    revalidatePath("/inventory")
    revalidatePath("/admin")
    return redirect("/admin")
}

export async function updateVehicle(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const rawData = {
        brand: formData.get("brand"),
        model: formData.get("model"),
        year: formData.get("year"),
        price: formData.get("price"),
        mileage: formData.get("mileage"),
        fuel: formData.get("fuel"),
        transmission: formData.get("transmission"),
        body_type: formData.get("body_type"),
        color: formData.get("color"),
        power_hp: formData.get("power_hp"),
        description: formData.get("description"),
        featured: formData.get("featured") === "true",
    }

    const result = vehicleSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Validation failed" }
    }

    // Generate Translations (always regenerate on update for now to ensure sync)
    // Could optimize to check if description changed.
    let translations = {}
    if (result.data.description) {
        translations = await generateVehicleTranslations(result.data.description)
    }

    // --- Image Logic ---

    // 1. Get current vehicle data to know what images existed before
    const { data: currentVehicle, error: fetchError } = await supabase
        .from("vehicles")
        .select("images")
        .eq("id", id)
        .single()

    if (fetchError || !currentVehicle) return { error: "Vehicle not found" }

    const dbImages: string[] = (currentVehicle.images as unknown as string[]) || []

    // 2. Identify images kept by user (sent as strings)
    const keptImages = formData.getAll("existing_images") as string[]

    // 3. Identify deleted images (in DB but not in keptImages) and delete from disk
    const imagesToDelete = dbImages.filter(img => !keptImages.includes(img))

    // Clean up deleted files asynchronously (don't block response too much)
    Promise.allSettled(imagesToDelete.map(path => deleteLocalFile(path)))

    // 4. Handle New Uploads
    const imageFiles = formData.getAll("image_files") as File[]
    const newImageUrls: string[] = []

    for (const file of imageFiles) {
        if (file.size > 0) {
            try {
                const url = await saveLocalFile(file)
                newImageUrls.push(url)
            } catch (e) {
                console.error("Upload error", e)
                return { error: "Failed to save new images" }
            }
        }
    }

    const finalImages = [...keptImages, ...newImageUrls]

    const { error } = await supabase
        .from("vehicles")
        .update({
            ...result.data,
            translations, // Update translations
            images: finalImages
        })
        .eq("id", id)

    if (error) return { error: error.message }

    revalidatePath("/inventory")
    revalidatePath(`/vehicle/${id}`)
    revalidatePath("/admin")
    return redirect("/admin")
}


export async function deleteVehicle(id: string) {
    const supabase = await createClient()

    // Get vehicle first to find images
    const { data: vehicle, error: fetchError } = await supabase
        .from("vehicles")
        .select("images")
        .eq("id", id)
        .single()

    if (!vehicle) return { error: "Vehicle not found" }

    // Delete files from disk
    const images: string[] = (vehicle.images as unknown as string[]) || []
    await Promise.allSettled(images.map(path => deleteLocalFile(path)))

    // Delete record
    const { error } = await supabase.from("vehicles").delete().eq("id", id)
    if (error) return { error: error.message }

    revalidatePath("/inventory")
    revalidatePath("/admin")
}

// --- Contact Actions ---

import nodemailer from "nodemailer"

const inquirySchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(10, "Message must be at least 10 characters")
})

export async function sendInquiry(prevState: any, formData: FormData) {
    const rawData = {
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        email: formData.get("email"),
        message: formData.get("message"),
    }

    const result = inquirySchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Validation failed", issues: result.error.flatten() }
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const mailOptions = {
            from: process.env.SMTP_USER, // Sender address
            to: "sergiocastillaroncel@gmail.com", // Receiver address
            subject: `New Inquiry from ${result.data.firstName} ${result.data.lastName}`,
            text: `
Name: ${result.data.firstName} ${result.data.lastName}
Email: ${result.data.email}

Message:
${result.data.message}
            `,
            html: `
<h3>New Inquiry from Website</h3>
<p><strong>Name:</strong> ${result.data.firstName} ${result.data.lastName}</p>
<p><strong>Email:</strong> ${result.data.email}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${result.data.message.replace(/\n/g, '<br>')}</p>
            `,
        }

        await transporter.sendMail(mailOptions)

        return { success: "Message sent successfully!" }
    } catch (error) {
        console.error("Email error:", error)
        return { error: "Failed to send email. Please try again later." }
    }
}
