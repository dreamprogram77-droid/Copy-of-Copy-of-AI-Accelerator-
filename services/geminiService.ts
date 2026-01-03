
import { GoogleGenAI, Type } from "@google/genai";
import { ApplicantProfile, AnalyticalQuestion, ProjectEvaluationResult, NominationData, StartupRecord, PartnerProfile, MatchResult } from "../types";

const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = { temperature: 0.1, topP: 0.95 };

  if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
  if (params.json && params.schema) {
    config.responseMimeType = "application/json";
    config.responseSchema = params.schema;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: params.prompt,
    config,
  });

  return params.json ? JSON.parse(response.text || "{}") : response.text;
};

/* Evaluates an incubation application returning score and feedback */
export const evaluateIncubationApplication = async (data: any) => {
  const prompt = `Analyze this startup incubation application:
  Name: ${data.name}
  Industry: ${data.industry}
  Description: ${data.description}
  Problem: ${data.problem}
  Solution: ${data.solution}
  Market: ${data.market}
  Commitment: ${data.commitment} hours/week

  Criteria:
  1. Business Logic: Is the problem real? Is the solution feasible?
  2. Market Fit: Is the target market large enough?
  3. Professionalism: Is the application detailed and serious?

  Return a Fit Score (0-100) and critical feedback in Arabic.`;

  return callGemini({
    prompt,
    systemInstruction: "You are the Head of Admission at a top-tier business accelerator. Be strict, objective, and data-driven.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        fitScore: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        decision: { type: Type.STRING, description: "One of: APPROVED, REVIEW_REQUIRED, REJECTED" },
        isElite: { type: Type.BOOLEAN, description: "True if score > 90" }
      },
      required: ["fitScore", "feedback", "decision", "isElite"]
    }
  });
};

/* Reviews a deliverable submitted by a startup */
export const reviewDeliverableAI = async (title: string, desc: string, context: string) => {
  const prompt = `Deliverable: ${title}\nContext: ${context}`;
  return callGemini({
    prompt,
    systemInstruction: "Review the deliverable and return a JSON score (0-100) and feedback in Arabic.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        isReadyForHuman: { type: Type.BOOLEAN },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        criticalFeedback: { type: Type.STRING }
      },
      required: ["score", "feedback", "isReadyForHuman"]
    }
  });
};

/* Analyzes market opportunities for a given startup context */
export const discoverOpportunities = async (name: string = '', desc: string = '', industry: string = '') => {
  const prompt = `Analyze opportunities for: Name: ${name}, Desc: ${desc}, Industry: ${industry}`;
  return callGemini({
    prompt,
    systemInstruction: "Discover new markets and blue ocean ideas.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        newMarkets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              region: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              potentialROI: { type: Type.STRING }
            }
          }
        },
        blueOceanIdea: { type: Type.STRING }
      },
      required: ["newMarkets", "blueOceanIdea"]
    }
  });
};

/* Mock function for suggesting level icons via AI */
export const suggestIconsForLevels = async () => {
  return;
};

/* Creates a chat session for pathfinder assessment */
export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a pathfinder advisor. After 4-5 turns, return a JSON block in markdown: ```json {\"decision\": \"APPROVED\", \"reason\": \"...\", \"feedback\": \"...\"} ```"
    }
  });
};

/* Generates analytical questions for the filtration stage */
export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  const prompt = `Generate 5 analytical questions for sector: ${profile.sector}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER },
          difficulty: { type: Type.STRING }
        },
        required: ["text", "options", "correctIndex", "difficulty"]
      }
    }
  });
};

/* Evaluates a project idea for feasibility and innovation */
export const evaluateProjectIdea = async (text: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
  const prompt = `Evaluate: ${text}\nSector: ${profile.sector}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        clarity: { type: Type.NUMBER },
        value: { type: Type.NUMBER },
        innovation: { type: Type.NUMBER },
        market: { type: Type.NUMBER },
        readiness: { type: Type.NUMBER },
        totalScore: { type: Type.NUMBER },
        classification: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiOpinion: { type: Type.STRING }
      },
      required: ["clarity", "value", "innovation", "market", "readiness", "totalScore", "classification", "strengths", "weaknesses", "aiOpinion"]
    }
  });
};

