import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function TermsPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Terms of Service</h1>
                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                    <p className="lead text-xl text-white mb-8">
                        Welcome to Aurea Motors. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">1. Acceptance of Terms</h2>
                    <p>
                        By accessing this website, you confirm that you have read, understood, and agreed to these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">2. Use of the Website</h2>
                    <p>
                        You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">3. Vehicle Information</h2>
                    <p>
                        While we strive to ensure that the information on this website is accurate, complete, and up-to-date, we cannot guarantee that all vehicle descriptions, prices, specifications, or other content are error-free. All vehicles are subject to prior sale. We reserve the right to correct any errors or omissions and to change or update information at any time without prior notice.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">4. Intellectual Property</h2>
                    <p>
                        The content, layout, design, data, databases, and graphics on this website are protected by intellectual property laws and are owned by Aurea Motors or its licensors. You may not reproduce, download, transmit, or distribute any part of this website without our prior written permission.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">5. Limitation of Liability</h2>
                    <p>
                        Aurea Motors shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, this website. This includes damages to, or viruses that may infect, your computer equipment or other property.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">6. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">7. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these specific terms at any time. Your continued use of the website following any changes indicates your acceptance of the new Terms of Service.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:concierge@aureamotors.com" className="text-primary hover:underline">concierge@aureamotors.com</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    )
}
