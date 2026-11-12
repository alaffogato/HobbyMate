import React from 'react';
import { Compass, Sparkles, MessageSquare, Radio } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'plan' | 'spaces' | 'progress';
  setActiveTab: (tab: 'map' | 'plan' | 'spaces' | 'progress') => void;
  onOpenAddModal: () => void;
  onToggleChat: () => void;
  unreadChatCount?: number;
  isBroadcasting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onToggleChat,
  unreadChatCount = 0,
  isBroadcasting,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E8EF] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-sm shadow-[#5865F2]/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <button 
            onClick={() => setActiveTab('map')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-[#171C21] group-hover:text-[#5865F2] transition-colors">
                HobbyPulse
              </span>
              {isBroadcasting && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#65FF92]/20 text-[#006D32] border border-[#65FF92]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007435] animate-ping" />
                  Live on Radar
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Zone 2: 4 single-line links */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#454655]">
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'map'
                ? 'text-[#5865F2] font-semibold border-b-2 border-[#5865F2]'
                : 'hover:text-[#171C21]'
            }`}
          >
            Live Radar & Mates
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'plan'
                ? 'text-[#5865F2] font-semibold border-b-2 border-[#5865F2]'
                : 'hover:text-[#171C21]'
            }`}
          >
            My 15-Min Plan
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'spaces'
                ? 'text-[#5865F2] font-semibold border-b-2 border-[#5865F2]'
                : 'hover:text-[#171C21]'
            }`}
          >
            Tribe Spaces
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'progress'
                ? 'text-[#5865F2] font-semibold border-b-2 border-[#5865F2]'
                : 'hover:text-[#171C21]'
            }`}
          >
            Relative Progress
          </button>
        </nav>

        {/* Zone 3: 1 primary action + chat affordance */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleChat}
            className="relative p-2 rounded-full text-[#454655] hover:text-[#171C21] hover:bg-[#F0F4FA] transition-colors focus:outline-none cursor-pointer"
            title="Open Pulse Mentor & Tribe Chat"
            aria-label="Open Chat"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ED4245] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs md:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#FEE75C]" />
            <span>+ Add Saved Bookmarks</span>
          </button>
        </div>
      </div>
    </header>
  );
};
