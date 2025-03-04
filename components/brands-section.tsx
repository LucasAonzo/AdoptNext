import Image from "next/image"

export function BrandsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-2">Proud to be part of</p>
          <h3 className="text-2xl font-bold text-monito-blue">Pet Sellers</h3>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-24 md:w-32 h-16 relative">
              <Image src={`/placeholder-logo.svg`} alt={`Brand logo ${i}`} fill className="object-contain" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="text-monito-blue font-medium hover:underline">View all our sellers →</button>
        </div>
      </div>
    </section>
  )
}

