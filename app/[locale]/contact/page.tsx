"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Phone } from "lucide-react"
import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"

export default function ContactPage() {
    const t = useTranslations('Contact')
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setStatus(null)
        const form = event.currentTarget
        const formData = new FormData(form)

        formData.append("access_key", "8385ce72-8ae5-41a8-a49f-6e7cdf57d5a9")

        startTransition(async () => {
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })

                const data = await response.json()

                if (data.success) {
                    setStatus({ type: 'success', message: t('success') })
                    form.reset()
                } else {
                    setStatus({ type: 'error', message: t('error') })
                }
            } catch (error) {
                setStatus({ type: 'error', message: t('error') })
            }
        })
    }

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-12">
                <h1 className="font-serif text-4xl text-center mb-12">{t('title')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="space-y-8">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2465.5682547026663!2d8.355694212617305!3d51.83231697177177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba2eeb6efe3ec5%3A0x67f31c264cb72a07!2sKupferstra%C3%9Fe%2024%2C%2033378%20Rheda-Wiedenbr%C3%BCck%2C%20Alemania!5e0!3m2!1ses!2ses!4v1767343380421!5m2!1ses!2ses"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-bold">{t('showroom')}</h3>
                                <p className="text-muted-foreground text-sm">
                                    Kupferstraße 24<br />
                                    33378 Rheda-Wiedenbrück<br />
                                    Germany
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold">{t('contact_info')}</h3>
                                <p className="text-muted-foreground text-sm">
                                    +34 685 81 81 68<br />
                                    concierge@aureamotors.com
                                </p>
                                <Button className="w-full sm:w-auto mt-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none" asChild>
                                    <a href="https://wa.me/+34685818168" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        {t('chat_whatsapp')}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Card className="p-8">
                        <h2 className="font-serif text-2xl mb-6">{t('form_title')}</h2>

                        {status && (
                            <div className={`p-4 mb-6 text-sm rounded ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                                {status.message}
                            </div>
                        )}

                        <form id="contact-form" onSubmit={onSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('first_name')}</label>
                                    <Input name="first_name" placeholder="John" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('last_name')}</label>
                                    <Input name="last_name" placeholder="Doe" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('email')}</label>
                                <Input name="email" type="email" placeholder="john@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('message')}</label>
                                <textarea
                                    name="message"
                                    required
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={t('message_placeholder')}
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                                {isPending ? t('sending') : t('submit')}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    )
}
