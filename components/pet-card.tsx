import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface PetCardProps {
  id: string
  name: string
  breed: string
  gender: string
  age: string
  image: string
}

// Map of real pet images by breed (simplified for demo)
const petImages = {
  "Pomeranian White": "https://images.unsplash.com/photo-1637622709915-350e756f4a4a?q=80&w=600&auto=format&fit=crop",
  "Poodle Tiny Yellow": "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?q=80&w=600&auto=format&fit=crop",
  "Poodle Tiny Sepia": "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=600&auto=format&fit=crop",
  "Alaskan Malamute Grey": "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=600&auto=format&fit=crop",
  "Pembroke Corgi Brown": "https://images.unsplash.com/photo-1612536057832-2ff7e6f7a526?q=80&w=600&auto=format&fit=crop",
  "Poodle Tiny Apricot": "https://images.unsplash.com/photo-1594922009922-d1665ed9b32d?q=80&w=600&auto=format&fit=crop",
  "Poodle Tiny Grey Cow": "https://images.unsplash.com/photo-1583512603834-01a3a1e56241?q=80&w=600&auto=format&fit=crop",
}

export function PetCard({ id, name, breed, gender, age, image }: PetCardProps) {
  // Use real pet image based on breed if available, otherwise fallback to provided image
  const petImage = petImages[breed as keyof typeof petImages] || image

  return (
    <Card className="overflow-hidden card-hover bg-white border-0 rounded-xl shadow-card group">
      <div className="relative h-56 w-full">
        <Image 
          src={petImage} 
          alt={`${name} - ${breed}`} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={id === "1" || id === "2"}
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${gender === 'Male' ? 'badge-secondary' : 'badge-primary'}`}>
            {gender}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-adopt-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <CardContent className="p-4 relative">
        <h3 className="font-bold text-adopt-gray-900 text-xl">
          {name}
        </h3>
        <p className="text-adopt-purple-600 font-medium">{breed}</p>
        <div className="text-sm text-adopt-gray-500 mt-2 flex items-center gap-1">
          <span className="inline-flex items-center rounded-full bg-adopt-purple-50 px-2 py-1 text-xs font-medium text-adopt-purple-700">
            {age}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="primary" 
          className="w-full transition-all shadow-sm hover:shadow-purple"
          asChild
        >
          <Link href={`/pets/${id}`} className="inline-flex items-center justify-center gap-2">
            <span>Ver detalles</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[1px]">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

