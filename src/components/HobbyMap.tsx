import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HobbyMate, TribeSpace } from '../types';
import { Radio, Users, MapPin, Zap, MessageCircle, Heart, ShieldCheck, Flame, Navigation, X } from 'lucide-react';

interface HobbyMapProps {
  mates: HobbyMate[];
  spaces: TribeSpace[];
  isBroadcasting: boolean;
  onToggleBroadcast: () => void;
  onSelectMateForChat: (mate: HobbyMate) => void;
  onCheerMate: (mateId: string) => void;
  cheeredMates: string[];
}

export const HobbyMap: React.FC<HobbyMapProps> = ({
  mates,
  spaces,
  isBroadcasting,
  onToggleBroadcast,
  onSelectMateForChat,
  onCheerMate,
  cheeredMates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMate, setSelectedMate] = useState<HobbyMate | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<TribeSpace | null>(null);

  // User's own simulated location
  const userLocation: [number, number] = [1.2995, 103.8530];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [1.3000, 103.8525],
        zoom: 15,
        zoomControl: false,
      });

      // Add daylight Carto Voyager clean tiles with Carto API Key
      const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || 'cb1_57gm_1_d8f9f5fb7fd6202d4351b5c5';
      const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoApiKey}`;

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters, mates, spaces, or broadcast changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. User's own marker if broadcasting or centered
    if (isBroadcasting) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-14 h-14 rounded-full bg-[#5865F2]/25 radar-pulse-ring pointer-events-none"></div>
          <div class="relative w-10 h-10 rounded-full bg-[#5865F2] border-3 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
            YOU
          </div>
          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#57F287] border-2 border-white"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: userHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker(userLocation, { icon: userIcon })
        .addTo(markersLayerRef.current)
        .bindTooltip('<b>You</b><br/>Practicing 15-min drill live', { direction: 'top', offset: [0, -18] });
    }

    // 2. HobbyMates Markers
    const filteredMates = mates.filter((m) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'spaces') return false;
      return m.category.toLowerCase().includes(selectedFilter.toLowerCase()) ||
             m.hobby.toLowerCase().includes(selectedFilter.toLowerCase());
    });

    filteredMates.forEach((mate) => {
      const statusColor = mate.status === 'active_now' ? '#57F287' : mate.status === 'seeking_buddy' ? '#ED4245' : '#FEE75C';
      const isCheered = cheeredMates.includes(mate.id);

      const mateHtml = `
        <div class="relative group cursor-pointer transition-transform hover:scale-110">
          <div class="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-md shadow-slate-900/10 border-2 ${
            selectedMate?.id === mate.id ? 'border-[#5865F2] ring-2 ring-[#5865F2]/30' : 'border-white'
          } overflow-hidden">
            <img src="${mate.avatar}" alt="${mate.name}" class="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white" style="background-color: ${statusColor}"></div>
          ${isCheered ? '<div class="absolute -bottom-2 -left-1 text-[11px]">🎉</div>' : ''}
        </div>
      `;

      const mateIcon = L.divIcon({
        className: 'mate-marker',
        html: mateHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([mate.lat, mate.lng], { icon: mateIcon }).addTo(markersLayerRef.current!);
      marker.on('click', () => {
        setSelectedMate(mate);
        setSelectedSpace(null);
        mapInstanceRef.current?.panTo([mate.lat, mate.lng], { animate: true, duration: 0.5 });
      });
    });

    // 3. Tribe Spaces Markers
    if (selectedFilter === 'all' || selectedFilter === 'spaces') {
      spaces.forEach((space) => {
        const spaceHtml = `
          <div class="relative cursor-pointer transition-transform hover:scale-110">
            <div class="w-9 h-9 rounded-full bg-white border-2 ${
              selectedSpace?.id === space.id ? 'border-[#5865F2] ring-2 ring-[#5865F2]/30' : 'border-[#3D4AD8]'
            } shadow-md flex items-center justify-center text-[#3D4AD8]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[#5865F2] text-white text-[9px] font-bold">
              ${space.activeHobbyistsCount}
            </div>
          </div>
        `;

        const spaceIcon = L.divIcon({
          className: 'space-marker',
          html: spaceHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([space.lat, space.lng], { icon: spaceIcon }).addTo(markersLayerRef.current!);
        marker.on('click', () => {
          setSelectedSpace(space);
          setSelectedMate(null);
          mapInstanceRef.current?.panTo([space.lat, space.lng], { animate: true, duration: 0.5 });
        });
      });
    }
  }, [mates, spaces, selectedFilter, selectedMate, selectedSpace, isBroadcasting, cheeredMates]);

  return (
    <div className="relative w-full h-[calc(100vh-68px)] min-h-[580px] bg-[#EAEFF5] overflow-hidden">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Filter Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-8 md:right-auto z-10 flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[calc(100vw-32px)] md:max-w-3xl no-scrollbar">
        {[
          { id: 'all', label: 'All Mates (5)' },
          { id: 'coffee', label: '☕ Latte Art' },
          { id: 'sketch', label: '🎨 Urban Sketching' },
          { id: 'pickleball', label: '🏓 Pickleball' },
          { id: 'craft', label: '🏺 Ceramics & Craft' },
          { id: 'guitar', label: '🎸 Guitar & Music' },
          { id: 'spaces', label: '🏛️ Tribe Spaces Only' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedFilter(tab.id);
              setSelectedMate(null);
              setSelectedSpace(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all shadow-sm cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#5865F2] text-white shadow-[#5865F2]/25 scale-[1.02]'
                : 'bg-white/95 text-[#2E3338] hover:bg-white hover:text-[#171C21] border border-[#E4E8EF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Floating Radar Telemetry Strip (Top Right) */}
      <div className="absolute top-4 right-4 hidden lg:flex items-center gap-3 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#E4E8EF] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-[#454655]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#57F287] animate-pulse" />
          <span><strong className="text-[#171C21]">5</strong> Mates active within 2 km</span>
        </div>
        <span className="text-[#C6C5D7]">|</span>
        <button
          onClick={onToggleBroadcast}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isBroadcasting
              ? 'bg-[#65FF92]/20 text-[#006D32] border border-[#65FF92]'
              : 'bg-[#F0F4FA] text-[#454655] hover:bg-[#E4E8EF]'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isBroadcasting ? 'text-[#007435] animate-spin' : ''}`} />
          <span>{isBroadcasting ? 'Broadcasting (Live)' : 'Go Live on Radar'}</span>
        </button>
      </div>

      {/* Mobile Broadcast Pill Bottom Left */}
      <div className="lg:hidden absolute top-16 right-4 z-10">
        <button
          onClick={onToggleBroadcast}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
            isBroadcasting
              ? 'bg-[#65FF92] text-[#00210A]'
              : 'bg-white text-[#171C21] border border-[#E4E8EF]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{isBroadcasting ? 'Live' : 'Broadcast'}</span>
        </button>
      </div>

      {/* Bottom Floating Cards / Inspection Tray */}
      {selectedMate && (
        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-auto md:w-[420px] z-20 bg-white/98 backdrop-blur-md rounded-2xl p-5 border border-[#E4E8EF] shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedMate.avatar}
                  alt={selectedMate.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-[#E4E8EF]"
                />
                <span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                  style={{
                    backgroundColor:
                      selectedMate.status === 'active_now'
                        ? '#57F287'
                        : selectedMate.status === 'seeking_buddy'
                        ? '#ED4245'
                        : '#FEE75C',
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-[#171C21]">
                    {selectedMate.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E0E0FF] text-[#000569]">
                    Lvl {selectedMate.level}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#5865F2]">{selectedMate.hobby}</p>
                <div className="flex items-center gap-2 text-[11px] text-[#454655] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#5865F2]" />
                    {selectedMate.distanceKm} km away
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#007435]">
                    <Flame className="w-3 h-3 text-[#ED4245]" />
                    {selectedMate.streakDays}-day streak
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMate(null)}
              className="p-1 text-[#767686] hover:text-[#171C21] rounded-full hover:bg-[#F0F4FA] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active 15-Minute Drill */}
          <div className="mt-3.5 p-3 rounded-xl bg-[#F7F9FF] border border-[#E4E8EF]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5865F2] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Current 15-Min Drill</span>
            </div>
            <p className="text-xs font-medium text-[#171C21] mt-1">
              "{selectedMate.currentDrill}"
            </p>
            <p className="text-[11px] text-[#454655] mt-1 italic">
              {selectedMate.statusText}
            </p>
          </div>

          {/* Relative Leveling Telemetry */}
          <div className="mt-3 flex items-center justify-between text-xs text-[#454655]">
            <span>Relative Standing:</span>
            <span className="font-semibold text-[#171C21]">
              Top {100 - selectedMate.relativeRankPercentile}% of Cohort
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onSelectMateForChat(selectedMate)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-transform active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Quick Ping / Chat</span>
            </button>

            <button
              onClick={() => onCheerMate(selectedMate.id)}
              className={`px-3.5 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                cheeredMates.includes(selectedMate.id)
                  ? 'bg-[#65FF92]/20 border-[#65FF92] text-[#006D32]'
                  : 'bg-white hover:bg-[#F0F4FA] border-[#E4E8EF] text-[#171C21]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${cheeredMates.includes(selectedMate.id) ? 'fill-[#006D32] text-[#006D32]' : 'text-[#767686]'}`} />
              <span>{cheeredMates.includes(selectedMate.id) ? 'Cheered!' : 'High-Five'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Space Inspection Tray */}
      {selectedSpace && (
        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-auto md:w-[420px] z-20 bg-white/98 backdrop-blur-md rounded-2xl p-5 border border-[#E4E8EF] shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D4AD8]">
                  {selectedSpace.category}
                </span>
                {selectedSpace.partnerBadge && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E0E0FF] text-[#000569]">
                    <ShieldCheck className="w-3 h-3 text-[#3D4AD8]" />
                    {selectedSpace.partnerBadge}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-base text-[#171C21] mt-1">
                {selectedSpace.name}
              </h3>
              <p className="text-xs text-[#454655] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#767686]" />
                {selectedSpace.address} · {selectedSpace.distanceKm} km away
              </p>
            </div>

            <button
              onClick={() => setSelectedSpace(null)}
              className="p-1 text-[#767686] hover:text-[#171C21] rounded-full hover:bg-[#F0F4FA] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#2E3338] mt-3 leading-relaxed">
            {selectedSpace.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedSpace.amenities.map((item, idx) => (
              <span key={idx} className="text-[11px] px-2.5 py-1 rounded-full bg-[#F0F4FA] text-[#454655]">
                ✓ {item}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E8EF] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#007435]">
              <Users className="w-4 h-4" />
              <span>{selectedSpace.activeHobbyistsCount} fellow hobbyists here today</span>
            </div>
            <button
              onClick={() => alert(`Directions copied! Opening map route to ${selectedSpace.name}`)}
              className="px-4 py-1.5 rounded-full bg-[#171C21] hover:bg-[#2C3136] text-white text-xs font-semibold cursor-pointer"
            >
              Get Directions
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Quick Bar when nothing is selected */}
      {!selectedMate && !selectedSpace && (
        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-auto z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#E4E8EF] shadow-lg max-w-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#65FF92]/20 flex items-center justify-center text-[#007435]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#171C21]">Tap any avatar to connect</p>
              <p className="text-[11px] text-[#454655]">Meet for a 15-min practice at a shared space</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (mates.length > 0) {
                setSelectedMate(mates[0]);
              }
            }}
            className="px-3 py-1.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            Explore Closest Mate
          </button>
        </div>
      )}
    </div>
  );
};
