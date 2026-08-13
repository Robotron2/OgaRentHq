import HeroSection from '@/components/HowItWorks/HeroSection'
import ProblemSection from '@/components/HowItWorks/ProblemSection'
import SolutionSection from '@/components/HowItWorks/SolutionSection'
import EscrowJourney from '@/components/HowItWorks/EscrowJourney'
import BenefitsSection from '@/components/HowItWorks/BenefitsSection'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pb-24">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <EscrowJourney />
      <BenefitsSection />
      {/* Subsequent phases will go here */}
    </main>
  )
}
