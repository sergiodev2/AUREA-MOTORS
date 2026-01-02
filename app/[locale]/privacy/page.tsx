import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                    <p className="lead text-xl text-white mb-8">
                        At Aurea Motors, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">1. Information We Collect</h2>
                    <p>We collect information that you provide directly to us, such as when you:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Fill out a contact form or inquiry</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Schedule a test drive or viewing</li>
                        <li>Communicate with us via email or phone</li>
                    </ul>
                    <p>This information may include your name, email address, phone number, and any other details you choose to provide.</p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Respond to your inquiries and provide customer support</li>
                        <li>Process your requests for vehicle viewings or services</li>
                        <li>Send you updates, newsletters, and promotional materials (you can opt-out at any time)</li>
                        <li>Improve our website and services</li>
                    </ul>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">3. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">4. Third-Party Services</h2>
                    <p>
                        Our website may contain links to third-party websites or services (e.g., Google Maps, social media). We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact us at <a href="mailto:concierge@aureamotors.com" className="text-primary hover:underline">concierge@aureamotors.com</a>.
                    </p>

                    <h2 className="text-white mt-12 mb-4 text-2xl font-serif">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <p>
                        <strong>Aurea Motors</strong><br />
                        Kupferstraße 24, 33378 Rheda-Wiedenbrück, Germany<br />
                        Email: concierge@aureamotors.com
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    )
}
