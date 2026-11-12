import React, { useState } from 'react';
import { Header } from './components/Header';
import { HobbyMap } from './components/HobbyMap';
import { PlanView } from './components/PlanView';
import { ProgressView } from './components/ProgressView';
import { TribeSpacesView } from './components/TribeSpacesView';
import { ChatDrawer } from './components/ChatDrawer';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import {
  INITIAL_HOBBY_MATES,
  INITIAL_TRIBE_SPACES,
  INITIAL_PLAN,
  INITIAL_USER_PROGRESS,
} from './data/mockData';
import { HobbyMate, TribeSpace, HobbyPlan, UserProgress } from './types';
import { Compass, BookOpen, MapPin, Award, MessageSquare, Radio, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'plan' | 'spaces' | 'progress'>('map');
  const [mates, setMates] = useState<HobbyMate[]>(INITIAL_HOBBY_MATES);
  const [spaces, setSpaces] = useState<TribeSpace[]>(INITIAL_TRIBE_SPACES);
  const [plan, setPlan] = useState<HobbyPlan>(INITIAL_PLAN);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_USER_PROGRESS);

  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedMateForChat, setSelectedMateForChat] = useState<HobbyMate | null>(null);
  const [cheeredMates, setCheeredMates] = useState<string[]>(['mate-1']);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Toggle chapter completion and update relative progress
  const handleToggleChapter = (chapterId: number) => {
    setPlan((prevPlan) => {
      const updatedChapters = prevPlan.chapters.map((ch) => {
        if (ch.id === chapterId) {
          const isNowCompleted = !ch.completed;
          return {
            ...ch,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? 'Just now' : undefined,
          };
        }
        return ch;
      });

      // Calculate XP change
      const targetChapter = prevPlan.chapters.find((c) => c.id === chapterId);
      if (targetChapter) {
        const willBeCompleted = !targetChapter.completed;
        const xpDelta = willBeCompleted ? targetChapter.xpReward : -targetChapter.xpReward;

        setProgress((prevProg) => {
          const newXP = Math.max(0, prevProg.currentXP + xpDelta);
          const newTotalMinutes = willBeCompleted
            ? prevProg.totalMinutesPracticed + targetChapter.dailyMinutes
            : prevProg.totalMinutesPracticed;
          const newCompletedCount = willBeCompleted
            ? prevProg.completedDrillsCount + 1
            : Math.max(0, prevProg.completedDrillsCount - 1);

          // Calculate new relative percentile (e.g. up to 88th percentile)
          const newPercentile = willBeCompleted
            ? Math.min(96, prevProg.cohortPercentile + 4)
            : Math.max(50, prevProg.cohortPercentile - 4);

          // Level up check
          let newLevel = prevProg.level;
          let newTitle = prevProg.levelTitle;
          if (newXP >= prevProg.nextLevelXP) {
            newLevel = prevProg.level + 1;
            newTitle = 'Artisan Pourer (Journeyman)';
          }

          return {
            ...prevProg,
            level: newLevel,
            levelTitle: newTitle,
            currentXP: newXP,
            totalMinutesPracticed: newTotalMinutes,
            completedDrillsCount: newCompletedCount,
            cohortPercentile: newPercentile,
          };
        });
      }

      return {
        ...prevPlan,
        chapters: updatedChapters,
      };
    });
  };

  const handleCheerMate = (mateId: string) => {
    if (!cheeredMates.includes(mateId)) {
      setCheeredMates([...cheeredMates, mateId]);
      // Boost user's engagement XP
      setProgress((prev) => ({
        ...prev,
        currentXP: prev.currentXP + 10,
        cohortPercentile: Math.min(99, prev.cohortPercentile + 1),
      }));
    }
  };

  const handleToggleBroadcast = () => {
    setIsBroadcasting(!isBroadcasting);
  };

  const handleSelectMateForChat = (mate: HobbyMate) => {
    setSelectedMateForChat(mate);
    setIsChatOpen(true);
  };

  const handlePlanGenerated = (newPlan: HobbyPlan) => {
    setPlan(newPlan);
    setActiveTab('plan');
  };

  const handleGoToMapForSpace = (spaceName: string) => {
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF] text-[#171C21] flex flex-col font-sans pb-16 md:pb-0">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isBroadcasting={isBroadcasting}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <HobbyMap
            mates={mates}
            spaces={spaces}
            isBroadcasting={isBroadcasting}
            onToggleBroadcast={handleToggleBroadcast}
            onSelectMateForChat={handleSelectMateForChat}
            onCheerMate={handleCheerMate}
            cheeredMates={cheeredMates}
          />
        )}

        {activeTab === 'plan' && (
          <PlanView
            plan={plan}
            onToggleChapter={handleToggleChapter}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onGoToMapForSpace={handleGoToMapForSpace}
          />
        )}

        {activeTab === 'spaces' && (
          <TribeSpacesView
            spaces={spaces}
            onViewOnMap={(space) => {
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            progress={progress}
            cohortPeers={mates}
            onCheerPeer={handleCheerMate}
            cheeredPeers={cheeredMates}
            onOpenPlan={() => setActiveTab('plan')}
          />
        )}
      </main>

      {/* Chat Drawer (Organic Mentor & Tribe Channel) */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activePlan={plan}
        selectedMateForChat={selectedMateForChat}
        onClearSelectedMate={() => setSelectedMateForChat(null)}
      />

      {/* Add Custom Bookmark & Hobby Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E8EF] px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-[#5865F2] font-bold' : 'text-[#454655]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'plan' ? 'text-[#5865F2] font-bold' : 'text-[#454655]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">15m Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('spaces')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'spaces' ? 'text-[#5865F2] font-bold' : 'text-[#454655]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px]">Spaces</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'progress' ? 'text-[#5865F2] font-bold' : 'text-[#454655]'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Rank</span>
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#5865F2] transition-colors cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Mentor</span>
        </button>
      </nav>
    </div>
  );
}
