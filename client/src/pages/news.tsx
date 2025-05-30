import { useQuery } from "@tanstack/react-query";
import { type NewsArticle } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import NewsArticleCard from "@/components/news-article";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Award, Users, Info } from "lucide-react";

export default function News() {
  const [filter, setFilter] = useState<string>("all");
  
  const { data: articles, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const filteredArticles = articles?.filter(article => {
    if (filter === "all") return true;
    return article.category.toLowerCase() === filter;
  }) || [];

  const categories = Array.from(new Set(articles?.map(article => article.category) || []));

  return (
    <>
      <SEOHead 
        title="Nieuws & Updates | Toneelgroep De Valk"
        description="Blijf op de hoogte van het laatste nieuws van Toneelgroep De Valk. Lees over onze nieuwe producties, recensies, prijzen en backstage verhalen."
        keywords="theater nieuws, recensies, theater updates, audities, De Valk nieuws"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Nieuws & Updates
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            Blijf op de hoogte van onze nieuwste ontwikkelingen, recensies en backstage verhalen
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              className={filter === "all" ? "bg-theatre-navy text-white" : "border-theatre-navy text-theatre-navy hover:bg-theatre-navy hover:text-white"}
            >
              <Info className="w-4 h-4 mr-2" />
              Alle Nieuws
            </Button>
            {categories.map((category) => {
              const icon = category === "Recensies" ? Award : 
                          category === "Audities" ? Users : Calendar;
              const IconComponent = icon;
              
              return (
                <Button
                  key={category}
                  onClick={() => setFilter(category.toLowerCase())}
                  variant={filter === category.toLowerCase() ? "default" : "outline"}
                  className={filter === category.toLowerCase() ? 
                    "bg-theatre-red text-white" : 
                    "border-theatre-red text-theatre-red hover:bg-theatre-red hover:text-white"
                  }
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {articles && articles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold text-theatre-navy mb-4">
                Uitgelicht Artikel
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-theatre-navy to-theatre-red text-white rounded-xl p-8 md:p-12">
                <div className="flex items-center text-theatre-gold text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{articles[0].date}</span>
                  <span className="mx-2">•</span>
                  <span>{articles[0].category}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                  {articles[0].title}
                </h3>
                <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <Button className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy">
                  Lees Volledig Artikel
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Articles Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-theatre-navy mb-4">
              Alle Artikelen
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-16 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <NewsArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-playfair font-bold text-theatre-navy mb-4">
                Geen artikelen gevonden
              </h3>
              <p className="text-theatre-charcoal">
                Er zijn momenteel geen nieuws artikelen in deze categorie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-theatre-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Mis Geen Enkel Nieuws
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Abonneer u op onze nieuwsbrief en ontvang als eerste updates over 
            nieuwe producties, audities en bijzondere gebeurtenissen.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Uw email adres"
              className="flex-1 px-4 py-3 rounded-lg text-theatre-navy"
            />
            <Button className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy px-6">
              Aanmelden
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
