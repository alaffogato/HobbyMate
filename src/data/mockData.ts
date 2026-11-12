import { HobbyMate, TribeSpace, HobbyPlan, UserProgress } from '../types';

export const INITIAL_HOBBY_MATES: HobbyMate[] = [
  {
    id: 'mate-1',
    name: 'Clara Tan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    hobby: 'Latte Art Steaming',
    category: 'Coffee & Gastronomy',
    currentDrill: 'Wiggling the pitcher spout to bloom a 3-tier tulip',
    status: 'active_now',
    statusText: 'Steaming oat milk at communal bench',
    distanceKm: 0.3,
    lat: 1.2985,
    lng: 103.8520,
    level: 4,
    streakDays: 8,
    relativeRankPercentile: 86,
    spacesVisited: ['Kurasu Cafe Corner', 'Bugis CC Lounge'],
    bio: 'Started with 15 mins every morning before work. Happy to share my spare 12oz pitcher!'
  },
  {
    id: 'mate-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    hobby: 'Urban Watercolor Sketching',
    category: 'Visual Arts',
    currentDrill: '2-wash contrast on heritage shophouse façades',
    status: 'hosting_session',
    statusText: 'Hosting 15-min open sketch bench',
    distanceKm: 0.6,
    lat: 1.3020,
    lng: 103.8565,
    level: 5,
    streakDays: 14,
    relativeRankPercentile: 92,
    spacesVisited: ['National Library Terrace (L5)', 'Arab Street Benches'],
    bio: 'No fine-art background! Just a 15-min daily escape from corporate spreadsheets.'
  },
  {
    id: 'mate-3',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    hobby: 'Pickleball Third-Shot Drop',
    category: 'Sports & Movement',
    currentDrill: 'Soft-touch kitchen line resets (15 min drill)',
    status: 'seeking_buddy',
    statusText: 'Looking for 1 dink sparring partner',
    distanceKm: 0.8,
    lat: 1.3055,
    lng: 103.8490,
    level: 3,
    streakDays: 5,
    relativeRankPercentile: 74,
    spacesVisited: ['SportSG Arena Court 3', 'Kampong Glam CC'],
    bio: 'Looking for beginners to practice soft dinks without tournament pressure.'
  },
  {
    id: 'mate-4',
    name: 'Aaliyah Noor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    hobby: 'Ceramic Hand-Building',
    category: 'Craft & Making',
    currentDrill: 'Pinching thin walls on stoneware tea bowl',
    status: 'active_now',
    statusText: 'Working clay at public studio table',
    distanceKm: 1.1,
    lat: 1.2940,
    lng: 103.8450,
    level: 2,
    streakDays: 4,
    relativeRankPercentile: 65,
    spacesVisited: ['Makerspace Hive', 'Bras Basah Complex Clay Lab'],
    bio: 'Pinch pottery is pure therapy. Got my starter tools from Carousell for $12!'
  },
  {
    id: 'mate-5',
    name: 'Devon Lee',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80',
    hobby: 'Acoustic Fingerstyle Guitar',
    category: 'Music & Sound',
    currentDrill: 'Travis picking thumb independence on G-C-D',
    status: 'seeking_buddy',
    statusText: 'Acoustic jam on the outdoor pavilion',
    distanceKm: 1.4,
    lat: 1.3090,
    lng: 103.8540,
    level: 3,
    streakDays: 9,
    relativeRankPercentile: 79,
    spacesVisited: ['Fort Canning Shady Hill', 'PA Tanjong Pagar CC'],
    bio: 'Learning 1 chord progression every 3 days. No need to read sheet music!'
  }
];

export const INITIAL_TRIBE_SPACES: TribeSpace[] = [
  {
    id: 'space-1',
    name: 'National Library 5th Floor Garden Terrace',
    category: 'Library & Study',
    address: '100 Victoria St, Bugis',
    lat: 1.2976,
    lng: 103.8542,
    distanceKm: 0.4,
    cost: 'Free',
    amenities: ['Natural daylight', 'Power plugs', 'Large communal wood tables', 'Quiet zone'],
    activeHobbyistsCount: 7,
    description: 'Perfect natural lighting for watercolor sketchers, notebook journalers, and calligraphy learners.',
    partnerBadge: 'PA Community Partner'
  },
  {
    id: 'space-2',
    name: 'Kampong Glam Community Club Craft Commons',
    category: 'Community Club',
    address: '385 Beach Rd',
    lat: 1.3032,
    lng: 103.8615,
    distanceKm: 0.9,
    cost: 'Free',
    amenities: ['Tool lending rack', 'Wash basin for paints', 'Air conditioned', 'Free Wi-Fi'],
    activeHobbyistsCount: 12,
    description: 'Open public tables with shared paper cutters, cutting mats, and water basins. Great spot to meet fellow makers.',
    partnerBadge: 'People’s Association (PA)'
  },
  {
    id: 'space-3',
    name: 'SportSG Jalan Besar Multi-Court Arena',
    category: 'Sports Hub',
    address: '100 Tyrwhitt Rd',
    lat: 1.3115,
    lng: 103.8580,
    distanceKm: 1.5,
    cost: '$',
    amenities: ['Pickleball marked lines', 'Locker rooms', 'Water refilling station', 'Shaded roof'],
    activeHobbyistsCount: 16,
    description: 'Dedicated weekday morning & evening beginner pickleball drop-in courts.',
    partnerBadge: 'SportSG Official'
  },
  {
    id: 'space-4',
    name: 'Common Man Coffee Roasters Tasting Lab',
    category: 'Specialty Cafe',
    address: '22 Martin Rd',
    lat: 1.2910,
    lng: 103.8395,
    distanceKm: 1.8,
    cost: '$$',
    amenities: ['Espresso machine bar view', 'Fresh roasted beans', 'Barista advice', 'Open outdoor benches'],
    activeHobbyistsCount: 5,
    description: 'Welcoming space for home baristas and coffee enthusiasts to taste and talk extraction tips.',
    partnerBadge: 'Barista Guild'
  }
];

