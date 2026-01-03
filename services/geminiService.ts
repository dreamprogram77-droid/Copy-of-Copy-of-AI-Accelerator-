
// Fix: Added missing types and implemented callGemini helper and all exported functions according to guidelines.
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ApplicantProfile, 
  NominationData, 
  StartupRecord, 
  PartnerProfile, 
  NominationResult,
  AnalyticalQuestion,
  ProjectEvaluationResult,
  AIReviewResult,
  FailureSimulation,
  GovStats,
  Question
} from "../types";

// Helper to call Gemini API right before each request as per guidelines.
const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    temperature: 0.7,
    topP: 0.95,
  };

  if (params.systemInstruction) {
    config.systemInstruction = params.systemInstruction;
  }

  if (params.json && params.schema) {
    config.responseMimeType = "application/json";
    config.responseSchema = params.schema;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: params.prompt,
    config,
  });

  if (params.json) {
    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("JSON parse failed", response.text);
      throw e;
    }
  }

  return response.text;
};

export const evaluateTemplateAI = async (templateTitle: string, formData: any): Promise<{ score: number, feedback: string, approved: boolean }> => {
  const prompt = `اسم القالب: ${templateTitle}\nالبيانات المدخلة: ${JSON.stringify(formData)}`;
  
  return callGemini({
    prompt,
    systemInstruction: "أنت مستشار في مسرعة أعمال عالمية. قم بتقييم القالب بناءً على وضوح المنطق والجدوى. أرجع النتيجة بصيغة JSON حصراً.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        approved: { type: Type.BOOLEAN }
      },
      required: ["score", "feedback", "approved"]
    }
  });
};

export const discoverOpportunities = async (name: string, desc: string, industry: string): Promise<{ newMarkets: any[], blueOceanIdea: string }> => {
  const prompt = `اسم المشروع: ${name}\nالوصف: ${desc}\nالقطاع: ${industry}`;
  return callGemini({
    prompt,
    systemInstruction: "استخدم وكلاء Gemini لاكتشاف أسواق جديدة غير مخدومة لمشروعك واستراتيجية محيط أزرق. أرجع JSON.",
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

export const suggestIconsForLevels = async () => {
  // Logic to suggest UI updates via AI
  return;
};

export const generateLevelMaterial = async (id: number, title: string, user: any) => {
  const prompt = `المستوى: ${id} - ${title}\nالمشروع: ${user.startupName}`;
  const text = await callGemini({
    prompt,
    systemInstruction: "اكتب مادة تعليمية ريادية مكثفة وعملية لهذا المستوى. استخدم فقرات تفصلها سطرين."
  });
  return { content: text };
};

export const generateLevelQuiz = async (id: number, title: string, user: any): Promise<Question[]> => {
  const prompt = `المستوى: ${id} - ${title}`;
  return callGemini({
    prompt,
    systemInstruction: "ولد 3 أسئلة اختيارات من متعدد لاختبار استيعاب المحتوى. أرجع JSON ARRAY.",
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

export const reviewDeliverableAI = async (title: string, desc: string, context: string): Promise<AIReviewResult> => {
  const prompt = `المهمة: ${title}\nالوصف: ${desc}\nسياق المشروع: ${context}`;
  return callGemini({
    prompt,
    systemInstruction: "راجع المخرج التنفيذي المرفوع. أرجع JSON يحتوي على readinessScore, criticalFeedback, suggestedNextSteps, isReadyForHumanMentor.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        readinessScore: { type: Type.NUMBER },
        criticalFeedback: { type: Type.STRING },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        isReadyForHumanMentor: { type: Type.BOOLEAN }
      },
      required: ["readinessScore", "criticalFeedback", "suggestedNextSteps", "isReadyForHumanMentor"]
    }
  });
};

export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "أنت مستشار ريادي خبير. حاور المستخدم لتحديد أهليته للبرنامج. في النهاية أرجع JSON مسيج بـ ```json يحتوي على decision (APPROVED/REJECTED), reason, feedback."
    }
  });
};

