import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function Footer() {
    const t = useTranslations('Footer');
    const nav = useTranslations('Navbar');

    return (
        <footer className="w-full border-t border-white/10 bg-black py-12 text-sm text-neutral-400">
            <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="mb-4 font-serif text-xl font-bold text-white">AUREA.</h3>
                    <p className="max-w-xs">
                        {t('about_desc')}
                    </p>
                </div>
                <div>
                    <h4 className="mb-4 font-bold text-white uppercase tracking-wider text-xs">{t('quick_links')}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/inventory" className="hover:text-primary transition-colors">{nav('collection')}</Link></li>
                        <li><Link href="/#services" className="hover:text-primary transition-colors">{nav('services')}</Link></li>
                        <li><Link href="/contact" className="hover:text-primary transition-colors">{nav('contact')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-bold text-white uppercase tracking-wider text-xs">{t('legal')}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">{t('terms')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-bold text-white uppercase tracking-wider text-xs">{t('contact')}</h4>
                    <p>London, UK</p>
                    <p>+34 685 81 81 68</p>
                    <p>concierge@aureamotors.com</p>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-neutral-600">
                © {new Date().getFullYear()} Aurea Motors. {t('rights')}
            </div>
        </footer>
    )
}