export const INITIAL_PLAN: HobbyPlan = {
  id: 'plan-latte-art',
  hobbyName: 'Latte Art & Milk Steaming',
  title: 'Silky Velvet Microfoam & Heart Pouring',
  category: 'Coffee & Gastronomy',
  difficulty: 'Beginner Friendly',
  timeCommitment: '15 mins/day',
  summary: 'Transform your morning caffeine fix into a rewarding creative craft. Master microfoam physics in 15-minute daily reps without buying an expensive $1,500 machine.',
  sourceBookmarks: [
    'tiktok.com/@baristadaily/video/72918239 - How to hold the pitcher angle',
    'instagram.com/reel/C89x1p - Dish soap water drill for zero-waste microfoam practice',
    'youtube.com/watch?v=k4L9 - The 3 mistakes preventing your latte art heart from blooming'
  ],
  healthBenefits: [
    'Morning Mindful Ritual (+38% calmer start to workday)',
    'Fine Motor Micro-Precision (+26% hand-eye steadiness)'
  ],
  starterGear: [
    {
      name: '12oz (350ml) Pointed-Spout Stainless Pitcher',
      estPrice: '$12–$16',
      note: 'Crucial pointed lip for sharp contrast cut-throughs',
      isEssential: true
    },
    {
      name: 'French Press or Handheld Nano-Foamer',
      estPrice: '$18',
      note: 'Pumping warm milk 40 times creates real cafe-grade velvet microfoam without a steam boiler',
      isEssential: true,
      trapWarning: 'Avoid buying $500 pro espresso machines before you master the pouring hand tilt!'
    },
    {
      name: 'Wide-Mouth Ceramic Tulip Cup (220–250ml)',
      estPrice: '$8',
      note: 'A rounded base allows milk to swirl smoothly beneath the espresso crema',
      isEssential: false
    }
  ],
  chapters: [
    {
      id: 1,
      title: 'Microfoam Physics & The Soap Water Drill',
      day: 'Day 1–3',
      dailyMinutes: 15,
      drill: 'Put cold water in your pitcher with 2 tiny drops of dish soap. Practice creating a central vortex until the surface resembles glossy wet white paint.',
      milestone: 'Zero large bubbles visible; milk shines like wet silk paint',
      completed: true,
      completedAt: 'Yesterday',
      xpReward: 35
    },
    {
      id: 2,
      title: 'Canvas Preparation & The High-Drop Pierce',
      day: 'Day 4–6',
      dailyMinutes: 15,
      drill: 'Pour milk from 4-5 inches high in a gentle, steady pencil-stream. Circular motion to dive beneath the crema without marking the top brown surface.',
      milestone: 'Consistent golden-brown crema base without white patches',
      completed: true,
      completedAt: 'Today',
      xpReward: 40
    },
    {
      id: 3,
      title: 'The Surface Kiss: Blooming the White Dot',
      day: 'Day 7–10',
      dailyMinutes: 15,
      drill: 'Bring the pitcher spout down to 0.5 cm from the cup surface, tilt the cup towards the spout, and increase flow rate slightly to watch the white orb bloom.',
      milestone: 'A crisp, opaque white circle expands across the canvas center',
      completed: false,
      xpReward: 50
    },
    {
      id: 4,
      title: 'The Clean Cut-Through: Heart Transformation',
      day: 'Day 11–14',
      dailyMinutes: 15,
      drill: 'When the circle reaches 3/4 size, lift the pitcher 2 inches, thin out the stream, and pull forward cleanly through the center to fold the dot into a heart.',
      milestone: 'Your first symmetrical latte art heart photo to share with your HobbyMate tribe',
      completed: false,
      xpReward: 65
    }
  ],
  suggestedSpaces: ['National Library Terrace', 'Bugis CC Lounge', 'Kurasu Communal Bench'],
  tribeTags: ['#LatteArtSG', '#HomeBarista', '#MorningRitual', '#15MinDrill']
};

export const INITIAL_USER_PROGRESS: UserProgress = {
  level: 3,
  levelTitle: 'Coffee Craftsman (Apprentice)',
  currentXP: 245,
  nextLevelXP: 350,
  streakDays: 4,
  totalMinutesPracticed: 165,
  cohortPercentile: 82, // Top 18% of their cohort
  cohortName: 'Singapore Beginners Cohort #14',
  completedDrillsCount: 6,
  healthMetrics: {
    stressReductionPct: 34,
    focusScorePct: 42,
    spatialAgilityPct: 28
  },
  badges: [
    {
      id: 'badge-1',
      title: '15-Min Habit Starter',
      description: 'Completed 3 consecutive 15-minute micro-drills',
      icon: 'zap',
      unlocked: true,
      unlockedAt: '3 days ago'
    },
    {
      id: 'badge-2',
      title: 'Microfoam Alchemist',
      description: 'Mastered silky wet-paint texture using the soap water drill',
      icon: 'sparkles',
      unlocked: true,
      unlockedAt: 'Yesterday'
    },
    {
      id: 'badge-3',
      title: 'Tribe Radar Beacon',
      description: 'Broadcasted live practice session to nearby mates on the map',
      icon: 'map-pin',
      unlocked: true,
      unlockedAt: 'Today'
    },
    {
      id: 'badge-4',
      title: 'Symmetrical Heart Master',
      description: 'Pour your first clean heart cut-through in Chapter 4',
      icon: 'award',
      unlocked: false
    }
  ]
};
