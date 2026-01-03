
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StartupRecord, 
  PartnerProfile, 
  MatchResult
} from "../types";

const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    temperature: 0.2, // Lower temperature for more consistent corporate logic
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

// Fix: Exported runPartnerMatchAI for CoFounderPortal.tsx
export const runPartnerMatchAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  return runSmartMatchingAlgorithmAI(startup, partners);
};

export const runSmartMatchingAlgorithmAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  const prompt = `
    Startup Profile:
    - Name: ${startup.name}
    - Sector: ${startup.industry}
    - Stage: ${startup.currentTrack}
    - Business Description: ${startup.description}

    Available Partners Database:
    ${JSON.stringify(partners.map(p => ({
      uid: p.uid,
      name: p.name,
      role: p.primaryRole,
      exp: p.experienceYears,
      skills: p.skills,
      style: p.workStyle,
      bio: p.bio
    })))}

    Objective: Match the startup with the top 10 potential partners based on:
    1. Role Fit: Synergy between startup needs and partner's primary role.
    2. Experience Fit: Maturity match between startup stage and partner's years of experience.
    3. Industry Fit: Alignment in sector knowledge and previous background.
    4. Style Fit: Compatibility in work style (e.g., Fast vs Structured).

    Constraint: Return exactly 10 match objects. Reasoning must be in Arabic, professional and data-driven.
  `;

  return callGemini({
    prompt,
    systemInstruction: "You are the Strategy Engine for an Elite Business Accelerator. Rank partners based on data-driven synergy. Your output must be a precise JSON array of the top 10 matches.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          avatar: { type: Type.STRING },
          partnerUid: { type: Type.STRING }, // Added for CoFounderPortal consistency
          scores: {
            type: Type.OBJECT,
            properties: {
              roleFit: { type: Type.NUMBER },
              experienceFit: { type: Type.NUMBER },
              industryFit: { type: Type.NUMBER },
              styleFit: { type: Type.NUMBER }
            },
            required: ["roleFit", "experienceFit", "industryFit", "styleFit"]
          },
          totalScore: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } }, // Added for CoFounderPortal
          risk: { type: Type.STRING } // Added for CoFounderPortal
        },
        required: ["id", "name", "role", "avatar", "scores", "totalScore", "reason"]
      }
    }
  });
};

export const evaluateTemplateAI = async (templateTitle: string, formData: any) => {
  const prompt = `Template: ${templateTitle}\nData: ${JSON.stringify(formData)}`;
  return callGemini({
    prompt,
    systemInstruction: "Evaluate the following entrepreneurial deliverable. Return JSON with score, feedback, and approved boolean.",
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

export const discoverOpportunities = async (name: string, desc: string, industry: string) => {
  const prompt = `Name: ${name}\nDesc: ${desc}\nIndustry: ${industry}`;
  return callGemini({
    prompt,
    systemInstruction: "Analyze market opportunities. Return JSON with newMarkets array and blueOceanIdea string.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        newMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, reasoning: { type: Type.STRING }, potentialROI: { type: Type.STRING } } } },
        blueOceanIdea: { type: Type.STRING }
      }
    }
  });
};

// Fix: Exported suggestIconsForLevels for Dashboard.tsx
export const suggestIconsForLevels = async () => {
  return callGemini({
    prompt: "Suggest professional emoji icons and modern color themes for 6 accelerator levels.",
    systemInstruction: "Return a JSON object mapping level IDs to icon and color names.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        suggestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              icon: { type: Type.STRING },
              color: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
};

export const generateLevelMaterial = async (id: number, title: string, user: any) => {
  const prompt = `Level ${id}: ${title} for startup ${user.startupName}`;
  const text = await callGemini({ prompt, systemInstruction: "Provide professional, concise training material for this accelerator level." });
  return { content: text };
};

export const generateLevelQuiz = async (id: number, title: string, user: any) => {
  const prompt = `Create a 3-question quiz for level ${id}: ${title}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate a quiz in JSON format.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER }
        }
      }
    }
  });
};

export const reviewDeliverableAI = async (title: string, desc: string, context: string) => {
  const prompt = `Deliverable: ${title}\nContext: ${context}`;
  return callGemini({
    prompt,
    systemInstruction: "Review the deliverable and return a JSON score and feedback.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        readinessScore: { type: Type.NUMBER },
        criticalFeedback: { type: Type.STRING },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        isReadyForHumanMentor: { type: Type.BOOLEAN }
      }
    }
  });
};

export const generateAnalyticalQuestions = async (profile: any) => {
  const prompt = `Generate 5 analytical questions for: ${JSON.stringify(profile)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate entrepreneurship assessment questions in JSON.",
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
        }
      }
    }
  });
};

