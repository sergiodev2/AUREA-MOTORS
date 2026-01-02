"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function VehicleFilters({
    onSearch,
    onFilterChange
}: {
    onSearch: (term: string) => void
    onFilterChange: (key: string, value: any) => void
}) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 font-serif text-lg font-medium">Search</h3>
                <Input
                    placeholder="Brand or model..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="bg-secondary/20 border-white/10"
                />
            </div>

            <div>
                <h3 className="mb-4 font-serif text-lg font-medium">Price Range</h3>
                <div className="flex gap-2">
                    <Input
                        placeholder="Min"
                        type="number"
                        className="bg-secondary/20 border-white/10"
                        onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        className="bg-secondary/20 border-white/10"
                        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-4 font-serif text-lg font-medium">Year</h3>
                <div className="flex gap-2">
                    <Input
                        placeholder="From"
                        type="number"
                        className="bg-secondary/20 border-white/10"
                        onChange={(e) => onFilterChange('minYear', e.target.value)}
                    />
                    <Input
                        placeholder="To"
                        type="number"
                        className="bg-secondary/20 border-white/10"
                        onChange={(e) => onFilterChange('maxYear', e.target.value)}
                    />
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()} // Reset for MVP simplicity
            >
                Reset Filters
            </Button>
        </div>
    )
}
