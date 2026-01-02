"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from "next-intl"

export function Navbar() {
    const t = useTranslations('Navbar');
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)

    const NAV_ITEMS = [
        { label: t('collection'), href: "/inventory" },
        { label: t('services'), href: "/#services" },
        { label: t('contact'), href: "/contact" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold tracking-tighter text-foreground">
                        AUREA<span className="text-primary">.</span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="ml-4">
                        <LanguageSwitcher />
                    </div>
                </nav>
                {/* Mobile Menu Placeholder */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher />
                    <button onClick={() => setIsOpen(!isOpen)} className="text-sm font-mono text-muted-foreground">
                        {isOpen ? "CLOSE" : "MENU"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-background border-b border-white/5 p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-primary py-2",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
