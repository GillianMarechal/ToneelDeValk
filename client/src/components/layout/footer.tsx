import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Over Ons", href: "/about" },
    { name: "Huidige Shows", href: "/productions" },
    { name: "Cast & Crew", href: "/cast" },
    { name: "Nieuws", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Kaartreservering", href: "/contact" },
    { name: "Groepsarrangementen", href: "/contact" },
    { name: "Lid Worden", href: "/contact" },
    { name: "Workshops", href: "/contact" },
    { name: "Verhuur Locatie", href: "/contact" },
  ];

  return (
    <footer className="bg-theatre-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-playfair font-bold mb-4">Toneelgroep De Valk</h3>
            <p className="text-gray-300 mb-4">
              Sinds 1985 brengen wij kwaliteitstheater naar onze gemeenschap met passie en toewijding.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-theatre-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-theatre-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-theatre-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-theatre-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-4">Snelle Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-theatre-gold transition-colors">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href}>
                    <a className="text-gray-300 hover:text-theatre-gold transition-colors">
                      {service.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Voor repetitieschema en<br />
                  contactgegevens, bel of mail ons
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  Contacteer ons voor meer informatie
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@toneelgroepdevalk.nl" className="text-sm hover:text-theatre-gold transition-colors">
                  info@toneelgroepdevalk.nl
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p className="text-sm">
            &copy; 2024 Toneelgroep De Valk. Alle rechten voorbehouden. | 
            <a href="#" className="hover:text-theatre-gold transition-colors ml-1">Privacy Beleid</a> | 
            <a href="#" className="hover:text-theatre-gold transition-colors ml-1">Algemene Voorwaarden</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
