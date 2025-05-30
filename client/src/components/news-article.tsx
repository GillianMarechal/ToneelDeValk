import { type NewsArticle } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface NewsArticleProps {
  article: NewsArticle;
  variant?: "light" | "dark";
}

export default function NewsArticleCard({ article, variant = "light" }: NewsArticleProps) {
  const baseClasses = variant === "dark" 
    ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/15" 
    : "bg-white text-theatre-charcoal hover:shadow-lg";

  const titleClasses = variant === "dark" 
    ? "text-white" 
    : "text-theatre-navy";

  const dateClasses = variant === "dark" 
    ? "text-theatre-gold" 
    : "text-theatre-red";

  const excerptClasses = variant === "dark" 
    ? "text-gray-300" 
    : "text-theatre-charcoal";

  const buttonClasses = variant === "dark" 
    ? "text-theatre-gold hover:text-yellow-300" 
    : "text-theatre-red hover:text-theatre-gold";

  const getCategoryIcon = () => {
    switch (article.category.toLowerCase()) {
      case "recensies":
        return "🏆";
      case "audities":
        return "🎭";
      case "prijzen":
        return "🥇";
      default:
        return "📰";
    }
  };

  return (
    <article className={`rounded-xl p-6 transition-all duration-300 ${baseClasses}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center text-sm ${dateClasses}`}>
          <Calendar className="w-4 h-4 mr-2" />
          <span>{article.date}</span>
        </div>
        <span className="text-xl" title={article.category}>
          {getCategoryIcon()}
        </span>
      </div>
      
      <h3 className={`text-xl font-playfair font-bold mb-3 ${titleClasses} group-hover:text-theatre-red transition-colors`}>
        {article.title}
      </h3>
      
      <p className={`mb-4 leading-relaxed ${excerptClasses}`}>
        {article.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="w-3 h-3 mr-1 opacity-70" />
          <span className="text-xs opacity-70">{article.category}</span>
        </div>
        <Button className={`font-semibold bg-transparent p-0 h-auto ${buttonClasses}`}>
          Lees Meer <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </article>
  );
}
