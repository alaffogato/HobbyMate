import React, { useState } from 'react';
import { TribeSpace } from '../types';
import { MapPin, Users, ShieldCheck, Navigation, Sparkles, Check } from 'lucide-react';

interface TribeSpacesViewProps {
  spaces: TribeSpace[];
  onViewOnMap: (space: TribeSpace) => void;
}

export const TribeSpacesView: React.FC<TribeSpacesViewProps> = ({
  spaces,
  onViewOnMap,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [checkedInSpaces, setCheckedInSpaces] = useState<string[]>([]);

  const filtered = spaces.filter((s) => {
    if (filter === 'all') return true;
    return s.category.toLowerCase().includes(filter.toLowerCase());
  });

  const handleCheckIn = (spaceId: string) => {
    if (!checkedInSpaces.includes(spaceId)) {
      setCheckedInSpaces([...checkedInSpaces, spaceId]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5865F2] uppercase tracking-wider">
              <span>Shared Community Infrastructure</span>
              <span>·</span>
              <span className="text-[#006D32]">PA & SportSG Partners</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[#171C21] mt-1.5">
              Tribe Spaces & Free Shared Spots
            </h1>
            <p className="text-sm text-[#454655] mt-1.5 max-w-2xl leading-relaxed">
              Never let "nowhere to practice" stop your 15-minute routine. Discover free public library terraces, Community Club craft commons, and cafes with big communal tables.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-[#E4E8EF] mt-6 no-scrollbar">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'library', label: '📚 Library & Study' },
            { id: 'community', label: '🏛️ Community Clubs (PA)' },
            { id: 'sports', label: '🏓 Sports Hubs (SportSG)' },
            { id: 'cafe', label: '☕ Specialty Cafes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-[#5865F2] text-white shadow-sm shadow-[#5865F2]/20'
                  : 'bg-[#F0F4FA] text-[#454655] hover:bg-[#E4E8EF] hover:text-[#171C21]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((space) => {
          const isCheckedIn = checkedInSpaces.includes(space.id);
          return (
            <div
              key={space.id}
              className="bg-white rounded-3xl p-6 border border-[#E4E8EF] shadow-sm flex flex-col justify-between hover:border-[#5865F2]/50 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#5865F2] uppercase tracking-wider">
                        {space.category}
                      </span>
                      {space.partnerBadge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E0E0FF] text-[#000569]">
                          {space.partnerBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#171C21] mt-1">
                      {space.name}
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F0F4FA] text-[#171C21]">
                    {space.cost}
                  </span>
                </div>

                <p className="text-xs text-[#767686] flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {space.address} · <span className="font-semibold text-[#171C21]">{space.distanceKm} km</span> from you
                </p>

                <p className="text-xs md:text-sm text-[#454655] mt-3 leading-relaxed">
                  {space.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {space.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#F7F9FF] border border-[#E4E8EF] text-[#454655]"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-[#E4E8EF] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#007435]">
                  <Users className="w-3.5 h-3.5" />
                  <span>{space.activeHobbyistsCount + (isCheckedIn ? 1 : 0)} here</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckIn(space.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isCheckedIn
                        ? 'bg-[#65FF92]/20 border-[#65FF92] text-[#006D32]'
                        : 'bg-[#F0F4FA] hover:bg-[#E4E8EF] border-[#E4E8EF] text-[#171C21]'
                    }`}
                  >
                    {isCheckedIn ? 'Checked in ✓' : 'Practice Here'}
                  </button>

                  <button
                    onClick={() => onViewOnMap(space)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View Map</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
