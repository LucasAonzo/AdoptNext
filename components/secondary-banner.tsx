import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SecondaryBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-monito-blue rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">One More Friend</h2>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Thousands More Fun!</h3>
              <p className="text-white/80 mb-8">
                Having a pet means you have more joy, a new friend, a happy person who will always be with you to have
                fun. We have 200+ different pets that can meet your needs!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-monito-yellow text-monito-blue hover:bg-monito-yellow/90 rounded-full">
                  Explore Now
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10 rounded-full">
                  View Intro
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <Image src="/placeholder.svg?height=400&width=500" alt="Person with dog" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

