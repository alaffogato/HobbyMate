import React from 'react';
import { HobbyPlan, PlanChapter } from '../types';
import { CheckCircle2, Circle, Clock, Flame, Sparkles, AlertTriangle, ShoppingBag, Bookmark, MapPin, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlanViewProps {
  plan: HobbyPlan;
  onToggleChapter: (chapterId: number) => void;
  onOpenAddModal: () => void;
  onGoToMapForSpace: (spaceName: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  onToggleChapter,
  onOpenAddModal,
  onGoToMapForSpace,
}) => {
  const completedCount = plan.chapters.filter((c) => c.completed).length;
  const progressPct = Math.round((completedCount / plan.chapters.length) * 100);

  const handleCheckboxClick = (chapter: PlanChapter) => {
    if (!chapter.completed) {
      // Trigger celebratory confetti blast
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#5865F2', '#57F287', '#FEE75C', '#3D4AD8'],
        });
      } catch (e) {
        // Fallback gracefully if canvas context unavailable
      }
    }
    onToggleChapter(chapter.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Plan Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E4E8EF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5865F2]">
              <span>{plan.category}</span>
              <span>·</span>
              <span>{plan.difficulty}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#006D32] bg-[#65FF92]/20 px-2 py-0.5 rounded-full font-bold">
                <Clock className="w-3.5 h-3.5" />
                {plan.timeCommitment}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[#171C21] mt-2 tracking-tight">
              {plan.title}
            </h1>
            <p className="text-sm md:text-base text-[#454655] mt-2 max-w-2xl leading-relaxed">
              {plan.summary}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-full bg-[#F0F4FA] hover:bg-[#E4E8EF] text-xs font-bold text-[#171C21] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Change Hobby / Import Saves</span>
            </button>

            {/* Overall Plan Completion */}
            <div className="w-full md:w-48 bg-[#F0F4FA] p-3 rounded-2xl border border-[#E4E8EF]">
              <div className="flex items-center justify-between text-xs font-bold text-[#171C21]">
                <span>Roadmap Progress</span>
                <span className="text-[#5865F2]">{progressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#DFE3E9] mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#5865F2] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-[#454655] mt-1.5 text-center">
                {completedCount} of {plan.chapters.length} chapters completed
              </p>
            </div>
          </div>
        </div>

        {/* Health & Cognitive Wellness Metrics */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.healthBenefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#65FF92]/30 text-[#006D32] flex items-center justify-center font-bold text-xs shrink-0">
                +15m
              </div>
              <div>
                <p className="text-xs font-bold text-[#171C21]">{benefit}</p>
                <p className="text-[11px] text-[#454655]">Science-backed micro-routine benefit</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters: 15-Minute Daily Drills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-[#171C21]">
              Daily 15-Minute Mastery Chapters
            </h2>
            <p className="text-xs text-[#454655] mt-0.5">
              Bite-sized, zero-overwhelm steps designed to fit around your daily schedule.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plan.chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                chapter.completed
                  ? 'bg-white border-[#65FF92]/50 shadow-sm opacity-90'
                  : 'bg-white border-[#E4E8EF] hover:border-[#5865F2]/40 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => handleCheckboxClick(chapter)}
                    className="mt-0.5 text-[#5865F2] hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                    title={chapter.completed ? 'Mark as incomplete' : 'Mark 15-min drill as completed today!'}
                  >
                    {chapter.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#006D32] fill-[#65FF92]" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#C6C5D7] hover:text-[#5865F2]" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#5865F2] uppercase tracking-wider">
                        Chapter 0{chapter.id}
                      </span>
                      <span className="text-xs text-[#767686]">·</span>
                      <span className="text-xs font-medium text-[#454655]">{chapter.day}</span>
                      <span className="text-xs text-[#767686]">·</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F0F4FA] text-[#171C21]">
                        15 mins
                      </span>
                      {chapter.completed && (
                        <span className="text-[11px] font-semibold text-[#006D32] bg-[#65FF92]/20 px-2 py-0.5 rounded-full">
                          Completed {chapter.completedAt || 'Recently'} (+{chapter.xpReward} XP)
                        </span>
                      )}
                    </div>

                    <h3 className={`font-display font-bold text-lg mt-1 ${chapter.completed ? 'text-[#171C21] line-through opacity-80' : 'text-[#171C21]'}`}>
                      {chapter.title}
                    </h3>

                    {/* The 15-Minute Drill */}
                    <div className="mt-2.5 p-3.5 rounded-xl bg-[#F7F9FF] border border-[#E4E8EF]">
                      <p className="text-xs font-semibold text-[#5865F2] uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Today's 15-Minute Drill
                      </p>
                      <p className="text-xs md:text-sm text-[#171C21] mt-1 leading-relaxed">
                        {chapter.drill}
                      </p>
                    </div>

                    {/* Clear Milestone */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-[#454655]">
                      <span className="font-semibold text-[#171C21]">Target Milestone:</span>
                      <span>{chapter.milestone}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <span className="text-xs font-bold text-[#3D4AD8] bg-[#E0E0FF] px-2.5 py-1 rounded-full">
                    +{chapter.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gear Up: Budget Starter Kit vs Expensive Traps */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-[#171C21]">
              Gear Up: Starter Essentials (Under $40)
            </h2>
            <p className="text-xs text-[#454655]">
              Avoid spending hundreds before knowing if you love it. Start with minimal friction tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {plan.starterGear.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5865F2]">{item.estPrice}</span>
                  {item.isEssential && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0E0FF] text-[#000569]">
                      Essential
                    </span>
                  )}
                </div>
                <h4 className="font-display font-bold text-sm text-[#171C21] mt-1">
                  {item.name}
                </h4>
                <p className="text-xs text-[#454655] mt-1 leading-relaxed">
                  {item.note}
                </p>
              </div>

              {item.trapWarning && (
                <div className="mt-3 p-2 rounded-xl bg-[#FFDAD6]/50 border border-[#FFDAD6] flex items-start gap-1.5 text-[11px] text-[#93000A]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#BA1A1A]" />
                  <span>{item.trapWarning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarks & Suggested Spaces strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Bookmarks & Inspiration */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8EF] shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171C21]">
            <Bookmark className="w-4 h-4 text-[#5865F2]" />
            <span>Saved Inspiration Sources</span>
          </div>
          <p className="text-xs text-[#454655] mt-1">
            Reels, TikToks, and pins that shaped this customized plan:
          </p>
          <div className="space-y-2 mt-4">
            {(plan.sourceBookmarks || [
              'instagram.com/reel/C89x1p - Dish soap water drill',
              'tiktok.com/@baristadaily - Milk steaming vortex angle'
            ]).map((bm, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#F0F4FA] text-xs text-[#2E3338] font-mono truncate">
                🔗 {bm}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Tribe Spaces */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8EF] shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171C21]">
            <MapPin className="w-4 h-4 text-[#5865F2]" />
            <span>Tribe Spaces for this Hobby</span>
          </div>
          <p className="text-xs text-[#454655] mt-1">
            Community tables and hubs where fellow hobbyists practice:
          </p>
          <div className="space-y-2 mt-4">
            {plan.suggestedSpaces.map((space, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FF] border border-[#E4E8EF] hover:border-[#5865F2] transition-colors cursor-pointer"
                onClick={() => onGoToMapForSpace(space)}
              >
                <span className="text-xs font-semibold text-[#171C21]">{space}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#5865F2]">
                  Find on Map <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
