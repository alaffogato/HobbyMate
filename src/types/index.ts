export type HobbyCategory = 
  | 'Coffee & Gastronomy'
  | 'Visual Arts'
  | 'Sports & Movement'
  | 'Craft & Making'
  | 'Music & Sound'
  | 'Tech & Hardware';

export interface HobbyMate {
  id: string;
  name: string;
  avatar: string;
  hobby: string;
  category: HobbyCategory;
  currentDrill: string;
  status: 'active_now' | 'seeking_buddy' | 'hosting_session';
  statusText: string;
  distanceKm: number;
  lat: number;
  lng: number;
  level: number;
  streakDays: number;
  relativeRankPercentile: number; // e.g. 88 = top 12%
  spacesVisited: string[];
  bio: string;
}

export interface TribeSpace {
  id: string;
  name: string;
  category: 'Community Club' | 'Library & Study' | 'Specialty Cafe' | 'Sports Hub' | 'Makerspace';
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  cost: 'Free' | '$' | '$$';
  amenities: string[];
  activeHobbyistsCount: number;
  description: string;
  partnerBadge?: string; // e.g., 'SportSG Partner', 'PA Community', 'SkillsFuture Supported'
}

export interface GearItem {
  name: string;
  estPrice: string;
  note: string;
  isEssential: boolean;
  trapWarning?: string; // e.g., 'Do NOT buy the $400 digital scale yet'
}

export interface PlanChapter {
  id: number;
  title: string;
  day: string;
  dailyMinutes: number;
  drill: string;
  milestone: string;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
}

export interface HobbyPlan {
  id: string;
  hobbyName: string;
  title: string;
  category: HobbyCategory;
  difficulty: 'Absolute Beginner' | 'Beginner Friendly' | 'Intermediate';
  timeCommitment: string;
  summary: string;
  sourceBookmarks?: string[];
  healthBenefits: string[];
  starterGear: GearItem[];
  chapters: PlanChapter[];
  suggestedSpaces: string[];
  tribeTags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach' | 'mate';
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  channelId?: string; // e.g. 'coach' or 'latte-art-sg'
  actionPrompt?: string;
}

export interface UserProgress {
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  totalMinutesPracticed: number;
  cohortPercentile: number; // e.g., Top 15%
  cohortName: string;
  completedDrillsCount: number;
  healthMetrics: {
    stressReductionPct: number;
    focusScorePct: number;
    spatialAgilityPct: number;
  };
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }[];
}
