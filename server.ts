import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback curated roadmaps if Gemini is not configured or in case of network issue
const FALLBACK_PLANS: Record<string, any> = {
  'latte-art': {
    title: 'Silky Milk Steaming & Heart Latte Art',
    category: 'Coffee & Gastronomy',
    difficulty: 'Beginner Friendly',
    timeCommitment: '15 mins/day',
    summary: 'Master velvety microfoam and pour your first clean latte art heart without an expensive espresso machine trap.',
    healthBenefits: ['Mindful Morning Ritual (+40%)', 'Hand-Eye Precision (+25%)'],
    starterGear: [
      { name: '12oz Stainless Steel Milk Pitcher', estPrice: '$12', note: 'Pointed spout for easy heart control' },
      { name: 'Handheld Nano-Foamer or French Press', estPrice: '$18', note: 'Creates genuine micro-foam without $1,000 steam boiler' },
      { name: 'Wide Ceramic Tulip Cup (250ml)', estPrice: '$8', note: 'Wide canvas surface prevents overflow' }
    ],
    chapters: [
      {
        id: 1,
        title: 'Microfoam Physics & Whirlpool Creation',
        day: 'Day 1–3',
        dailyMinutes: 15,
        drill: 'Practice creating a vortex with cold soapy water (2 drops dish soap + water) to see microfoam texture without wasting milk.',
        milestone: 'Silky wet-paint texture achieved without large bubbles',
        completed: false
      },
      {
        id: 2,
        title: 'Canvas Foundation: The High-Pour Drop',
        day: 'Day 4–6',
        dailyMinutes: 15,
        drill: 'Pour milk from 5 inches high in gentle circular motion to pierce crema without leaving white marks on top.',
        milestone: 'Even brown crema base with zero surface blemishes',
        completed: false
      },
      {
        id: 3,
        title: 'The Surface Kiss: Blooming the Dot',
        day: 'Day 7–10',
        dailyMinutes: 15,
        drill: 'Bring pitcher tip within 0.5 cm of milk surface, tilt cup, and gently wiggle to see the white sphere bloom.',
        milestone: 'A distinct, crisp white circle expands on top',
        completed: false
      },
      {
        id: 4,
        title: 'The Clean Cut-Through',
        day: 'Day 11–14',
        dailyMinutes: 15,
        drill: 'Lift pitcher 2 inches, pour a thin pencil stream, and pull forward through the white dot to fold it into a heart.',
        milestone: 'Symmetrical heart latte art photo to share with tribe',
        completed: false
      }
    ],
    suggestedSpaces: ['Third-wave cafe communal tables', 'Neighborhood coffee roasters'],
    tribeTags: ['#LatteArtSG', '#HomeBarista', '#EspressoNerd']
  },
  'urban-sketching': {
    title: 'Loose Pocket Watercolor Urban Sketching',
    category: 'Visual Arts',
    difficulty: 'Absolute Beginner',
    timeCommitment: '15 mins/day',
    summary: 'Capture spontaneous street scenes, cafe corners, and neighborhood shophouses using just 1 waterproof pen and a 12-pan pocket palette.',
    healthBenefits: ['Stress Reduction (-32%)', 'Observational Mindfulness (+45%)'],
    starterGear: [
      { name: 'Fineliner Waterproof Pen (0.3mm)', estPrice: '$3.50', note: 'Pigment ink that will not smudge with water' },
      { name: 'A6 100% Cotton Watercolor Sketchbook', estPrice: '$14', note: 'Sturdy 300gsm cold-press paper' },
      { name: 'Water-Brush Pen with reservoir', estPrice: '$6', note: 'No open water cup needed on park benches' }
    ],
    chapters: [
      {
        id: 1,
        title: 'Continuous Line Sight-Drafting',
        day: 'Day 1–3',
        dailyMinutes: 15,
        drill: 'Draw your coffee cup or room corner without lifting the pen from the page for 5 minutes. Embrace wobbly lines!',
        milestone: 'Filled 3 pages of expressive, energetic ink contours',
        completed: false
      },
      {
        id: 2,
        title: 'Two-Wash Value Contrast',
        day: 'Day 4–6',
        dailyMinutes: 15,
        drill: 'Apply 1 light transparent wash across lit areas, then drop in dark pigment under roofs/awnings for instant sunlit depth.',
        milestone: 'Convincing sunlight and shadow separation',
        completed: false
      },
      {
        id: 3,
        title: 'Speed Sketching People on the Move',
        day: 'Day 7–10',
        dailyMinutes: 15,
        drill: 'Capture passersby in 30-second silhouettes using brush strokes before they walk out of frame.',
        milestone: '5 lively street figures captured in action',
        completed: false
      },
      {
        id: 4,
        title: 'Cafe Façade or Landmark Sketch',
        day: 'Day 11–14',
        dailyMinutes: 15,
        drill: 'Meet your HobbyMate at a local cafe and complete a 15-minute pocket sketch together over tea.',
        milestone: 'Finished streetscape with date & location stamp',
        completed: false
      }
    ],
    suggestedSpaces: ['Public library terrace', 'Botanical gardens shady pavilion', 'Heritage shophouse cafes'],
    tribeTags: ['#UrbanSketchers', '#PleinAir', '#WatercolorDaily']
  }
};

