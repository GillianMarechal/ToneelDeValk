import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/logodevalk_1750106393368.png";
import type { Production, NewsArticle } from "@shared/schema";

export default function Home() {
  const { data: productions, isLoading: productionsLoading } = useQuery<Production[]>({
    queryKey: ["/api/productions"],
  });

  const { data: featuredNews, isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news/featured"],
  });

  const currentProductions = productions?.filter((p: Production) => p.status === 'current') || [];
  const upcomingProductions = productions?.filter((p: Production) => p.status === 'upcoming') || [];

  return (
    <div className="min-h-screen bg-theatre-cream">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src={logoPath} 
              alt="De Valk Logo" 
              className="w-24 h-24 mx-auto mb-8 filter drop-shadow-md"
            />
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl lg:text-7xl font-playfair font-light mb-6 text-theatre-navy tracking-wide">
            DE VALK
          </h1>
          <p className="text-xl lg:text-2xl font-light mb-16 text-theatre-charcoal">
            Koninklijke Toneelvereniging sinds 1885
          </p>
          
          {/* Current Production */}
          <div className="mb-16 border-t border-theatre-navy/20 pt-16">
            <div className="mb-8">
              <span className="text-sm uppercase tracking-wider text-theatre-gold mb-4 block font-medium">
                Nu op de planken
              </span>
              <h2 className="text-3xl lg:text-4xl font-playfair font-light mb-4 text-theatre-navy">
                Olifantman
              </h2>
              <p className="text-lg text-theatre-charcoal mb-8 max-w-2xl mx-auto leading-relaxed">
                Een ontroerende voorstelling over moed, vriendschap en het accepteren van verschillen
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-theatre-gold hover:bg-theatre-gold/90 text-theatre-navy px-8 py-3 font-medium rounded-lg shadow-lg transition-all duration-200"
            >
              Bestel Tickets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/productions">
              <a className="group cursor-pointer bg-theatre-cream p-8 hover:bg-theatre-navy transition-colors duration-300 block rounded-lg shadow-sm">
                <h3 className="text-xl font-playfair font-light mb-3 text-theatre-navy group-hover:text-theatre-cream">
                  Voorstellingen
                </h3>
                <p className="text-theatre-charcoal group-hover:text-theatre-cream/90 mb-4">
                  Bekijk ons repertoire en komende producties
                </p>
                <ArrowRight className="h-5 w-5 text-theatre-gold group-hover:text-theatre-gold" />
              </a>
            </Link>

            <Link href="/about">
              <a className="group cursor-pointer bg-theatre-cream p-8 hover:bg-theatre-navy transition-colors duration-300 block rounded-lg shadow-sm">
                <h3 className="text-xl font-playfair font-light mb-3 text-theatre-navy group-hover:text-theatre-cream">
                  Over ons
                </h3>
                <p className="text-theatre-charcoal group-hover:text-theatre-cream/90 mb-4">
                  Ontdek onze geschiedenis sinds 1885
                </p>
                <ArrowRight className="h-5 w-5 text-theatre-gold group-hover:text-theatre-gold" />
              </a>
            </Link>

            <Link href="/contact">
              <a className="group cursor-pointer bg-theatre-cream p-8 hover:bg-theatre-navy transition-colors duration-300 block rounded-lg shadow-sm">
                <h3 className="text-xl font-playfair font-light mb-3 text-theatre-navy group-hover:text-theatre-cream">
                  Contact
                </h3>
                <p className="text-theatre-charcoal group-hover:text-theatre-cream/90 mb-4">
                  Neem contact met ons op
                </p>
                <ArrowRight className="h-5 w-5 text-theatre-gold group-hover:text-theatre-gold" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && featuredNews.length > 0 && (
        <section className="py-16 bg-theatre-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-light mb-4 text-theatre-navy">
                Nieuws
              </h2>
            </div>

            <div className="space-y-8">
              {featuredNews.slice(0, 3).map((article: NewsArticle) => (
                <article key={article.id} className="border-b border-theatre-navy/20 pb-8 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-playfair font-light mb-2 text-theatre-navy">
                        {article.title}
                      </h3>
                      <p className="text-theatre-charcoal mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-theatre-gold">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(article.date).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/news">
                <a>
                  <Button variant="outline" className="border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-theatre-cream rounded-lg">
                    Meer nieuws
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}