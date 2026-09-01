import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Client-Approved Product Guidance Data for Server
const CLIENT_APPROVED_GUIDANCE = {
  'resin': {
    productName: 'Titan Pure Himalayan Shilajit Resin',
    productSlug: 'titan-shilajit-resin',
    recommendedServing: '300–500 mg daily (a pea-sized portion measured with the included spoon)',
    maximumDailyServing: '500 mg daily',
    recommendedTiming: 'First thing in the morning on an empty stomach, dissolved in lukewarm water, green tea, or warm milk',
    minimumSuggestedRoutine: '60 to 90 consecutive days for natural metabolic adaptation and consistent vitality',
    safetyNotes: 'Not recommended for pregnant or lactating women, children under 18, or individuals with diagnosed kidney disorders without prior healthcare professional consultation.'
  },
  'honey-sticks-classic': {
    productName: 'Titan Shilajit Honey Sticks — Classic Honey',
    productSlug: 'titan-honey-sticks-classic',
    recommendedServing: '1 stick (approx. 10g containing 350mg purified Shilajit) daily',
    maximumDailyServing: '1 stick daily',
    recommendedTiming: 'Morning with breakfast or 30 minutes before workout / demanding physical or mental tasks',
    minimumSuggestedRoutine: '30 to 60 consecutive days',
    safetyNotes: 'Contains pure Himalayan raw honey. Not suitable for infants under 12 months or individuals with bee pollen allergies.'
  },
  'honey-sticks-dark-chocolate': {
    productName: 'Titan Shilajit Honey Sticks — Dark Chocolate',
    productSlug: 'titan-honey-sticks-dark-chocolate',
    recommendedServing: '1 stick daily (containing 350mg purified Shilajit and organic 70% raw cacao)',
    maximumDailyServing: '1 stick daily',
    recommendedTiming: 'Mid-day energy dip or post-workout recovery snack',
    minimumSuggestedRoutine: '30 to 60 consecutive days',
    safetyNotes: 'Contains raw cacao and wild honey. Avoid if allergic to cocoa or honey.'
  },
  'honey-sticks-strawberry': {
    productName: 'Titan Shilajit Honey Sticks — Strawberry',
    productSlug: 'titan-honey-sticks-strawberry',
    recommendedServing: '1 stick daily (infused with natural wild Himalayan strawberry extract)',
    maximumDailyServing: '1 stick daily',
    recommendedTiming: 'Morning booster or afternoon refreshing wellness break',
    minimumSuggestedRoutine: '30 to 60 consecutive days',
    safetyNotes: 'Contains pure fruit extracts and wild honey. Store in a cool, dry place.'
  },
  'bundle-ritual': {
    productName: 'The Titan Vitality Ritual Box',
    productSlug: 'titan-vitality-ritual-box',
    recommendedServing: '300–500 mg resin at home in the morning; 1 honey stick when traveling',
    maximumDailyServing: '500 mg daily',
    recommendedTiming: 'Morning ritual + active days',
    minimumSuggestedRoutine: '60 to 90 consecutive days',
    safetyNotes: 'Complete comprehensive protocol. Consult a doctor if taking medications.'
  }
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Titan Shilajit', timestamp: new Date().toISOString() });
});

