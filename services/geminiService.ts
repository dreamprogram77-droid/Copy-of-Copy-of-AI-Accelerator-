
import { GoogleGenAI, Type } from "@google/genai";
import { 
  NominationData,
  NominationAIResponse,
  ProjectEvaluationResult,
  OpportunityAnalysis,
  AIReviewResult,
  PartnerProfile,
  StartupRecord,
  ApplicantProfile,
  UserProfile,
  Question,
  AnalyticalQuestion,
  FailureSimulation,
  GovStats
} from "../types";

const FLASH_MODEL = "gemini-3-flash-preview";

// Helper to call Gemini
async function callGemini<T = string>(params: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  json?: boolean;
  schema?: any;
  temperature?: number;
}): Promise<T> {
  // Always use a new instance to ensure up-to-date API key
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

    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response.");

    if (params.json) {
      return JSON.parse(text.replace(/```json|```/g, '').trim()) as T;
    }

    return text as unknown as T;
  } catch (error) {
    console.error(`Gemini Service Error:`, error);
    throw error;
  }
}

/**
 * محرك مطابقة الشركاء المؤسسين (Smart Match Core)
 */
export const runPartnerMatchAI = async (seeker: StartupRecord, partners: PartnerProfile[]): Promise<any> => {
  const seekerContext = `
    المشروع: ${seeker.name}
    القطاع: ${seeker.industry}
    المرحلة: ${seeker.currentTrack}
    الاحتياج: ${seeker.needsRole}
    نمط العمل: ${seeker.workStyle}
    وصف مختصر: ${seeker.description}
  `;

  const partnersContext = partners.map(p => ({
    uid: p.uid,
    name: p.name,
    role: p.primaryRole,
    skills: p.skills,
    exp: p.experienceYears,
    hours: p.availabilityHours,
    city: p.city,
    style: p.workStyle,
    goal: p.goals,
    completion: p.profileCompletion
  }));

  const prompt = `أنت محرك مطابقة شركاء مؤسسين داخل حاضنة أعمال. 
المدخلات: 
1) ملف مؤسس: ${seekerContext}
2) قائمة شركاء: ${JSON.stringify(partnersContext)}

المطلوب:
- احسب درجة مطابقة من 0 إلى 100 لكل شريك باستخدام الأوزان:
  - تكامل الدور 30 (أهم شيء: هل هو الدور الذي يحتاجه المؤسس؟)
  - توافق المرحلة/الالتزام 20
  - خبرة المجال 15
  - الموقع/عن بعد 10
  - نمط العمل 10
  - هدف الشراكة 10
  - مؤشرات الجدية 5 (اكتمال البروفايل)
- أعد أعلى نتائج بترتيب تنازلي.
- لكل شريك أعطِ: score، 3 أسباب ترشيح قصيرة، و 1 مخاطرة محتملة.
أرجع النتيجة بصيغة JSON حصراً.`;

  return callGemini({
    prompt,
    systemInstruction: "أنت خبير HR ريادي ومحلل بيانات توافق. أرجع مصفوفة JSON تحتوي على كائنات {partnerUid, score, reasoning: [], risk}.",
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
        },
        required: ["partnerUid", "score", "reasoning", "risk"]
      }
    }
  });
};

export const evaluateProjectIdea = async (description: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
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

export const reviewDeliverableAI = async (taskTitle: string, taskDesc: string, startupContext: string): Promise<AIReviewResult> => {
  const prompt = `مراجعة مخرج رائد أعمال: المهمة: ${taskTitle}. السياق: ${startupContext}.`;
  return callGemini<AIReviewResult>({
    prompt,
    systemInstruction: "Digital Mentor reviewing task. Return JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        readinessScore: { type: Type.NUMBER },
        criticalFeedback: { type: Type.STRING },
        isReadyForHumanMentor: { type: Type.BOOLEAN },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

export const evaluateNominationForm = async (data: NominationData): Promise<NominationAIResponse> => {
  return callGemini<NominationAIResponse>({
    prompt: `حلل بيانات التقدم: ${JSON.stringify(data)}`,
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { 
        aiScore: { type: Type.NUMBER }, 
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }, 
        aiAnalysis: { type: Type.STRING }, 
        categorySuggestion: { type: Type.STRING } 
      }
    }
  });
};

export const discoverOpportunities = async (startupName: string, description: string, industry: string): Promise<OpportunityAnalysis> => {
  return callGemini<OpportunityAnalysis>({
    prompt: `Analyze ${startupName}: ${description}`,
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
              entryBarrier: { type: Type.STRING }, 
              potentialROI: { type: Type.STRING } 
            } 
          } 
        }, 
        untappedSegments: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              segmentName: { type: Type.STRING }, 
              needs: { type: Type.STRING }, 
              strategy: { type: Type.STRING } 
            } 
          } 
        }, 
        blueOceanIdea: { type: Type.STRING }, 
        quickWinAction: { type: Type.STRING } 
      } 
    }
  });
};