// API: Parse social media likes, bookmarks & interest prompts into a 15-min daily roadmap
app.post('/api/analyze-interests', async (req: Request, res: Response) => {
  try {
    const { rawInput, hobbyName, experienceLevel, dailyMinutes = 15 } = req.body;

    if (!rawInput && !hobbyName) {
      return res.status(400).json({ error: 'Please provide either bookmarks/reels links or a hobby name.' });
    }

    const targetHobby = hobbyName || 'Creative Craft';

    // Check if AI is available
    if (ai) {
      try {
        const prompt = `You are HobbyPulse's expert hobby mentor. The user wants to learn or deepen their hobby based on their social media bookmarks/saved reels/input.
User prompt or saved links/topics: "${rawInput || ''}"
Hobby: "${targetHobby}"
Experience: "${experienceLevel || 'Beginner'}"
Daily time limit: ${dailyMinutes} minutes/day (Must strictly be 15-minute micro-habits that fit a busy daily lifestyle).

Generate a structured, motivating JSON object matching this exact schema:
{
  "title": "Inspiring catchy hobby roadmap title",
  "category": "e.g. Visual Arts, Gastronomy, Sports, Tech, Music, Outdoor, Craft",
  "difficulty": "Beginner Friendly | Intermediate | Advanced",
  "timeCommitment": "${dailyMinutes} mins/day",
  "summary": "1-2 inspiring sentences explaining why 15 mins daily makes this approachable without feeling overwhelmed.",
  "healthBenefits": ["Mindfulness / Stress relief metric", "Cognitive / physical metric"],
  "starterGear": [
    {"name": "Tool name", "estPrice": "$10-$20", "note": "Budget-friendly tip to avoid overspending early"}
  ],
  "chapters": [
    {
      "id": 1,
      "title": "Chapter 1 title",
      "day": "Day 1–3",
      "dailyMinutes": ${dailyMinutes},
      "drill": "Very concrete 15-minute exercise the user can do today with zero fuss",
      "milestone": "A clear rewarding micro-achievement",
      "completed": false
    },
    {
      "id": 2,
      "title": "Chapter 2 title",
      "day": "Day 4–6",
      "dailyMinutes": ${dailyMinutes},
      "drill": "Concrete 15-min drill progressing naturally",
      "milestone": "Micro-achievement",
      "completed": false
    },
    {
      "id": 3,
      "title": "Chapter 3 title",
      "day": "Day 7–10",
      "dailyMinutes": ${dailyMinutes},
      "drill": "Actionable 15-min drill",
      "milestone": "Micro-achievement",
      "completed": false
    },
    {
      "id": 4,
      "title": "Chapter 4 title",
      "day": "Day 11–14",
      "dailyMinutes": ${dailyMinutes},
      "drill": "Culminating 15-min mini-project to share with their HobbyMate tribe",
      "milestone": "Shareable milestone badge",
      "completed": false
    }
  ],
  "suggestedSpaces": ["2 local spots like community centers, public libraries, makerspaces, parks"],
  "tribeTags": ["#tag1", "#tag2", "#tag3"]
}

Return ONLY clean valid JSON. No markdown backticks if possible.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, plan: parsed, source: 'gemini' });
      } catch (err: any) {
        console.warn('Gemini generateContent error, falling back to curated template:', err.message);
      }
    }

    // Graceful fallback if no key or error
    const key = (targetHobby.toLowerCase().includes('latte') || targetHobby.toLowerCase().includes('coffee'))
      ? 'latte-art'
      : 'urban-sketching';
    const fallback = FALLBACK_PLANS[key] || FALLBACK_PLANS['urban-sketching'];
    
    // Customize title slightly for user's hobby
    const customized = {
      ...fallback,
      title: targetHobby ? `${targetHobby}: 15-Minute Daily Mastery` : fallback.title,
    };

    return res.json({ success: true, plan: customized, source: 'curated' });
  } catch (error: any) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ error: 'Failed to generate hobby roadmap.' });
  }
});

// API: Organic chat with AI Hobby Mentor
app.post('/api/coach-chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentHobby, currentStep } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }

    const lastMessage = messages[messages.length - 1]?.content || 'Hello!';

    if (ai) {
      try {
        const systemInstruction = `You are Pulse, an empathetic, energizing, zero-fluff hobby mentor. 
Key principles:
1. Keep replies conversational, concise, friendly, and practical (2-3 short paragraphs max, no jargon).
2. The user has only 15 minutes today! Focus on how they can take one small approachable step right now.
3. Recommend finding nearby HobbyMates on the map to share spaces, trade tips, or stay accountable.
4. If they ask about buying gear, steer them away from expensive traps ($500+ gear for beginners) and suggest budget-friendly DIY or entry tools.
Current user hobby: ${currentHobby || 'General Skills'}
Current active milestone: ${currentStep || 'Getting Started'}`;

        const chatContents = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: chatContents,
          config: {
            systemInstruction,
          }
        });

        const reply = response.text || "That's a fantastic step! Even 15 minutes today builds lasting momentum. Have you checked if there are fellow HobbyMates nearby practicing the same thing?";
        return res.json({ success: true, reply });
      } catch (err: any) {
        console.warn('Gemini chat error, using helpful fallback response:', err.message);
      }
    }

    // Curated organic mentor responses
    const cannedReplies = [
      `That's a classic sticking point! Remember: you don't need a 2-hour marathon to make progress. Just commit to 15 minutes with one small drill today. Consistency beats intensity every single time. Have you checked the live map to see if any HobbyMates are practicing nearby?`,
      `Great question! One of the biggest pitfalls when starting ${currentHobby || 'a new skill'} is buying expensive gear before you've mastered the fundamentals. Stick to the budget essentials and focus on muscle memory first. Want to review today's 15-minute milestone together?`,
      `You're doing fantastic! Comparing yourself relatively to your yesterday self is what counts. You're already in the top 35% of consistent learners this week. Let's knock out today's micro-drill!`
    ];
    const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Error in coach chat:', error);
    return res.status(500).json({ error: 'Failed to get coach response.' });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HobbyPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
