import { HeroSection } from "@/components/hero-section"
import { PetListings } from "@/components/pet-listings"
import { AdoptionBanner } from "@/components/adoption-banner"
import { KnowledgeSection } from "@/components/knowledge-section"
import { Newsletter } from "@/components/newsletter"

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <PetListings />
      <AdoptionBanner />
      <KnowledgeSection />
      <Newsletter />
    </div>
  )
}

