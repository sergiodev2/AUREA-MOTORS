"use client"

import { useActionState } from "react"
import { signIn } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

const initialState = {
    error: '',
}

export default function LoginPage() {
    // We modify signIn to return state compatible with useActionState
    // However, since signIn in actions.ts is specialized, let's wrap it or accept the current behavior.
    // simpler fix for build error: standard form submission without useActionState for now, 
    // BUT we need to handle the return type mismatch.
    // Best approach: "use client" and standard client-side submission calling the action.

    // Let's stick to the server action pattern but fix the type consumption.
    // Actually, `action={signIn}` expects `(formData: FormData) => void | Promise<void>`.
    // Our `signIn` returns `Promise<{error: string} | void | never>`. 
    // This return type is what triggers the error.

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <h1 className="text-2xl font-serif text-center">Aurea Access</h1>
                    <p className="text-center text-sm text-muted-foreground">Authorized personnel only.</p>
                </CardHeader>
                <form action={async (formData) => {
                    const result = await signIn(formData)
                    if (result?.error) {
                        alert(result.error) // Rudimentary error handling for MVP
                    }
                }}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" placeholder="admin@aureamotors.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Sign In</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
