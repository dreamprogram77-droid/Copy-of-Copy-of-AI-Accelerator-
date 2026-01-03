
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { 
  NominationData,
  NominationAIResponse,
  ProjectEvaluationResult,
  OpportunityAnalysis,
  AIReviewResult,
  ApplicantProfile,
  AnalyticalQuestion,
  FailureSimulation,
  GovStats
} from "../types";

const FLASH_MODEL = "gemini-3-flash-preview";

// Helper to call Gemini with standard configuration
async function callGemini<T = string>(params: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  json?: boolean;
  schema?: any;
  temperature?: number;
}): Promise<T> {
  // Use named parameter and obtain API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = params.model || FLASH_MODEL;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: params.prompt,
      config: {
        systemInstruction: params.systemInstruction,
        responseMimeType: params.json ? "application/json" : "text/plain",
        responseSchema: params.schema,
        temperature: params.temperature ?? 0.7,
      },
    });

    // Access .text property directly as per guidelines
    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response.");

    if (params.json) {
      // Clean possible markdown wrappers around JSON
      return JSON.parse(text.replace(/```json|```/g, '').trim()) as T;
    }

    return text as unknown as T;
  } catch (error) {
    console.error(`Gemini Service Error:`, error);
    throw error;
  }
}

/**
 * AI Mentor: مراجعة مخرجات رائد الأعمال
 */
export const reviewDeliverableAI = async (taskTitle: string, taskDesc: string, startupContext: string): Promise<AIReviewResult> => {
  const prompt = `مراجعة مخرج رائد أعمال:
  المهمة: ${taskTitle}
  وصفها: ${taskDesc}
  سياق المشروع: ${startupContext}
  
  المطلوب:
  1. تقييم الجدية والجاهزية من 100.
  2. تقديم نقد بناء (Feedback).
  3. هل الملف يستحق مراجعة مرشد بشري (Expert)؟ (إذا كانت الدرجة > 75).
  4. اقتراح خطوات قادمة.`;

  return callGemini<AIReviewResult>({
    prompt,
    systemInstruction: "أنت 'الموجه الرقمي' في مسرعة أعمال. مهمتك مراجعة مخرجات رواد الأعمال بدقة وصرامة لتصفية الحالات الجادة فقط للمرشدين البشريين.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        readinessScore: { type: Type.NUMBER },
        criticalFeedback: { type: Type.STRING },
        isReadyForHumanMentor: { type: Type.BOOLEAN },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["readinessScore", "criticalFeedback", "isReadyForHumanMentor", "suggestedNextSteps"]
    }
  });
};

export const suggestIconsForLevels = async (levels: any[]): Promise<Record<number, string>> => {
  const levelsSummary = levels.map((l: any) => `ID: ${l.id}, Title: ${l.title}, Description: ${l.description}`).join('\n');
  const prompt = `Based on levels, suggest one emoji icon for each ID.\n\n${levelsSummary}`;
  try {
    const res = await callGemini<{ iconMappings: { levelId: number, emoji: string }[] }>({
      prompt,
      systemInstruction: "UI/UX iconographer. Return JSON object.",
      json: true,
      schema: {
        type: Type.OBJECT,
        properties: {
          iconMappings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                levelId: { type: Type.NUMBER },
                emoji: { type: Type.STRING }
              },
              required: ["levelId", "emoji"]
            }
          }
        },
        required: ["iconMappings"]
      }
    });
    const final: Record<number, string> = {};
    res.iconMappings?.forEach(m => final[m.levelId] = m.emoji);
    return final;
  } catch (e) { return {}; }
};

export const evaluateNominationForm = async (data: any): Promise<NominationAIResponse> => {
  const prompt = `حلل بيانات التقدم: ${JSON.stringify(data)}`;
  return callGemini<NominationAIResponse>({
    prompt,
    systemInstruction: "Professional incubator evaluator. Return JSON with aiScore, redFlags, aiAnalysis, categorySuggestion.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        aiScore: { type: Type.NUMBER },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiAnalysis: { type: Type.STRING },
        categorySuggestion: { type: Type.STRING }
      },
      required: ["aiScore", "redFlags", "aiAnalysis", "categorySuggestion"]
    }
  });
};

export const evaluateProjectIdea = async (description: string, profile: any): Promise<ProjectEvaluationResult> => {
  return callGemini<ProjectEvaluationResult>({
    prompt: `تقييم فكرة: ${description} في قطاع ${profile.sector}`,
    systemInstruction: "Venture Capital advisor. Score 0-20 for Clarity, Value, Innovation, Market, Readiness. Return JSON.",
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
        aiOpinion: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        classification: { type: Type.STRING }
      },
      required: ["clarity", "value", "innovation", "market", "readiness", "totalScore", "aiOpinion", "strengths", "weaknesses", "classification"]
    }
  });
};

