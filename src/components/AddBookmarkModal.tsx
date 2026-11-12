import React, { useState } from 'react';
import { HobbyPlan } from '../types';
import { X, Sparkles, Link, Bookmark, Check, ArrowRight, Loader2 } from 'lucide-react';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (newPlan: HobbyPlan) => void;
}

const PRESETS = [
  {
    title: '☕ Latte Art Milk Steaming',
    hobby: 'Latte Art & Milk Steaming',
    bookmarks: 'tiktok.com/@baristadaily/video/72918239 - pitcher angle\ninstagram.com/reel/C89x1p - soap water drill\nyoutube.com/watch?v=k4L9 - blooming the heart',
    description: 'Transform your morning coffee into silky cafe-quality microfoam without buying a $1,500 machine.',
  },
  {
    title: '🎨 Loose Urban Watercolor Sketching',
    hobby: 'Urban Watercolor Sketching',
    bookmarks: 'pinterest.com/pin/architectural-watercolor-shophouse\ninstagram.com/reel/urban_lines_sg - 5 min ink contour\ntiktok.com/@sketcher - two wash shadows',
    description: 'Sketch lively streetscapes, cafe tables, and shophouses with 1 waterproof pen and a pocket palette.',
  },
  {
    title: '🏓 Pickleball 3rd-Shot Drop & Dinks',
    hobby: 'Pickleball Third-Shot Drop',
    bookmarks: 'youtube.com/shorts/pickleball_kitchen_resets\ntiktok.com/@dinkmaster - paddle angle on drop shot',
    description: 'Master non-volley kitchen line resets and soft touch without aggressive smash pressure.',
  },
  {
    title: '🧗 Bouldering Footwork & Dynos',
    hobby: 'Bouldering Climbing Footwork',
    bookmarks: 'instagram.com/reel/dyno_drop_knee_drill\nyoutube.com/watch?v=flagging_footwork',
    description: 'Build quiet feet, hip-to-wall flagging, and upper body grip endurance in 15-minute gym circuits.',
  },
];

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
}) => {
  const [hobbyInput, setHobbyInput] = useState('');
  const [bookmarksInput, setBookmarksInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Absolute Beginner');
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setHobbyInput(preset.hobby);
    setBookmarksInput(preset.bookmarks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hobbyInput.trim() && !bookmarksInput.trim()) {
      setErrorMsg('Please enter a hobby name or paste some bookmark links/notes.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hobbyName: hobbyInput.trim() || 'Creative Craft',
          rawInput: bookmarksInput.trim(),
          experienceLevel,
          dailyMinutes,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onPlanGenerated(data.plan);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMsg('Could not generate plan right now. Please try again or pick a preset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-[#E4E8EF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-[#767686] hover:text-[#171C21] hover:bg-[#F0F4FA] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-[#171C21]">
              Custom Plan from Social Saves
            </h2>
            <p className="text-xs text-[#454655]">
              Turn reels, TikToks, and pins you've bookmarked into a 15-minute daily micro-plan.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-[#171C21] uppercase tracking-wider mb-2">
            Try a Quick Preset Inspiration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left p-3 rounded-2xl bg-[#F7F9FF] border border-[#E4E8EF] hover:border-[#5865F2] hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-[#171C21] group-hover:text-[#5865F2]">
                    {p.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#767686] group-hover:text-[#5865F2] transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-[#454655] line-clamp-1 mt-1">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#171C21] uppercase tracking-wider mb-1.5">
              Hobby or Skill Set Name
            </label>
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              placeholder="e.g. Latte Art, Acoustic Fingerstyle, Ceramics, Sourdough Bread..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4FA] focus:bg-white border border-[#E4E8EF] focus:border-[#5865F2] focus:outline-none text-xs md:text-sm text-[#171C21] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171C21] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Saved Bookmarks, Reels, or Topics</span>
              <span className="text-[10px] text-[#767686] normal-case">Paste URLs or bullet notes</span>
            </label>
            <textarea
              rows={3}
              value={bookmarksInput}
              onChange={(e) => setBookmarksInput(e.target.value)}
              placeholder="Paste Instagram reels, TikTok links, YouTube tutorials, or notes on what technique caught your eye..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F0F4FA] focus:bg-white border border-[#E4E8EF] focus:border-[#5865F2] focus:outline-none text-xs md:text-sm text-[#171C21] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171C21] uppercase tracking-wider mb-1.5">
                Current Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-[#F0F4FA] border border-[#E4E8EF] text-xs font-medium text-[#171C21] focus:outline-none focus:border-[#5865F2]"
              >
                <option value="Absolute Beginner">Absolute Beginner (Never touched it)</option>
                <option value="Beginner Friendly">Beginner Friendly (Tried a few times)</option>
                <option value="Intermediate">Intermediate (Looking to break plateau)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171C21] uppercase tracking-wider mb-1.5">
                Daily Time Commitment
              </label>
              <div className="flex items-center gap-2">
                {[15, 20].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      dailyMinutes === mins
                        ? 'bg-[#5865F2] text-white border-[#5865F2] shadow-sm'
                        : 'bg-[#F0F4FA] text-[#454655] border-[#E4E8EF]'
                    }`}
                  >
                    {mins} mins/day {mins === 15 ? '★ Best' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#ED4245] font-semibold">{errorMsg}</p>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#454655] hover:bg-[#F0F4FA] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs md:text-sm font-bold shadow-md shadow-[#5865F2]/25 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 15-Min Chapters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FEE75C]" />
                  <span>Generate 15-Min Daily Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
