import HeroSection from '@/components/HowItWorks/HeroSection'
import ProblemSection from '@/components/HowItWorks/ProblemSection'
import SolutionSection from '@/components/HowItWorks/SolutionSection'
import EscrowJourney from '@/components/HowItWorks/EscrowJourney'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pb-24">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <EscrowJourney />
      {/* Subsequent phases will go here */}
    </main>
  )
}