export const discoverOpportunities = async (startupName: string, description: string, industry: string): Promise<OpportunityAnalysis> => {
  const prompt = `Analyze ${startupName} in ${industry}: ${description}`;
  return callGemini<OpportunityAnalysis>({
    prompt,
    systemInstruction: "Opportunity explorer. Return JSON with newMarkets, untappedSegments, blueOceanIdea, quickWinAction.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        newMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, reasoning: { type: Type.STRING }, entryBarrier: { type: Type.STRING }, potentialROI: { type: Type.STRING } } } },
        untappedSegments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { segmentName: { type: Type.STRING }, needs: { type: Type.STRING }, strategy: { type: Type.STRING } } } },
        blueOceanIdea: { type: Type.STRING },
        quickWinAction: { type: Type.STRING }
      }
    }
  });
};

export const generateLevelMaterial = async (levelId: number, title: string, user: any): Promise<{ content: string; exercise: string }> => {
  return callGemini<{ content: string; exercise: string }>({
    prompt: `Produce learning material for level ${levelId}: ${title} for startup ${user.startupName}.`,
    json: true,
    schema: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, exercise: { type: Type.STRING } } }
  });
};

export const generateLevelQuiz = async (levelId: number, title: string, user: any): Promise<any[]> => {
  return callGemini<any[]>({
    prompt: `3 quiz questions for level ${levelId}: ${title}.`,
    json: true,
    schema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, text: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, explanation: { type: Type.STRING } } } }
  });
};

export const createPathFinderChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: FLASH_MODEL,
    config: {
      systemInstruction: "أنت مستشار ريادي خبير. هدفك هو تقييم جدية رائد الأعمال وفكرته من خلال محادثة قصيرة. في نهاية المحادثة، إذا قررت قبوله، أرسل رسالة تحتوي على بلوك JSON كالتالي: ```json {\"decision\": \"APPROVED\", \"reason\": \"تحليل مفصل...\", \"feedback\": \"رد مشجع...\"} ``` أو REJECTED مع الأسباب بنفس التنسيق.",
    }
  });
};

export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  return callGemini<AnalyticalQuestion[]>({
    prompt: `Generate 5 analytical multiple choice questions for an entrepreneur in the ${profile.sector} sector at ${profile.projectStage} stage.`,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER },
          difficulty: { type: Type.STRING, description: 'Easy, Medium, or Hard' }
        },
        required: ["text", "options", "correctIndex", "difficulty"]
      }
    }
  });
};

export const runProjectAgents = async (name: string, desc: string, agents: string[]) => {
  return callGemini<{ vision: string; market: string; users: string; hypotheses: string[] }>({
    prompt: `Generate project foundations for "${name}". Description: ${desc}. Activating agents: ${agents.join(', ')}.`,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        vision: { type: Type.STRING },
        market: { type: Type.STRING },
        users: { type: Type.STRING },
        hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["vision", "market", "users", "hypotheses"]
    }
  });
};

export const generatePitchDeck = async (name: string, desc: string, results: any) => {
  return callGemini<{ title: string; content: string }[]>({
    prompt: `Create a 5-slide pitch deck structure for "${name}" based on these results: ${JSON.stringify(results)}`,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    }
  });
};

export const analyzeExportOpportunity = async (data: any) => {
  return callGemini({
    prompt: `Analyze export opportunity for: ${JSON.stringify(data)}`,
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

export const simulateBrutalTruth = async (data: any): Promise<FailureSimulation> => {
  return callGemini<FailureSimulation>({
    prompt: `Give the brutal truth and risks for exporting ${data.productType} to ${data.targetMarket}. Be realistic and critical.`,
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

export const getGovInsights = async (): Promise<GovStats> => {
  return callGemini<GovStats>({
    prompt: "Generate macro insights for export regulators regarding risky markets, ready sectors, and regulatory gaps.",
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

export const generateStartupIdea = async (form: { sector: string; interest: string }) => {
  return callGemini({
    prompt: `Suggest a brilliant startup idea in ${form.sector} sector for someone interested in ${form.interest}.`,
    systemInstruction: "Innovative entrepreneurship mentor."
  });
};

export const generateProjectDetails = async (data: any) => {
  return callGemini({ prompt: `Elaborate on this project idea: ${JSON.stringify(data)}` });
};

export const generateProductSpecs = async (form: any) => {
  return callGemini({
    prompt: `Draft MVP technical specifications for project "${form.projectName}". Description: ${form.description}`,
    systemInstruction: "Tech Product Manager."
  });
};

export const generateLeanBusinessPlan = async (form: any) => {
  return callGemini({
    prompt: `Generate a one-page lean business plan for ${form.startupName} in ${form.industry}. Problem: ${form.problem}. Solution: ${form.solution}. Market: ${form.targetMarket}.`,
    systemInstruction: "Startup Strategist."
  });
};

export const generatePitchDeckOutline = async (form: any) => {
  return callGemini<{ slides: { title: string; content: string }[] }>({
    prompt: `Create a pitch deck outline for "${form.startupName}". Key problem: ${form.problem}. Solution: ${form.solution}.`,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, content: { type: Type.STRING } }
          }
        }
      }
    }
  });
};

export const generateFounderCV = async (form: any) => {
  return callGemini({
    prompt: `Write a compelling entrepreneur profile for ${form.name}. Experience: ${form.experience}. Skills: ${form.skills}. Vision: ${form.vision}.`,
    systemInstruction: "Professional CV writer specializing in startup founders."
  });
};
