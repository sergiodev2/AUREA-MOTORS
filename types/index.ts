export type Vehicle = {
    id: string
    brand: string
    model: string
    year: number
    price: number
    mileage: number
    fuel: string
    transmission: string
    body_type: string
    color: string
    power_hp: number | null
    description: string | null
    featured: boolean
    images: string[]
    created_at: string
}

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at'>

export type VehicleFilters = {
    brand?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    maxMileage?: number
    bodyType?: string
}
