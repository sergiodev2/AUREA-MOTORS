import { writeFile, unlink } from "node:fs/promises"
import { join } from "node:path"
import { cwd } from "node:process"

export async function saveLocalFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    // Path relative to public folder for serving
    const relativePath = `/uploads/${fileName}`

    // Absolute path for writing
    const absolutePath = join(cwd(), "public", "uploads", fileName)

    try {
        await writeFile(absolutePath, buffer)
        return relativePath
    } catch (error) {
        console.error("Error saving local file:", error)
        throw new Error("Failed to save file")
    }
}

export async function deleteLocalFile(relativePath: string): Promise<boolean> {
    try {
        // Sanitize path to prevent directory traversal
        if (relativePath.includes('..')) return false

        // Remove leading slash if present for joining
        const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath
        const absolutePath = join(cwd(), "public", cleanPath)

        await unlink(absolutePath)
        return true
    } catch (error) {
        // Ignore if file doesn't exist
        console.error("Error deleting local file:", error)
        return false
    }
}
