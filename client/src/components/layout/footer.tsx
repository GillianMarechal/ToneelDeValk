import { Link } from "wouter";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-theatre-navy py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-playfair font-light mb-4 text-theatre-cream">De Valk</h3>
            <p className="text-theatre-cream/80 mb-6 max-w-md">
              Koninklijke Toneelvereniging sinds 1885. Wij brengen kwaliteitstheater naar onze gemeenschap.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-playfair font-light mb-4 text-theatre-cream">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-theatre-gold" />
                <a href="mailto:info@toneeldevalk.be" className="text-theatre-cream/80 hover:text-theatre-gold transition-colors">
                  info@toneeldevalk.be
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-theatre-cream/20 mt-8 pt-8 text-center">
          <p className="text-sm text-theatre-cream/60">
            &copy; 2024 De Valk. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