export const generateAnalyticalQuestions = async (profile: ApplicantProfile): Promise<AnalyticalQuestion[]> => {
  const prompt = `القطاع: ${profile.sector}\nمرحلة المشروع: ${profile.projectStage}\nالتحدي: ${profile.goal}`;
  return callGemini({
    prompt,
    systemInstruction: "ولد 5 أسئلة تحليلية ريادية مخصصة لهذا المتقدم. أرجع JSON ARRAY.",
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

export const evaluateProjectIdea = async (text: string, profile: ApplicantProfile): Promise<ProjectEvaluationResult> => {
  const prompt = `وصف الفكرة: ${text}\nالبروفايل: ${JSON.stringify(profile)}`;
  return callGemini({
    prompt,
    systemInstruction: "حلل فكرة المشروع من حيث الجدوى والابتكار. أرجع JSON مفصل.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.NUMBER },
        classification: { type: Type.STRING },
        clarity: { type: Type.NUMBER },
        value: { type: Type.NUMBER },
        innovation: { type: Type.NUMBER },
        market: { type: Type.NUMBER },
        readiness: { type: Type.NUMBER },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiOpinion: { type: Type.STRING }
      },
      required: ["totalScore", "classification", "clarity", "value", "innovation", "market", "readiness", "strengths", "weaknesses", "aiOpinion"]
    }
  });
};

export const runProjectAgents = async (name: string, desc: string, agents: string[]) => {
  const prompt = `مشروع: ${name}\nوصف: ${desc}\nالوكلاء المختارون: ${agents.join(',')}`;
  return callGemini({
    prompt,
    systemInstruction: "حاكي ردود وكلاء الذكاء الاصطناعي لبناء المشروع. أرجع JSON يحتوي على vision, market, users, hypotheses.",
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

export const generatePitchDeck = async (name: string, desc: string, results: any) => {
  const prompt = `المشروع: ${name}\nنتائج البناء: ${JSON.stringify(results)}`;
  return callGemini({
    prompt,
    systemInstruction: "صغ عرضاً تقديمياً (Pitch Deck) استثمارياً من 7 شرائح. أرجع JSON ARRAY من شرائح تحتوي على title و content.",
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

export const analyzeExportOpportunity = async (data: any) => {
  const prompt = JSON.stringify(data);
  return callGemini({
    prompt,
    systemInstruction: "أنت محرك NEDE لاتخاذ قرار التصدير. حلل البيانات وأعط قراراً وتوصيات. أرجع JSON.",
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
  const prompt = JSON.stringify(data);
  return callGemini({
    prompt,
    systemInstruction: "أنت محرك 'الحقيقة القاسية'. كن ناقداً ومباشراً جداً حول احتمالات فشل المشروع. أرجع JSON.",
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
    prompt: "أعط رؤى استراتيجية للجهات الحكومية حول قطاعات التصدير.",
    systemInstruction: "أرجع JSON يحتوي على riskyMarkets, readySectors, commonFailReasons, regulatoryGaps.",
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

export const generateStartupIdea = async (form: any) => {
  const prompt = `اهتماماتي: ${form.interest}\nالقطاع: ${form.sector}`;
  return callGemini({
    prompt,
    systemInstruction: "اقترح 3 أفكار لمشاريع ناشئة ابتكارية. أرجع نصاً منسقاً بالماركداون."
  });
};

export const generateFounderCV = async (form: any) => {
  const prompt = JSON.stringify(form);
  return callGemini({
    prompt,
    systemInstruction: "صمم بروفايل مؤسس (CV) ريادي احترافي يركز على المهارات والرؤية. أرجع نصاً منسقاً."
  });
};

export const generateProductSpecs = async (form: any) => {
  const prompt = `المشروع: ${form.projectName}\nالوصف: ${form.description}`;
  return callGemini({
    prompt,
    systemInstruction: "حدد المزايا الجوهرية (Core Features) للـ MVP وصمم رحلة المستخدم. أرجع نصاً منسقاً."
  });
};

export const generateLeanBusinessPlan = async (form: any) => {
  const prompt = JSON.stringify(form);
  return callGemini({
    prompt,
    systemInstruction: "ابنِ خطة عمل مرنة (Lean Business Plan) تغطي كافة المحاور الاستراتيجية. أرجع نصاً منسقاً."
  });
};

export const generatePitchDeckOutline = async (form: any) => {
  const prompt = JSON.stringify(form);
  return callGemini({
    prompt,
    systemInstruction: "صغ هيكلاً قوياً لعرض تقديمي استثماري. أرجع JSON يحتوي على slides ARRAY.",
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

export const evaluateNominationForm = async (data: NominationData): Promise<{ aiScore: number, redFlags: string[], aiAnalysis: string }> => {
  const prompt = JSON.stringify(data);
  return callGemini({
    prompt,
    systemInstruction: "قيم طلب الترشيح للمسرعة. أعطِ درجة من 20 ورصد أي علامات خطر (Red Flags). أرجع JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        aiScore: { type: Type.NUMBER },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiAnalysis: { type: Type.STRING }
      },
      required: ["aiScore", "redFlags", "aiAnalysis"]
    }
  });
};

export const runPartnerMatchAI = async (startup: StartupRecord, partners: PartnerProfile[]) => {
  const prompt = `المشروع: ${JSON.stringify(startup)}\nقائمة الشركاء: ${JSON.stringify(partners)}`;
  return callGemini({
    prompt,
    systemInstruction: "قم بمطابقة المشروع مع أفضل الشركاء المتاحين. أرجع JSON ARRAY من {partnerUid, score, reasoning, risk}.",
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

export const generateProjectDetails = async (form: any) => {
  return generateStartupIdea(form);
};
