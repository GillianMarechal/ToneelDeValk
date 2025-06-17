import { Link } from "wouter";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-light mb-4 text-gray-900">De Valk</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Koninklijke Toneelvereniging sinds 1885. Wij brengen kwaliteitstheater naar onze gemeenschap.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-light mb-4 text-gray-900">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href="mailto:info@toneeldevalk.be" className="text-gray-600 hover:text-gray-900 transition-colors">
                  info@toneeldevalk.be
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 De Valk. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
