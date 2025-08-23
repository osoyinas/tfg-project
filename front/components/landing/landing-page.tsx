"use client"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { useKeycloak } from "../keycloak-provider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function LandingPage() {
    const {initialized, authenticated} = useKeycloak()
    const router = useRouter()
    useEffect(
        () => {
            if (initialized && authenticated) {
                // Redirigir a la página de inicio de sesión si no está autenticado
                router.push("/movies");
            }
        },
        [initialized, authenticated]
    )
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
