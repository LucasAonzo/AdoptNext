import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface ArticleCardProps {
  id: string
  title: string
  category: string
  image: string
}

export function ArticleCard({ id, title, category, image }: ArticleCardProps) {
  return (
    <Link href={`/knowledge/${id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-adopt-purple-100 rounded-xl hover:border-adopt-purple-200 bg-white">
        <div className="relative h-56 w-full overflow-hidden">
          <Image 
            src={image || "/placeholder.svg"} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-adopt-purple-900/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white px-3 py-1 uppercase text-xs tracking-wide font-medium">
              {category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-adopt-gray-800 text-lg leading-tight mb-2 group-hover:text-adopt-purple-600 transition-colors duration-200">
            {title}
          </h3>
          <div className="flex items-center mt-4">
            <div className="w-8 h-8 rounded-full bg-adopt-purple-100 flex items-center justify-center text-adopt-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20M12 2v20"/>
              </svg>
            </div>
            <span className="ml-2 text-sm text-adopt-gray-600">Leer artículo</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


