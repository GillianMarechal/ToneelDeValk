import { useQuery } from "@tanstack/react-query";
import { type GalleryImage } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Camera, Filter, Download } from "lucide-react";

export default function Gallery() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const filteredImages = images?.filter(image => {
    if (filter === "all") return true;
    return image.category.toLowerCase() === filter;
  }) || [];

  const categories = Array.from(new Set(images?.map(image => image.category) || []));

  return (
    <>
      <SEOHead 
        title="Galerij | Toneelgroep De Valk"
        description="Bekijk onze fotogalerij met impressies van voorstellingen, backstage momenten en bijzondere gebeurtenissen van Toneelgroep De Valk."
        keywords="theater foto's, galerij, voorstellingen, backstage, theaterbeelden, De Valk foto's"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-theatre-navy text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
            Foto Galerij
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto animate-slide-up">
            Een visuele reis door onze meest memorabele theatermomenten
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
              <Filter className="w-4 h-4 mr-2" />
              Alle Foto's
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category.toLowerCase())}
                variant={filter === category.toLowerCase() ? "default" : "outline"}
                className={filter === category.toLowerCase() ? 
                  "bg-theatre-red text-white" : 
                  "border-theatre-red text-theatre-red hover:bg-theatre-red hover:text-white"
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.image}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-playfair font-bold text-lg">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-playfair font-bold text-theatre-navy mb-4">
                Geen foto's gevonden
              </h3>
              <p className="text-theatre-charcoal">
                Er zijn momenteel geen foto's in deze categorie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-theatre-navy mb-4">
              Onze Galerij in Cijfers
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-theatre-gold mb-2">{images?.length || 0}</div>
              <div className="text-theatre-charcoal">Foto's</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-theatre-gold mb-2">{categories.length}</div>
              <div className="text-theatre-charcoal">Categorieën</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-theatre-gold mb-2">35+</div>
              <div className="text-theatre-charcoal">Voorstellingen</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-theatre-gold mb-2">5+</div>
              <div className="text-theatre-charcoal">Jaar Archief</div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Usage Rights */}
      <section className="py-20 bg-theatre-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Foto's Gebruiken?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bent u geïnteresseerd in het gebruik van onze foto's voor pers, promotie of persoonlijk gebruik? 
            Neem contact met ons op voor de mogelijkheden en gebruiksrechten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy">
              <Download className="w-4 h-4 mr-2" />
              Persmap Downloaden
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-theatre-navy">
              Contact Opnemen
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-theatre-gold transition-colors"
            >
              ×
            </button>
            <img 
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
              <h3 className="font-playfair font-bold text-2xl mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
