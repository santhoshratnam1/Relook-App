import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, ExtractedEvent } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
    if (!ai) {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.warn("API_KEY environment variable not set. AI features will be disabled.");
            return null;
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

const classificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: {
            type: Type.STRING,
            enum: Object.values(ContentType),
            description: 'The most likely category for the content.'
        },
        title: {
            type: Type.STRING,
            description: 'A concise, compelling title for the content, under 10 words.'
        },
        summary: {
            type: Type.STRING,
            description: 'A one-sentence summary of the content.'
        },
        event: {
            type: Type.OBJECT,
            description: 'If a specific date or deadline is mentioned, extract event details.',
            properties: {
              title: {
                type: Type.STRING,
                description: 'The title of the event or reminder.',
              },
              date: {
                type: Type.STRING,
                description: 'The date of the event in YYYY-MM-DD format.',
              },
              time: {
                type: Type.STRING,
                description: 'The time of the event in HH:MM (24-hour) format. Optional.',
              },
            },
            required: ['title', 'date'],
        }
    },
    required: ['category', 'title', 'summary']
};

const imageClassificationSchema = {
    type: Type.OBJECT,
    properties: {
        ...classificationSchema.properties,
        body: {
            type: Type.STRING,
            description: 'The full text extracted from the image. If no significant text is found, provide a one-sentence description of the image.'
        }
    },
    required: ['category', 'title', 'summary', 'body']
};

type ClassificationResult = {
    classification: { category: ContentType; title: string; summary: string };
    extractedEvent: ExtractedEvent | null;
}
type ImageClassificationResult = {
    classification: { category: ContentType; title: string; summary: string; body: string; };
    extractedEvent: ExtractedEvent | null;
}

const parseAndValidateClassification = (jsonString: string) => {
    const result = JSON.parse(jsonString);
    if (Object.values(ContentType).includes(result.category)) {
        return result;
    }
    console.warn(`Received unknown category: ${result.category}. Defaulting to 'other'.`);
    return { ...result, category: ContentType.Other };
}

export const classifyContent = async (text: string): Promise<ClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following text. Classify it, providing a title, a one-sentence summary. If the text contains a specific date, event, or deadline, extract its details into an 'event' object. Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: classificationSchema,
            },
        });
        
        const parsedJson = JSON.parse(response.text.trim());
        const { event, ...classificationData } = parsedJson;
        
        const classification = parseAndValidateClassification(JSON.stringify(classificationData));

        const extractedEvent: ExtractedEvent | null = event || null;

        return { classification, extractedEvent };
    } catch (error) {
        console.error("Error classifying content with Gemini:", error);
        return null;
    }
};

export const classifyImageContent = async (imageData: string, mimeType: string): Promise<ImageClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }
    
    try {
        const imagePart = { inlineData: { data: imageData, mimeType: mimeType } };
        const textPart = { text: `First, perform OCR to extract all text from this image and place it in the 'body' field. If there's no text, describe the image in one sentence. Then, based on the image and its text, provide a classification, a title, a one-sentence summary, and extract any specific event details (like dates or deadlines) into an 'event' object.` };

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: imageClassificationSchema,
            },
        });

        const parsedJson = JSON.parse(response.text.trim());
        const { event, ...classificationData } = parsedJson;

        const classification = parseAndValidateClassification(JSON.stringify(classificationData));
        
        const extractedEvent: ExtractedEvent | null = event || null;

        return { classification, extractedEvent };
    } catch (error) {
        console.error("Error classifying image content with Gemini:", error);
        return null;
    }
};