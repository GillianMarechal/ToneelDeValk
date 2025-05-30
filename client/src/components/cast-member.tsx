import { type CastMember } from "@shared/schema";
import { Star, User } from "lucide-react";

interface CastMemberProps {
  member: CastMember;
  compact?: boolean;
}

export default function CastMemberCard({ member, compact = false }: CastMemberProps) {
  if (compact) {
    return (
      <div className="text-center group">
        <div className="relative">
          <img 
            src={member.image}
            alt={`Profiel foto van ${member.name}`}
            className="w-32 h-32 rounded-full mx-auto mb-3 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300" 
          />
          {member.featured && (
            <div className="absolute -top-2 -right-2 bg-theatre-gold text-theatre-navy w-6 h-6 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-playfair font-bold text-theatre-navy mb-1 group-hover:text-theatre-red transition-colors">
          {member.name}
        </h3>
        <p className="text-theatre-red font-semibold text-sm mb-2">{member.role}</p>
      </div>
    );
  }

  return (
    <div className="text-center group">
      <div className="relative">
        <img 
          src={member.image}
          alt={`Profiel foto van ${member.name}`}
          className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300" 
        />
        {member.featured && (
          <div className="absolute -top-2 -right-2 bg-theatre-gold text-theatre-navy w-8 h-8 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-playfair font-bold text-theatre-navy mb-1 group-hover:text-theatre-red transition-colors">
        {member.name}
      </h3>
      <p className="text-theatre-red font-semibold mb-2">{member.role}</p>
      <p className="text-sm text-theatre-charcoal px-2 leading-relaxed">
        {member.bio}
      </p>
    </div>
  );
}