// API: Wellness Assessment Submission
app.post('/api/assessment', async (req, res) => {
  try {
    const data = req.body;

    // Safety Screening Check
    const hasSafetyRestriction =
      data.isPregnantOrBreastfeeding ||
      data.isUnderMedicalTreatment ||
      data.takesPrescriptionMedication ||
      data.hasDiagnosedMedicalCondition ||
      data.hasIngredientAllergies;

    if (hasSafetyRestriction) {
      return res.json({
        primaryGoal: Array.isArray(data.wellnessGoals) && data.wellnessGoals.length > 0 ? data.wellnessGoals[0] : 'General Wellness',
        lifestyleSummary: `${data.lifestyle || 'Active'} lifestyle profile`,
        suggestedProduct: 'Healthcare Professional Consultation Recommended',
        productSlug: 'titan-shilajit-resin',
        whyThisFits: 'Based on your safety questionnaire responses (medical treatment, prescription medications, pregnancy/nursing, or potential allergies), our strict safety policy requires consulting your primary physician before starting any botanical supplement routine.',
        suggestedRoutine: [
          {
            time: 'Primary Step',
            action: 'Physician Consultation',
            details: 'Share the Titan Shilajit product specifications with your doctor for approval.'
          }
        ],
        approvedServing: 'To be determined exclusively by your qualified healthcare provider.',
        approvedTiming: 'As advised by your physician.',
        consistencyDuration: 'Pending medical guidance.',
        whatYouMayNotice: 'Personal health and safety is the highest priority.',
        safetyAdvisory: 'For your safety, please speak with a qualified healthcare professional before starting any new supplement.',
        isSafetyRestricted: true
      });
    }

    // Determine candidate product category based on lifestyle & goals
    const goals: string[] = Array.isArray(data.wellnessGoals) ? data.wellnessGoals : ['Energy & Daily Vitality'];
    const lifestyle = data.lifestyle || 'Moderately Active';
    const userName = data.name || 'Valued Customer';

    let chosenKey: keyof typeof CLIENT_APPROVED_GUIDANCE = 'resin';
    if (goals.some(g => g.includes('Workout') || g.includes('Endurance') || g.includes('Athlete')) && goals.length > 2) {
      chosenKey = 'bundle-ritual';
    } else if (goals.some(g => g.includes('Better Daily Routine') || g.includes('Focus'))) {
      chosenKey = 'honey-sticks-dark-chocolate';
    } else if (goals.some(g => g.includes('Stress') || g.includes('Women') || g.includes('General'))) {
      chosenKey = 'honey-sticks-strawberry';
    } else if (lifestyle === 'Very Active' || lifestyle === 'Athlete / Gym') {
      chosenKey = 'resin';
    } else {
      chosenKey = 'resin';
    }

    const guidance = CLIENT_APPROVED_GUIDANCE[chosenKey];
    const ai = getGeminiClient();

    let dynamicAnalysis = {
      lifestyleSummary: `${lifestyle} routine with focus on ${goals.slice(0, 2).join(' & ')}`,
      whyThisFits: `Titan Shilajit brings mineral-rich Himalayan bioactives to support your goal of ${goals.join(', ')} alongside your ${lifestyle.toLowerCase()} lifestyle.`,
      whatYouMayNotice: 'Some users may notice changes in natural morning alertness, workout stamina, or routine consistency over 3 to 6 weeks. Individual experiences vary.'
    };

    if (ai) {
      const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      const prompt = `User Assessment Details:
- Name: ${userName}
- Age: ${data.age || 'Adult'}
- Lifestyle: ${lifestyle}
- Wellness Goals: ${goals.join(', ')}
- Sleep: ${data.sleepDuration || '7-8 hours'}
- Exercise: ${data.exerciseFrequency || 'Regular'}
- Matched Product: ${guidance.productName}

Provide a personalized, respectful, and sophisticated 3-sentence analysis:
1. lifestyleSummary: A 1-sentence description of the user's active rhythm.
2. whyThisFits: A 1-2 sentence non-medical explanation of why this product fits their selected goals.
3. whatYouMayNotice: A cautious 1-2 sentence note (e.g., "Some users may notice changes in energy or routine consistency over time. Individual experiences vary. Do not guarantee outcomes.")

Format strictly as JSON.`;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: `You are Titan Shilajit's wellness education assistant. You provide general educational information about the brand's products based only on approved product information and user-selected wellness goals. You do not diagnose diseases, prescribe treatments, recommend stopping medications, or create medical dosage calculations. You must use only the dosage and usage values supplied in the approved product guidance configuration. Never calculate dosage based on height or weight. Never make clinical diagnosis claims.`,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  lifestyleSummary: { type: Type.STRING },
                  whyThisFits: { type: Type.STRING },
                  whatYouMayNotice: { type: Type.STRING }
                },
                required: ['lifestyleSummary', 'whyThisFits', 'whatYouMayNotice']
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            dynamicAnalysis = {
              lifestyleSummary: parsed.lifestyleSummary || dynamicAnalysis.lifestyleSummary,
              whyThisFits: parsed.whyThisFits || dynamicAnalysis.whyThisFits,
              whatYouMayNotice: parsed.whatYouMayNotice || dynamicAnalysis.whatYouMayNotice
            };
            break;
          }
        } catch (genErr) {
          console.warn(`Gemini model ${model} temporarily unavailable, trying next if available:`, genErr);
        }
      }
    }

    const result = {
      primaryGoal: goals[0] || 'Energy & Daily Vitality',
      lifestyleSummary: dynamicAnalysis.lifestyleSummary,
      suggestedProduct: guidance.productName,
      productSlug: guidance.productSlug,
      whyThisFits: dynamicAnalysis.whyThisFits,
      suggestedRoutine: [
        {
          time: 'Morning (Within 30 mins of waking)',
          action: 'Core Titan Shilajit Serving',
          details: `${guidance.recommendedServing}. ${guidance.recommendedTiming}.`
        },
        {
          time: 'Hydration Anchor',
          action: 'Mineral Assimilation Water',
          details: 'Drink 300ml–500ml of room temperature water to support cellular mineral transport.'
        },
        {
          time: 'Consistency Milestone',
          action: 'Daily Ritual Continuity',
          details: `Maintain this exact sequence for ${guidance.minimumSuggestedRoutine}.`
        }
      ],
      approvedServing: guidance.recommendedServing,
      approvedTiming: guidance.recommendedTiming,
      consistencyDuration: guidance.minimumSuggestedRoutine,
      whatYouMayNotice: dynamicAnalysis.whatYouMayNotice,
      safetyAdvisory: guidance.safetyNotes,
      isSafetyRestricted: false
    };

    res.json(result);
  } catch (error) {
    console.error('Assessment API error:', error);
    res.status(500).json({ error: 'Failed to process wellness assessment.' });
  }
});

