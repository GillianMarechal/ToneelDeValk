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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Simplified */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src={logoPath} 
              alt="De Valk Logo" 
              className="w-20 h-20 mx-auto mb-8 opacity-90"
            />
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl lg:text-7xl font-light mb-6 text-gray-900 tracking-wide">
            DE VALK
          </h1>
          <p className="text-xl lg:text-2xl font-light mb-16 text-gray-600">
            Toneelvereniging sinds 1885
          </p>
          
          {/* Current Production */}
          <div className="mb-16 border-t border-gray-200 pt-16">
            <div className="mb-8">
              <span className="text-sm uppercase tracking-wider text-gray-500 mb-4 block">
                Nu te zien
              </span>
              <h2 className="text-3xl lg:text-4xl font-light mb-4 text-gray-900">
                Olifantman
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Een ontroerende voorstelling over moed, vriendschap en het accepteren van verschillen
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 font-light rounded-none border-0 transition-colors duration-200"
            >
              Tickets bestellen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/productions">
              <div className="group cursor-pointer bg-white p-8 hover:bg-gray-900 transition-colors duration-300">
                <h3 className="text-xl font-light mb-3 text-gray-900 group-hover:text-white">
                  Voorstellingen
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">
                  Bekijk ons repertoire en komende producties
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </div>
            </Link>

            <Link href="/about">
              <div className="group cursor-pointer bg-white p-8 hover:bg-gray-900 transition-colors duration-300">
                <h3 className="text-xl font-light mb-3 text-gray-900 group-hover:text-white">
                  Over ons
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">
                  Ontdek onze geschiedenis sinds 1885
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </div>
            </Link>

            <Link href="/contact">
              <div className="group cursor-pointer bg-white p-8 hover:bg-gray-900 transition-colors duration-300">
                <h3 className="text-xl font-light mb-3 text-gray-900 group-hover:text-white">
                  Contact
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">
                  Neem contact met ons op
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News - Simplified */}
      {featuredNews && featuredNews.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light mb-4 text-gray-900">
                Nieuws
              </h2>
            </div>

            <div className="space-y-8">
              {featuredNews.slice(0, 3).map((article) => (
                <article key={article.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-light mb-2 text-gray-900">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
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
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none">
                  Meer nieuws
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}