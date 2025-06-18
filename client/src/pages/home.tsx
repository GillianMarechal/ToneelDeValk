import HeroSection from "@/components/hero-section";
import SEOHead from "@/components/seo-head";
import ShowPopup from "@/components/show-popup";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Users, Award } from "lucide-react";

export default function Home() {
  const currentShow = {
    title: "De Olifantman",
    description: "Een ontroerende voorstelling over moed, vriendschap en het overwinnen van je grootste angsten. Deze productie toont hoe we allemaal een beetje olifantman in ons hebben.",
    dates: "21, 22, 28 en 29 november 2025 - 20 uur",
    genre: "Drama/Familie"
  };

  return (
    <>
      <SEOHead 
        title="Toneelgroep De Valk | Professioneel Theater"
        description="Toneelgroep De Valk - Een gepassioneerde lokale theatergroep die kwaliteitsvoorstellingen brengt sinds 1885. Ontdek onze huidige producties en toekomstige shows."
        keywords="theater, toneelgroep, voorstellingen, toneel, cultuur, kunst, De Valk"
      />

      <ShowPopup show={currentShow} />
      <HeroSection />

      {/* Simplified Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-theatre-navy mb-6">
            Welkom bij Toneelgroep De Valk
          </h2>
          <p className="text-lg text-theatre-charcoal mb-8 leading-relaxed">
            Sinds 1885 brengt onze koninklijke toneelvereniging kwaliteitsvoorstellingen 
            naar de gemeenschap. Ontdek onze huidige productie "De Olifantman" en laat je verbazen 
            door de magie van live theater.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4">
              <Calendar className="w-8 h-8 text-theatre-gold mx-auto mb-2" />
              <div className="font-semibold text-theatre-navy">Sinds 1885</div>
              <div className="text-sm text-theatre-charcoal">Koninklijke Status</div>
            </div>
            <div className="text-center p-4">
              <Users className="w-8 h-8 text-theatre-gold mx-auto mb-2" />
              <div className="font-semibold text-theatre-navy">De Olifantman</div>
              <div className="text-sm text-theatre-charcoal">November 2025</div>
            </div>
            <div className="text-center p-4">
              <Award className="w-8 h-8 text-theatre-gold mx-auto mb-2" />
              <div className="font-semibold text-theatre-navy">Verwondering</div>
              <div className="text-sm text-theatre-charcoal">Onze Missie</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/productions">
              <Button size="lg" className="bg-theatre-navy hover:bg-theatre-navy/90 text-white">
                Bekijk Voorstellingen
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white">
                Meer Over Ons
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}