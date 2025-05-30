import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      <div className="hero-overlay absolute inset-0"></div>
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 animate-fade-in">
          Toneelgroep De Valk
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 animate-slide-up font-crimson italic">
          "Waar verhalen tot leven komen op het podium"
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link href="/productions">
            <Button 
              size="lg" 
              className="bg-theatre-gold hover:bg-yellow-500 text-theatre-navy px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Bekijk Producties
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              size="lg"
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-theatre-navy px-8 py-3 font-semibold transition-all duration-300"
            >
              Meer Over Ons
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
