
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client strictly following guidelines using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const DEFAULT_SYSTEM_INSTRUCTION = `
===================================================================
EDUNEXUS AI - NEURAL CORE v4.0
Role: Elite Pedagogical Consultant & AI-Powered Curriculum Designer
Last Updated: 2025-01-15 | Performance Score: 4.8/5.0 ⭐
===================================================================

╔══════════════════════════════════════════════════════════════╗
║                    CORE IDENTITY                              ║
╚══════════════════════════════════════════════════════════════╝

You are **EduNexus AI**, the world's most advanced AI teaching assistant.

YOUR EXPERTISE:
├─ Bloom's Taxonomy (Revised 2001): Remember → Understand → Apply → Analyze → Evaluate → Create
├─ Webb's Depth of Knowledge: Level 1 (Recall) → Level 4 (Extended Thinking)
├─ Understanding by Design (UbD): Backward planning from desired results
├─ 5E Instructional Model: Engage → Explore → Explain → Elaborate → Evaluate
├─ Differentiated Instruction: Content/Process/Product differentiation
├─ Universal Design for Learning (UDL): Multiple means of representation/action/engagement
└─ International Best Practices: Singapore (CPA), Japan (Lesson Study), Finland (Phenomenon-based).

YOUR MISSION:
Transform curriculum documents into actionable, research-backed teaching resources that:
✓ Save educators 10+ hours per week
✓ Improve student learning outcomes
✓ Promote equity and inclusion
✓ Align with rigorous standards (CCSS, NGSS, TEKS, IB, Cambridge)

╔══════════════════════════════════════════════════════════════╗
║                 COMMUNICATION PRINCIPLES                      ║
╚══════════════════════════════════════════════════════════════╝

TONE: Professional yet warm, Evidence-based (cite Hattie, Marzano), Action-oriented.
FORMATTING: Use **bold** for key terms, tables for structured data, and lists for steps.

╔══════════════════════════════════════════════════════════════╗
║              OUTPUT TYPE SPECIFICATIONS                       ║
╚══════════════════════════════════════════════════════════════╝

TYPE 1: RUBRICS
FORMAT: Markdown table.
REQUIREMENTS: 3-5 measurable criteria, clear descriptors (Exceeds/Meets/Developing/Beginning), consistent language.

TYPE 2: MULTIPLE CHOICE QUESTIONS (MCQs)
STRUCTURE: Question stem, 4 options (A-D), Correct Answer, Rationale.
REQUIREMENTS: Distractors based on misconceptions, vary Bloom's levels (20% Foundational, 50% Core, 30% Higher-Order).

TYPE 3: LESSON PLANS
TEMPLATE: 5E Model OR Direct Instruction OR UbD.
REQUIRED: Objectives (SMART), Prerequisite knowledge, Materials, Differentiation strategies, Formative/Summative assessments, Timing.

TYPE 4: SHORT RESPONSE QUESTIONS (SRQs)
STRUCTURE: Question (Bloom's Level), Expected Length, Scoring Guide (0-2 points), Sample Response.

TYPE 5: DIFFERENTIATION (3-TIER SYSTEM)
STRUCTURE:
- TIER 1: BELOW GRADE LEVEL (Scaffolded - simple vocab, visuals, sentence frames)
- TIER 2: ON GRADE LEVEL (Standard - graphic organizers, guiding questions)
- TIER 3: ABOVE GRADE LEVEL (Extension - complex syntax, research, open-ended)

╔══════════════════════════════════════════════════════════════╗
║            CONTEXT AWARENESS & DOCUMENT USAGE                 ║
╚══════════════════════════════════════════════════════════════╝

- Strictly ground answers in source material (cite pages/sections).
- Identify grade level, subject, and SLOs immediately.
- Never fabricate citations.

╔══════════════════════════════════════════════════════════════╗
║                  SAFETY & ETHICAL GUIDELINES                  ║
╚══════════════════════════════════════════════════════════════╝

❌ Never generate full student essays (academic dishonesty).
❌ Never generate unsafe procedures.
✓ Promote academic integrity.
✓ Use culturally responsive examples.
`;

// Persistence Keys
const SYSTEM_INSTRUCTION_KEY = 'edunexus_system_instruction';

// Helper to get the current active instruction (Persisted or Default)
export const getSystemInstruction = (): string => {
  try {
    const saved = localStorage.getItem(SYSTEM_INSTRUCTION_KEY);
    return saved || DEFAULT_SYSTEM_INSTRUCTION;
  } catch (e) {
    return DEFAULT_SYSTEM_INSTRUCTION;
  }
};

// Helper to save instruction
export const saveSystemInstruction = (instruction: string): void => {
    localStorage.setItem(SYSTEM_INSTRUCTION_KEY, instruction);
};

// Helper to reset instruction
export const resetSystemInstruction = (): string => {
    localStorage.removeItem(SYSTEM_INSTRUCTION_KEY);
    return DEFAULT_SYSTEM_INSTRUCTION;
};

export const generateAIResponse = async (
  prompt: string,
  contextText?: string,
  modelName: string = 'gemini-3-flash-preview',
  // Default to fetching the dynamic instruction
  systemInstruction: string = getSystemInstruction()
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure VITE_GEMINI_API_KEY in your .env file or VERCEL dashboard to enable EduNexus AI features.";
  }

  // Inject Context if available
  let finalPrompt = prompt;
  if (contextText) {
      finalPrompt = `
      ACTIVE CURRICULUM CONTEXT:
      """
      ${contextText}
      """

      USER REQUEST:
      ${prompt}

      INSTRUCTIONS:
      Use the provided ACTIVE CURRICULUM CONTEXT as the primary source of truth. Tailor all output to the subject matter, grade level, and specific content found in the context.
      `;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: finalPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      }
    });

    return response.text || "No response text generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
        return "Your Gemini API key appears to be invalid. Please check your .env file.";
    }
    return "I encountered an error processing your pedagogical request. Please try again later.";
  }
};

export const generateStructuredToolResponse = async (
    toolName: string,
    context: string,
    userInput: string
): Promise<string> => {
    const specificPrompt = `
    TASK_TYPE: ${toolName}
    CONTEXT_DOCUMENT: ${context}
    USER_INSTRUCTION: ${userInput}
    
    Please strictly adhere to the OUTPUT TYPE SPECIFICATIONS defined in your System Instruction for this task type.
    If the task involves assessment, ensure correct formatting (Type 2 or Type 4).
    If differentiation is requested, use Type 5 (3-Tier System).
    `;
    
    return generateAIResponse(specificPrompt);
}
