import { Chat, GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyBKMmroRsmJ4hx30s_33tldMPEstXu8iPQ";
let ai: GoogleGenAI;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.error("API_KEY environment variable not set. The application will not be able to connect to the Gemini API.");
}

const getModel = (modelName: 'gemini' | 'imagen') => {
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. Please check your API_KEY.");
    }
    if (modelName === 'gemini') {
        return 'gemini-2.5-flash';
    }
    return 'imagen-3.0-generate-002';
}

async function generateContent(prompt: string): Promise<string> {
    if (!ai) throw new Error("API_KEY is not configured.");
    
    try {
        const response = await ai.models.generateContent({
            model: getModel('gemini'),
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) throw new Error(error.message);
        throw new Error("An unknown error occurred during the API call.");
    }
}

// --- Code Assistant Functions ---
export const runCodeReview = (code: string) => generateContent(`
    You are an expert senior software engineer acting as a world-class, automated code reviewer. 
    Your task is to provide a concise, constructive, and professional code review of the following code snippet.
    Do not be conversational. Get straight to the review.

    Structure your feedback into the following sections using markdown-like bolding (e.g., **Section Name:**).
    1. **Overall Summary:** A brief, high-level overview of the code's quality, purpose, and structure.
    2. **Bugs & Potential Issues:** Identify any bugs, logic errors, or unhandled edge cases. Be specific.
    3. **Performance:** Highlight any potential performance bottlenecks and suggest specific optimizations.
    4. **Readability & Style:** Comment on code style, naming conventions, clarity, and adherence to language-specific idioms.
    5. **Best Practices & Suggestions:** Recommend modern practices, alternative approaches, design patterns, or security improvements.

    If the code is perfect and has no issues, state that clearly and provide a brief justification.

    Here is the code to review:
    \`\`\`
    ${code}
    \`\`\`
`);

export const generateSolution = (code: string, feedback: string) => generateContent(`
    You are an expert senior software engineer. Based on the original code and the following review feedback, provide a complete, corrected version of the code.
    Address all the points from the feedback.
    Only output the corrected code block. Do not include explanations, markdown formatting like \`\`\`, or any other text outside of the raw code.

    **Original Code:**
    \`\`\`
    ${code}
    \`\`\`

    **Review Feedback:**
    ${feedback}
`);

export const runCodeExplanation = (code: string) => generateContent(`
    You are an expert software engineer and educator. Explain the following code snippet in a clear, concise, and easy-to-understand manner.
    
    Structure your explanation into the following sections using markdown-like bolding:
    1. **What it Does:** A high-level summary of the code's purpose.
    2. **How it Works:** A step-by-step breakdown of the logic.
    3. **Complexity Analysis:** Briefly analyze the time and space complexity (e.g., O(n)).

    Here is the code to explain:
    \`\`\`
    ${code}
    \`\`\`
`);

export const runTestGeneration = (code: string) => generateContent(`
    You are an expert QA engineer specializing in automated testing. Your task is to write a comprehensive suite of unit tests for the following code snippet.
    - Use a popular testing framework relevant to the code's language (e.g., Jest for JavaScript/TypeScript, pytest for Python).
    - Cover main functionality, edge cases, and potential error conditions.
    - Only output the test code block. Do not include explanations, markdown formatting like \`\`\`, or any other text outside of the raw code.

    Here is the code to test:
    \`\`\`
    ${code}
    \`\`\`
`);

export const runCodeRefactor = (code: string) => generateContent(`
    You are an expert senior software engineer specializing in code optimization and clean code principles.
    Refactor the following code for improved readability, performance, and maintainability.
    - Apply relevant design patterns and best practices.
    - Add comments only where necessary to clarify complex logic.
    - Only output the refactored code block. Do not include explanations, markdown formatting like \`\`\`, or any other text outside of the raw code.

    Here is the code to refactor:
    \`\`\`
    ${code}
    \`\`\`
`);

export const generatePrompt = (description: string) => generateContent(`
    You are an expert prompt engineer. Your task is to take a user's simple description and create a detailed, effective prompt that will produce a high-quality response from a large language model like Gemini.

    The generated prompt should:
    - Be highly specific and clear.
    - Define a clear role or persona for the AI (e.g., "Act as an expert historian...").
    - Specify the desired output format (e.g., "Provide the answer as a JSON object...", "Use markdown for formatting...").
    - Include sufficient context for the task.
    - If applicable, use techniques like one-shot or few-shot examples.

    User's request for a prompt: "${description}"

    Based on this, generate the best possible prompt. Only output the final prompt itself, with no additional explanations, conversational text, or markdown formatting like \`\`\`.
`);


// --- Chat Function ---
export function createChat(): Chat {
    if (!ai) throw new Error("API_KEY is not configured.");
    return ai.chats.create({
      model: getModel('gemini'),
      config: {
        systemInstruction: 'You are a helpful and friendly AI assistant. Be concise and clear in your responses.',
      },
    });
}


// --- Image Generation Function ---
export async function runImageGeneration(
    prompt: string, 
    aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
): Promise<string[]> {
    if (!ai) throw new Error("API_KEY is not configured.");
    
    try {
        const response = await ai.models.generateImages({
            model: getModel('imagen'),
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio,
            },
        });
        
        return response.generatedImages.map(img => img.image.imageBytes);

    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) throw new Error(error.message);
        throw new Error("An unknown error occurred during image generation.");
    }
}