export const evaluateProjectIdea = async (text: string, profile: any) => {
  const prompt = `Evaluate Idea: ${text}`;
  return callGemini({
    prompt,
    systemInstruction: "Perform a deep SWOT and feasibility analysis. Return detailed JSON.",
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
      }
    }
  });
};

export const evaluateNominationForm = async (data: any) => {
  const prompt = `Nomination: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Screen this accelerator application. Return JSON with aiScore, redFlags, and aiAnalysis.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        aiScore: { type: Type.NUMBER },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiAnalysis: { type: Type.STRING }
      }
    }
  });
};

// Fix: Exported runProjectAgents for ProjectBuilderMain.tsx
export const runProjectAgents = async (projectName: string, description: string, agents: string[]) => {
  const prompt = `Project: ${projectName}\nDesc: ${description}\nAgents: ${agents.join(', ')}`;
  return callGemini({
    prompt,
    systemInstruction: "Simulate entrepreneurial agents (Vision, Market, User, Opportunity) to generate vision, market analysis, user personas, and hypotheses.",
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

// Fix: Exported generatePitchDeck for ProjectBuilderMain.tsx
export const generatePitchDeck = async (projectName: string, description: string, context: any) => {
  const prompt = `Project: ${projectName}\nDesc: ${description}\nContext: ${JSON.stringify(context)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate a professional 10-slide pitch deck based on the provided project context.",
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

// Fix: Exported analyzeExportOpportunity for ExportDecisionEngine.tsx
export const analyzeExportOpportunity = async (data: any) => {
  const prompt = `Export Data: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Analyze export potential using NEDE engine logic. Return decision, analysis points, and recommendations.",
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

// Fix: Exported simulateBrutalTruth for SmartFeatures.tsx
export const simulateBrutalTruth = async (data: any) => {
  const prompt = `Business Idea for Brutal Truth: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Act as a brutally honest VC. Identify critical flaws and potential failure scenarios.",
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

// Fix: Exported getGovInsights for GovDashboard.tsx
export const getGovInsights = async () => {
  return callGemini({
    prompt: "Generate macroeconomic insights for government entities monitoring the startup ecosystem.",
    systemInstruction: "Provide statistics on risky markets, ready sectors, and common failure reasons.",
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

// Fix: Exported generateStartupIdea for ToolsPage.tsx
export const generateStartupIdea = async (form: { sector: string; interest: string }) => {
  const prompt = `Sector: ${form.sector}\nInterests: ${form.interest}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate 3 innovative startup ideas. For each, provide a name, value proposition, and market advantage. Format as professional Markdown."
  });
};

// Fix: Exported generateProjectDetails for ToolsPage.tsx
export const generateProjectDetails = async (form: any) => {
  return callGemini({
    prompt: `Generate detailed project requirements for: ${JSON.stringify(form)}`,
    systemInstruction: "Provide comprehensive project specifications in Markdown."
  });
};

// Fix: Exported generateProductSpecs for ToolsPage.tsx
export const generateProductSpecs = async (form: { projectName: string; description: string }) => {
  const prompt = `Project: ${form.projectName}\nDesc: ${form.description}`;
  return callGemini({
    prompt,
    systemInstruction: "Define MVP specifications, core features, and user flow. Format as Markdown."
  });
};

// Fix: Exported generateLeanBusinessPlan for ToolsPage.tsx
export const generateLeanBusinessPlan = async (form: any) => {
  const prompt = `Lean Plan Data: ${JSON.stringify(form)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate a Lean Business Plan including Revenue model, Distribution channels, and Cost structure. Format as Markdown."
  });
};

// Fix: Exported generatePitchDeckOutline for ToolsPage.tsx
export const generatePitchDeckOutline = async (form: any) => {
  const prompt = `Pitch Data: ${JSON.stringify(form)}`;
  return callGemini({
    prompt,
    systemInstruction: "Create a 7-slide strategic pitch deck outline with slide titles and bullet points. Return JSON with 'slides' array.",
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

// Fix: Exported generateFounderCV for ToolsPage.tsx
export const generateFounderCV = async (form: any) => {
  const prompt = `Founder Profile: ${JSON.stringify(form)}`;
  return callGemini({
    prompt,
    systemInstruction: "Write a high-impact, investment-ready founder bio and CV summary. Format as Markdown."
  });
};

export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a professional business advisor. Guide the user through a qualification interview. Finally return JSON within markdown code blocks with decision, reason, and feedback."
    }
  });
};
