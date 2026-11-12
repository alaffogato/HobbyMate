import React from 'react';
import { UserProgress, HobbyMate } from '../types';
import { Trophy, Flame, Zap, Award, Users, TrendingUp, Sparkles, Check, Heart, Shield } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  cohortPeers: HobbyMate[];
  onCheerPeer: (mateId: string) => void;
  cheeredPeers: string[];
  onOpenPlan: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  cohortPeers,
  onCheerPeer,
  cheeredPeers,
  onOpenPlan,
}) => {
  const xpNeeded = progress.nextLevelXP - progress.currentXP;
  const xpPct = Math.round((progress.currentXP / progress.nextLevelXP) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Level & Relative Standing */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E4E8EF]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#5865F2] text-white flex flex-col items-center justify-center font-display shadow-md shadow-[#5865F2]/20">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Lvl</span>
              <span className="text-2xl font-bold leading-none">{progress.level}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5865F2] uppercase tracking-wider">
                  Current Rank
                </span>
                <span className="text-xs text-[#767686]">·</span>
                <span className="text-xs text-[#454655] font-medium">{progress.cohortName}</span>
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[#171C21] mt-1">
                {progress.levelTitle}
              </h1>
              <p className="text-xs md:text-sm text-[#454655] mt-1">
                Next rank: <strong>Artisan Pourer (Level 4)</strong> in {xpNeeded} XP
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-3 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF] text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-[#ED4245] font-bold text-lg">
                <Flame className="w-5 h-5 fill-[#ED4245]" />
                <span>{progress.streakDays}</span>
              </div>
              <p className="text-[11px] text-[#454655] font-medium mt-0.5">Day Streak</p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF] text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-[#006D32] font-bold text-lg">
                <Zap className="w-4 h-4 text-[#007435]" />
                <span>{progress.totalMinutesPracticed}m</span>
              </div>
              <p className="text-[11px] text-[#454655] font-medium mt-0.5">Total Practiced</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#171C21]">
            <span>Level {progress.level} Progress</span>
            <span className="font-mono text-[#5865F2]">{progress.currentXP} / {progress.nextLevelXP} XP ({xpPct}%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#DFE3E9] mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3D4AD8] to-[#5865F2] rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Relative Standing Against Cohort (Key Prompt Requirement) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5865F2] uppercase tracking-wider">
                Relative Benchmark
              </span>
              <span className="text-xs text-[#767686]">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#65FF92]/20 text-[#006D32]">
                Top {100 - progress.cohortPercentile}% Overall
              </span>
            </div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-[#171C21] mt-1">
              How You Compare to Fellow Beginners
            </h2>
            <p className="text-xs md:text-sm text-[#454655] mt-1 max-w-2xl leading-relaxed">
              We track progress <em>relatively</em> to your cohort so you never feel intimidated. By completing 15 minutes consistently, you stay ahead of the typical 80% burnout drop-off.
            </p>
          </div>
        </div>

        {/* Relative Percentile Visual Spectrum */}
        <div className="mt-8">
          <div className="relative pt-6 pb-2">
            {/* The Marker for User */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${progress.cohortPercentile}%` }}
            >
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5865F2] text-white shadow-sm whitespace-nowrap">
                You ({progress.cohortPercentile}th Percentile)
              </span>
              <div className="w-2 h-2 bg-[#5865F2] rotate-45 -mt-0.5" />
            </div>

            {/* Bar */}
            <div className="w-full h-4 rounded-full bg-gradient-to-r from-[#DFE3E9] via-[#BEC2FF] to-[#65FF92] flex items-center overflow-hidden">
              <div
                className="h-full border-r-2 border-white bg-transparent"
                style={{ width: `${progress.cohortPercentile}%` }}
              />
            </div>

            {/* Labels below */}
            <div className="flex justify-between text-[11px] text-[#454655] font-medium mt-2">
              <span>0% (Curious)</span>
              <span>25% (First Drill)</span>
              <span>50% (3-Day Streak)</span>
              <span>75% (Habit Formed)</span>
              <span className="font-bold text-[#007435]">100% (Master)</span>
            </div>
          </div>
        </div>

        {/* 3 Key Relative Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E4E8EF]">
          <div className="p-4 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF]">
            <span className="text-xs font-bold text-[#5865F2]">Consistency Rate</span>
            <div className="font-display font-bold text-2xl text-[#171C21] mt-1">
              Top 14%
            </div>
            <p className="text-[11px] text-[#454655] mt-1">
              Practicing 4 days in a row beats 86% of new learners who practice once a week.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF]">
            <span className="text-xs font-bold text-[#5865F2]">15-Min Focus Metric</span>
            <div className="font-display font-bold text-2xl text-[#171C21] mt-1">
              Top 8%
            </div>
            <p className="text-[11px] text-[#454655] mt-1">
              You stick to tight, deliberate 15-minute drills without distraction.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF]">
            <span className="text-xs font-bold text-[#5865F2]">Tribe Engagement</span>
            <div className="font-display font-bold text-2xl text-[#171C21] mt-1">
              Top 25%
            </div>
            <p className="text-[11px] text-[#454655] mt-1">
              Active radar broadcasting and cheering mates builds mutual momentum.
            </p>
          </div>
        </div>
      </div>

      {/* Cohort Peer Group (Friendly, Motivational) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-[#171C21]">
              Cohort 14: Friendly Peer Group
            </h2>
            <p className="text-xs text-[#454655] mt-0.5">
              People who started learning around the same time. High-five them to keep spirits high!
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F0F4FA] text-[#171C21]">
            5 Peers in Group
          </span>
        </div>

        <div className="mt-6 divide-y divide-[#E4E8EF]">
          {cohortPeers.map((peer, idx) => {
            const isCheered = cheeredPeers.includes(peer.id);
            return (
              <div
                key={peer.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#E4E8EF]"
                    />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#57F287] border-2 border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-[#171C21]">
                        {peer.name}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-[#E0E0FF] text-[#000569]">
                        Lvl {peer.level}
                      </span>
                    </div>
                    <p className="text-xs text-[#5865F2] font-medium">{peer.hobby}</p>
                    <p className="text-[11px] text-[#454655] line-clamp-1 mt-0.5">
                      Current: {peer.currentDrill}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <div className="font-bold text-[#171C21] flex items-center gap-1 justify-end">
                      <Flame className="w-3.5 h-3.5 text-[#ED4245] fill-[#ED4245]" />
                      {peer.streakDays}d streak
                    </div>
                    <span className="text-[10px] text-[#767686]">
                      Top {100 - peer.relativeRankPercentile}%
                    </span>
                  </div>

                  <button
                    onClick={() => onCheerPeer(peer.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCheered
                        ? 'bg-[#65FF92]/20 border-[#65FF92] text-[#006D32]'
                        : 'bg-[#F0F4FA] hover:bg-[#E4E8EF] border-[#E4E8EF] text-[#171C21]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-[#006D32] text-[#006D32]' : 'text-[#767686]'}`} />
                    <span>{isCheered ? 'Cheered!' : 'Cheer'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E4E8EF] shadow-sm">
        <h2 className="font-display font-bold text-xl text-[#171C21]">
          Milestone Badges & Trophies
        </h2>
        <p className="text-xs text-[#454655] mt-0.5">
          Proof of small steps that turned into genuine skill habits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {progress.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between ${
                badge.unlocked
                  ? 'bg-[#F7F9FF] border-[#E4E8EF]'
                  : 'bg-[#F0F4FA]/50 border-dashed border-[#C6C5D7] opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8EF] shadow-sm flex items-center justify-center text-[#5865F2] mb-3">
                {badge.icon === 'zap' && <Zap className="w-6 h-6 text-[#5865F2]" />}
                {badge.icon === 'sparkles' && <Sparkles className="w-6 h-6 text-[#FEE75C]" />}
                {badge.icon === 'map-pin' && <Users className="w-6 h-6 text-[#006D32]" />}
                {badge.icon === 'award' && <Award className="w-6 h-6 text-[#ED4245]" />}
              </div>

              <div>
                <h4 className="font-display font-bold text-sm text-[#171C21]">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#454655] mt-1 leading-snug">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3">
                {badge.unlocked ? (
                  <span className="text-[10px] font-bold text-[#006D32] bg-[#65FF92]/20 px-2 py-0.5 rounded-full">
                    Unlocked {badge.unlockedAt}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-[#767686]">
                    Locked (Chapter 4)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
