import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VehicleCard } from "@/components/vehicle/VehicleCard"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase-server"
import type { Vehicle } from "@/types"

export const revalidate = 0 // Dynamic

export default async function Home() {
  const supabase = await createClient()
  const { data: featuredVehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('featured', true)
    .limit(3) as { data: Vehicle[] | null }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black">
          {/* Placeholder for Hero Video or Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            AUREA MOTORS
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Where luxury meets performance. Experience the finest collection of automotive engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
            <Button size="lg" variant="luxury" asChild>
              <Link href="/inventory" className="text-lg px-8">Explorar Colección</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/contact" className="text-lg px-8">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 px-4 container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl font-medium mb-2">Featured Collection</h2>
            <p className="text-muted-foreground">Curated vehicles for the discerning driver.</p>
          </div>
          <Button variant="link" asChild className="hidden md:flex">
            <Link href="/inventory">View All Inventory <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles && featuredVehicles.length > 0 ? (
            featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          ) : (
            // Fallback if no entries yet (or error)
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] w-full rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground">
                Add vehicles to database to see featured items.
              </div>
            ))
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button variant="link" asChild>
            <Link href="/inventory">View All Inventory <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-secondary/10 border-y border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif">1</div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Financing</h3>
              <p className="text-muted-foreground">Tailored financial solutions to make your dream car a reality, with competitive rates and flexible terms.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif">2</div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Warranty</h3>
              <p className="text-muted-foreground">Comprehensive warranty packages providing peace of mind for every mile of your journey.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif">3</div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Trade-In</h3>
              <p className="text-muted-foreground">Fair and transparent valuation for your current vehicle, ensuring a seamless upgrade process.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
