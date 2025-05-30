import SEOHead from "@/components/seo-head";
import ContactForm from "@/components/contact-form";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEOHead 
        title="Contact | Toneelgroep De Valk"
        description="Neem contact op met Toneelgroep De Valk voor kaartreservering, informatie over audities of algemene vragen. Wij helpen u graag verder."
        keywords="theater contact, kaartreservering, audities, theater informatie, De Valk contact"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Neem Contact Op
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            Vragen over voorstellingen, kaartverkoop of interesse om lid te worden? We horen graag van je!
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-theatre-navy mb-8">
                  Contactgegevens
                </h2>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-theatre-red text-white p-3 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-theatre-navy mb-2">Locatie</h3>
                  <p className="text-theatre-charcoal">
                    Cultureel Centrum De Bron<br />
                    Hoofdstraat 123<br />
                    1234 AB Voorbeeldstad
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-theatre-red text-white p-3 rounded-lg flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-theatre-navy mb-2">Telefoon</h3>
                  <p className="text-theatre-charcoal">
                    <a href="tel:+31123456789" className="hover:text-theatre-red transition-colors">
                      +31 (0)12 345 6789
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-theatre-red text-white p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-theatre-navy mb-2">Email</h3>
                  <p className="text-theatre-charcoal">
                    <a href="mailto:info@toneelgroepdevalk.nl" className="hover:text-theatre-red transition-colors">
                      info@toneelgroepdevalk.nl
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-theatre-red text-white p-3 rounded-lg flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-theatre-navy mb-2">Openingstijden Kassa</h3>
                  <p className="text-theatre-charcoal">
                    Maandag - Vrijdag: 19:00 - 21:00<br />
                    Weekend: 1 uur voor voorstelling<br />
                    <span className="text-sm text-gray-500">Of op afspraak</span>
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="font-playfair font-bold text-lg text-theatre-navy mb-4">Volg Ons</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-theatre-navy mb-4">
              Vind Ons
            </h2>
            <p className="text-theatre-charcoal">
              Ons theater is gevestigd in het hart van de stad, gemakkelijk bereikbaar met zowel auto als openbaar vervoer.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Interactieve kaart zou hier worden geladen</p>
                <p className="text-sm">Cultureel Centrum De Bron, Hoofdstraat 123, Voorbeeldstad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-theatre-gold text-theatre-navy w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Kaartreservering</h3>
              <p className="text-theatre-charcoal mb-4">
                Reserveer uw plaatsen telefonisch of via email. We helpen u graag bij het kiezen van de beste plaatsen.
              </p>
              <a href="tel:+31123456789" className="text-theatre-red hover:text-theatre-gold font-semibold">
                Bel Nu →
              </a>
            </div>

            <div className="text-center p-6">
              <div className="bg-theatre-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Algemene Informatie</h3>
              <p className="text-theatre-charcoal mb-4">
                Voor vragen over onze groep, audities of samenwerkingen kunt u ons altijd een email sturen.
              </p>
              <a href="mailto:info@toneelgroepdevalk.nl" className="text-theatre-red hover:text-theatre-gold font-semibold">
                Email Ons →
              </a>
            </div>

            <div className="text-center p-6">
              <div className="bg-theatre-navy text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-3">Bezoek Ons</h3>
              <p className="text-theatre-charcoal mb-4">
                Kom langs tijdens onze openingstijden of maak een afspraak. We geven graag een rondleiding door ons theater.
              </p>
              <a href="#" className="text-theatre-red hover:text-theatre-gold font-semibold">
                Afspraak Maken →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