/* Runs multiple AI agents to build project vision and analysis */
export const runProjectAgents = async (name: string, desc: string, agents: string[]) => {
  const prompt = `Run agents ${agents.join(',')} for project ${name}: ${desc}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        vision: { type: Type.STRING },
        market: { type: Type.STRING },
        users: { type: Type.ARRAY, items: { type: Type.STRING } },
        hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

/* Generates a pitch deck structure from build results */
export const generatePitchDeck = async (name: string, desc: string, results: any) => {
  const prompt = `Generate pitch deck for ${name}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        }
      }
    }
  });
};

/* Analyzes global export opportunities for industrial products */
export const analyzeExportOpportunity = async (data: any) => {
  const prompt = `Analyze export: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        decision: { type: Type.STRING },
        analysis: {
          type: Type.OBJECT,
          properties: {
            demand: { type: Type.STRING },
            regulations: { type: Type.STRING },
            risks: { type: Type.STRING },
            seasonality: { type: Type.STRING }
          }
        },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

/* Simulates potential failure scenarios for a given export plan */
export const simulateBrutalTruth = async (data: any) => {
  const prompt = `Brutal truth for export: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        brutalTruth: { type: Type.STRING },
        probability: { type: Type.NUMBER },
        financialLoss: { type: Type.STRING },
        operationalImpact: { type: Type.STRING },
        missingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        recoveryPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

/* Provides high-level insights for government oversight */
export const getGovInsights = async () => {
  const prompt = `Generate gov insights`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        riskyMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, failRate: { type: Type.NUMBER } } } },
        readySectors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER } } } },
        commonFailReasons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { reason: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } },
        regulatoryGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

/* Specialized tools for startup document generation */
export const generateStartupIdea = async (data: any) => callGemini({ prompt: `Idea for ${JSON.stringify(data)}` });
export const generateFounderCV = async (data: any) => callGemini({ prompt: `CV for ${JSON.stringify(data)}` });
export const generateProductSpecs = async (data: any) => callGemini({ prompt: `Specs for ${JSON.stringify(data)}` });
export const generateLeanBusinessPlan = async (data: any) => callGemini({ prompt: `Plan for ${JSON.stringify(data)}` });
export const generatePitchDeckOutline = async (data: any) => callGemini({ prompt: `Outline for ${JSON.stringify(data)}` });

/* Evaluates a nomination form using AI scoring */
export const evaluateNominationForm = async (data: NominationData) => {
  const prompt = `Evaluate nomination: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        aiScore: { type: Type.NUMBER },
        aiAnalysis: { type: Type.STRING },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

/* Evaluates specific executive template submissions */
export const evaluateTemplateAI = async (title: string, data: any) => {
  const prompt = `Evaluate template ${title}: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        approved: { type: Type.BOOLEAN }
      }
    }
  });
};

/* Matches a startup with a list of potential partners */
export const runPartnerMatchAI = async (startup: StartupRecord, partners: PartnerProfile[]) => {
  const prompt = `Match startup ${startup.name} with partners: ${JSON.stringify(partners.slice(0,10))}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          partnerUid: { type: Type.STRING },
          score: { type: Type.NUMBER },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
          risk: { type: Type.STRING }
        }
      }
    }
  });
};

/* Deep algorithmic matching for co-founder synergy */
export const runSmartMatchingAlgorithmAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  const prompt = `Algorithm match startup ${startup.name}`;
  return callGemini({
    prompt,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          partnerUid: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          totalScore: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
          scores: {
            type: Type.OBJECT,
            properties: {
              roleFit: { type: Type.NUMBER },
              experienceFit: { type: Type.NUMBER },
              industryFit: { type: Type.NUMBER },
              styleFit: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });
};