export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: FLASH_MODEL,
    config: {
      systemInstruction: "أنت مستشار ريادي ذكي يساعد المستخدمين في تحديد مسارهم في المسرعة. بعد بضع جولات من الأسئلة، أعطِ قراراً بصيغة JSON: ```json {\"decision\": \"APPROVED\" | \"REJECTED\", \"reason\": \"...\", \"feedback\": \"...\"} ```"
    }
  });
};

export const suggestIconsForLevels = async (): Promise<void> => {
  // Simplified implementation
  console.log("Suggesting icons...");
};

export const generateLevelMaterial = async (levelId: number, levelTitle: string, user: UserProfile): Promise<{content: string}> => {
  const prompt = `أنت موجه ريادي. ولد مادة تعليمية مكثفة للمستوى ${levelId}: ${levelTitle} لمشروع ${user.startupName}.`;
  const content = await callGemini<string>({ prompt, systemInstruction: "Professional entrepreneurship mentor." });
  return { content };
};

export const generateLevelQuiz = async (levelId: number, levelTitle: string, user: UserProfile): Promise<Question[]> => {
  const prompt = `ولد 3 أسئلة اختيارات للمستوى ${levelId}: ${levelTitle} لمشروع ${user.startupName}.`;
  return callGemini<Question[]>({
    prompt,
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER }
        },
        required: ["text", "options", "correctIndex"]
      }
    }
  });
};

export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  const prompt = `ولد 5 أسئلة تحليلية لمؤسس مشروع في قطاع ${profile.sector} بمرحلة ${profile.projectStage}.`;
  return callGemini<AnalyticalQuestion[]>({
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

export const runProjectAgents = async (name: string, desc: string, agents: string[]): Promise<any> => {
    const prompt = `بناء مشروع ${name} باستخدام الوكلاء المختارين: ${agents.join(', ')}. الوصف: ${desc}`;
    return callGemini({
        prompt,
        json: true,
        schema: {
            type: Type.OBJECT,
            properties: {
                vision: { type: Type.STRING },
                market: { type: Type.STRING },
                users: { type: Type.STRING },
                hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    });
};

export const generatePitchDeck = async (name: string, desc: string, results: any): Promise<{title: string, content: string}[]> => {
    const prompt = `ولد شرائح عرض تقديمي (Pitch Deck) لمشروع ${name}. النتائج السابقة: ${JSON.stringify(results)}`;
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

export const analyzeExportOpportunity = async (data: any): Promise<any> => {
    return callGemini({
        prompt: `حلل فرصة التصدير: ${JSON.stringify(data)}`,
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
    return callGemini({
        prompt: `أعطِ "الحقيقة القاسية" لبيانات التصدير هذه: ${JSON.stringify(data)}`,
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
    return callGemini({
        prompt: `ولد إحصائيات حكومية وهمية لقطاع التصدير بناءً على بيانات ذكية.`,
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

export const generateStartupIdea = async (data: any): Promise<string> => {
    return callGemini({ prompt: `ولد أفكار مشاريع ناشئة لقطاع ${data.sector} واهتمامات ${data.interest}` });
};

export const generateProjectDetails = async (data: any): Promise<string> => {
    return callGemini({ prompt: `ولد تفاصيل المشروع: ${JSON.stringify(data)}` });
};

export const generateProductSpecs = async (data: any): Promise<string> => {
    return callGemini({ prompt: `ولد مواصفات المنتج (MVP) لمشروع ${data.projectName}: ${data.description}` });
};

export const generateLeanBusinessPlan = async (data: any): Promise<string> => {
    return callGemini({ prompt: `ولد خطة عمل مرنة لشركة ${data.startupName} في قطاع ${data.industry}` });
};

export const generatePitchDeckOutline = async (data: any): Promise<any> => {
    return callGemini({
        prompt: `ولد هيكل عرض تقديمي لمشروع ${data.startupName}. المشكلة: ${data.problem}. الحل: ${data.solution}`,
        json: true,
        schema: {
            type: Type.OBJECT,
            properties: {
                slides: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            content: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    });
};

export const generateFounderCV = async (data: any): Promise<string> => {
    return callGemini({ prompt: `صمم سيرة ذاتية للمؤسس ${data.name}. الخبرة: ${data.experience}. المهارات: ${data.skills}. الرؤية: ${data.vision}` });
};
