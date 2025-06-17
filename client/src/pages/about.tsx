import SEOHead from "@/components/seo-head";
import { Calendar, Users, Award, Heart, Star, Globe } from "lucide-react";

export default function About() {
  return (
    <>
      <SEOHead 
        title="Over Ons | Toneelgroep De Valk"
        description="Leer meer over de geschiedenis, missie en visie van Toneelgroep De Valk. Sinds 1885 brengen wij kwaliteitstheater naar onze gemeenschap."
        keywords="theater geschiedenis, toneelgroep missie, theater gemeenschap, De Valk over ons"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Over Toneelgroep De Valk
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            Een verhaal van passie, toewijding en de kracht van theater om gemeenschappen samen te brengen
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-theatre-navy mb-6">
                Ons Verhaal
              </h2>
              <p className="text-lg text-theatre-charcoal mb-6 leading-relaxed">
                Toneelgroep De Valk werd opgericht in 1885 door een groep gepassioneerde theaterliefhebbers 
                die geloofden in de transformerende kracht van live theater. Wat begon als een kleine gemeenschapsgroep 
                is uitgegroeid tot een gerespecteerde theaterorganisatie die bekend staat om haar artistieke excellentie 
                en toegankelijke programmering.
              </p>
              <p className="text-lg text-theatre-charcoal mb-6 leading-relaxed">
                Door de jaren heen hebben we ons toegelegd op het brengen van zowel klassieke meesterwerken als 
                eigentijdse stukken, altijd met respect voor de tekst en een diep begrip van de menselijke conditie. 
                Onze producties streven ernaar om het publiek te raken, uit te dagen en te inspireren.
              </p>
              <p className="text-lg text-theatre-charcoal leading-relaxed">
                Vandaag de dag zijn we trots op onze reputatie als een van de vooraanstaande amateur-theatergroepen 
                in de regio, met een actieve rol in de culturele gemeenschap en een voortdurende commitment aan 
                artistieke groei en maatschappelijke betrokkenheid.
              </p>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Historic theatre performance from our early years" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-theatre-navy mb-4">
              Onze Missie & Visie
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-theatre-red mr-4" />
                <h3 className="text-2xl font-playfair font-bold text-theatre-navy">Onze Missie</h3>
              </div>
              <p className="text-theatre-charcoal leading-relaxed">
                Theater toegankelijk maken voor iedereen door het brengen van kwaliteitsvoorstellingen 
                die zowel vermaken als inspireren. We streven ernaar om een inclusieve gemeenschap te creëren 
                waar kunst en cultuur floreren, en waar zowel kunstenaars als publiek kunnen groeien en worden geraakt 
                door de kracht van live theater.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-theatre-gold mr-4" />
                <h3 className="text-2xl font-playfair font-bold text-theatre-navy">Onze Visie</h3>
              </div>
              <p className="text-theatre-charcoal leading-relaxed">
                Een toonaangevende theatergroep zijn die bekend staat om artistieke excellentie, 
                innovatie en maatschappelijke betrokkenheid. We willen een brug slaan tussen tradicionele en 
                hedendaagse theatervormen, en een platform bieden waar nieuwe talenten kunnen opbloeien 
                en waar ervaren kunstenaars hun passie kunnen delen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-theatre-navy mb-4">
              Onze Kernwaarden
            </h2>
            <p className="text-xl text-theatre-charcoal max-w-3xl mx-auto">
              De principes die ons leiden in alles wat we doen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-theatre-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Passie</h3>
              <p className="text-theatre-charcoal">
                Onze liefde voor theater drijft ons om altijd het beste van onszelf te geven en 
                het publiek te raken met authentieke emoties.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-theatre-gold text-theatre-navy w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Excellentie</h3>
              <p className="text-theatre-charcoal">
                We streven naar de hoogste artistieke standaarden in elke productie, 
                van script tot uitvoering.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-theatre-navy text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Inclusiviteit</h3>
              <p className="text-theatre-charcoal">
                Theater is voor iedereen. We verwelkomen alle mensen, ongeacht achtergrond, 
                in onze theaterervaring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-theatre-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Onze Impact in Cijfers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bijna anderhalve eeuw van theatermagie
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-theatre-gold mb-2">139+</div>
              <div className="text-lg text-gray-300 mb-2">Jaar Ervaring</div>
              <p className="text-sm text-gray-400">Sinds onze oprichting in 1885</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-theatre-gold mb-2">200+</div>
              <div className="text-lg text-gray-300 mb-2">Producties</div>
              <p className="text-sm text-gray-400">Van klassiek tot hedendaags</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-theatre-gold mb-2">75K+</div>
              <div className="text-lg text-gray-300 mb-2">Bezoekers</div>
              <p className="text-sm text-gray-400">Die genoten van onze voorstellingen</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-theatre-gold mb-2">15+</div>
              <div className="text-lg text-gray-300 mb-2">Actieve Leden</div>
              <p className="text-sm text-gray-400">Getalenteerde kunstenaars en crew</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold text-theatre-navy mb-6">
            Wordt Deel van Onze Familie
          </h2>
          <p className="text-xl text-theatre-charcoal mb-8">
            Of je nu ervaring hebt of gewoon gepassioneerd bent over theater, 
            er is een plek voor jou bij Toneelgroep De Valk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-theatre-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Word Lid
            </button>
            <button className="border-2 border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Meer Informatie
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