// Helper for smart fallback answers if all AI models are undergoing temporary peak demand
function getDomainFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('dissolve') || lower.includes('drink') || lower.includes('water') || lower.includes('how to use') || lower.includes('how to take') || lower.includes('morning')) {
    return "To use Titan Pure Himalayan Shilajit Resin, take a pea-sized portion (300–500 mg, using the included brass measuring spoon) and dissolve it into a glass of lukewarm water, green tea, or warm milk first thing in the morning on an empty stomach. Stir gently until completely dissolved. For best results, maintain this ritual daily for 60 to 90 consecutive days.";
  }
  if (lower.includes('flavor') || lower.includes('honey stick') || lower.includes('stick') || lower.includes('chocolate') || lower.includes('strawberry')) {
    return "Titan Shilajit Honey Sticks come in 3 artisanal flavors infused with 100% pure Himalayan raw honey: 1) Classic Raw Honey (₹999), 2) 70% Dark Chocolate & Cacao (₹1099), and 3) Wild Strawberry (₹1099). Each single-serve stick delivers 350mg of purified Shilajit resin with zero added cane sugar or preservatives.";
  }
  if (lower.includes('how long') || lower.includes('last') || lower.includes('20g') || lower.includes('jar') || lower.includes('serving')) {
    return "A single 20g jar of Titan Pure Shilajit Resin contains 40 to 60 daily servings based on the recommended 300–500 mg morning serving. For individual guidance or to reorder on WhatsApp, message our Delhi team at +91 99584 74229.";
  }
  if (lower.includes('pure') || lower.includes('lab') || lower.includes('heavy metal') || lower.includes('certificate') || lower.includes('fulvic')) {
    return "Titan Shilajit is wild-harvested above 16,000 feet in the Himalayan peaks. It undergoes traditional Ayurvedic Shodhana water-and-sun purification and is third-party lab tested for heavy metals and contaminants. Each batch contains >75% fulvic acid and 84+ ionic trace minerals.";
  }
  return "Welcome to Titan Shilajit. Titan Pure Shilajit Resin is taken in 300–500mg servings dissolved in warm water each morning to support natural daily vitality. For personal questions or instant orders, feel free to connect with our Delhi concierge directly on WhatsApp at +91 99584 74229.";
}

// API: Wellness AI Advisor Chat Endpoint
app.post('/api/wellness-chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: getDomainFallbackReply(message)
      });
    }

    const systemInstruction = `You are Titan Shilajit's wellness education assistant for a luxury Indian D2C brand.
Brand Info:
- Products: Titan Pure Himalayan Shilajit Resin (20g, ₹1499), Titan Shilajit Honey Sticks (Classic Honey ₹999, Dark Chocolate ₹1099, Strawberry ₹1099), The Titan Vitality Ritual Box (₹2199), Honey Sticks Trio (₹1999).
- Sourced at 16,000+ ft altitude in the Himalayas.
- Lab tested for heavy metals, >75% fulvic acid, 84+ ionic trace minerals.
- Approved dosage: 300–500 mg/day for resin; 1 stick/day for honey sticks.
- Ordering is handled via official WhatsApp: +91 99584 74229 (Delhi, India).
- Rules: Do NOT diagnose diseases, prescribe treatments, recommend stopping medications, or calculate medical dosages based on height/weight. Keep answers concise, elegant, respectful, and grounded in approved product facts. Always mention that individual experiences vary.`;

    const chatContents = [
      ...conversationHistory.slice(-4).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let generatedReply: string | null = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: chatContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        if (response.text) {
          generatedReply = response.text;
          break;
        }
      } catch (genErr) {
        console.warn(`Gemini model ${model} unavailable (e.g. high demand/503), attempting next candidate:`, genErr);
      }
    }

    if (generatedReply) {
      return res.json({ reply: generatedReply });
    }

    // Graceful high-quality domain fallback reply if all models are momentarily busy
    return res.json({ reply: getDomainFallbackReply(message) });
  } catch (err) {
    console.error('Wellness chat unexpected error:', err);
    return res.json({
      reply: getDomainFallbackReply(req.body?.message || '')
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Titan Shilajit server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
