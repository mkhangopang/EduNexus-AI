declare module "@google/genai" {
  export interface GenerateContentResponse {
    text?: string;
    [key: string]: any;
  }

  export interface GoogleGenAIOptions {
    apiKey?: string;
    [key: string]: any;
  }

  export class GoogleGenAI {
    constructor(opts?: GoogleGenAIOptions);
    models: {
      generateContent: (args: any) => Promise<GenerateContentResponse>;
      [key: string]: any;
    };
  }
}

declare module "@google/generative-ai" {
  export interface GenerateContentResponse {
    text?: string;
    [key: string]: any;
  }

  export interface GoogleGenAIOptions {
    apiKey?: string;
    [key: string]: any;
  }

  export class GoogleGenAI {
    constructor(opts?: GoogleGenAIOptions);
    models: {
      generateContent: (args: any) => Promise<GenerateContentResponse>;
      [key: string]: any;
    };
  }

  // The actual package exports `GoogleGenerativeAI` at runtime.
  export class GoogleGenerativeAI {
    constructor(apiKey?: string | { apiKey?: string } );
    getGenerativeModel: (params: any) => any;
  }
}
