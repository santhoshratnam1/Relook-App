import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, ExtractedEvent, RecipeData, JobData } from '../types';

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

const recipeSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is food/cooking content, extract structured recipe data. Parse ALL ingredients and steps carefully.',
    properties: {
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Complete list of ALL ingredients with exact quantities. Each item should be one ingredient with its measurement.'
        },
        steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Step-by-step cooking instructions in order. Break down into clear, numbered steps.'
        },
        prepTime: {
            type: Type.STRING,
            description: 'Preparation time if mentioned (e.g., "15 minutes")'
        },
        cookTime: {
            type: Type.STRING,
            description: 'Cooking time if mentioned (e.g., "30 minutes")'
        },
        servings: {
            type: Type.STRING,
            description: 'Number of servings if mentioned'
        },
        difficulty: {
            type: Type.STRING,
            enum: ['easy', 'medium', 'hard'],
            description: 'Difficulty level based on complexity'
        }
    },
    required: ['ingredients', 'steps']
};

const jobSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a job posting, extract structured job data.',
    properties: {
        company: { type: Type.STRING, description: 'The name of the hiring company.' },
        role: { type: Type.STRING, description: 'The job title or role.' },
        skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of required skills, tools, or technologies.' },
        location: { type: Type.STRING, description: 'The job location (e.g., "City, Country").' },
        jobType: { type: Type.STRING, enum: ['Remote', 'On-site', 'Hybrid'], description: 'The type of employment (Remote, On-site, or Hybrid).' },
        seniority: { type: Type.STRING, description: 'The seniority level, e.g., "Senior", "Junior", "Lead".' }
    },
    required: ['role']
};

const classificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: {
            type: Type.STRING,
            enum: Object.values(ContentType),
            description: 'The most likely category for the content. Use "recipe" for food-related content and "job" for job postings.'
        },
        title: {
            type: Type.STRING,
            description: 'A concise, compelling title for the content, under 10 words.'
        },
        summary: {
            type: Type.STRING,
            description: 'A one-sentence summary of the content.'
        },
        recipe: recipeSchemaProperties,
        job: jobSchemaProperties,
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
                description: 'The date of the event in YYYY-MM-DD format. If the year is missing, infer the year for the nearest upcoming date.',
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
        category: {
            type: Type.STRING,
            enum: Object.values(ContentType),
            description: 'The most likely category. Use "recipe" for any food/cooking content and "job" for job postings.'
        },
        title: {
            type: Type.STRING,
            description: 'A concise, compelling title for the content, under 10 words.'
        },
        summary: {
            type: Type.STRING,
            description: 'A one-sentence summary of the content.'
        },
        body: {
            type: Type.STRING,
            description: 'The full text extracted from the image. If no significant text is found, provide a one-sentence description.'
        },
        recipe: recipeSchemaProperties,
        job: jobSchemaProperties,
        event: {
            type: Type.OBJECT,
            description: 'If a specific date or deadline is mentioned, extract event details.',
            properties: {
              title: { type: Type.STRING },
              date: { 
                type: Type.STRING,
                description: 'The date of the event in YYYY-MM-DD format. If the year is missing, infer the year for the nearest upcoming date.'
              },
              time: { type: Type.STRING },
            },
            required: ['title', 'date'],
        }
    },
    required: ['category', 'title', 'summary', 'body']
};

type ClassificationResult = {
    classification: { category: ContentType; title: string; summary: string };
    extractedEvent: ExtractedEvent | null;
    recipeData: RecipeData | null;
    jobData: JobData | null;
}
type ImageClassificationResult = {
    classification: { category: ContentType; title: string; summary: string; body: string; };
    extractedEvent: ExtractedEvent | null;
    recipeData: RecipeData | null;
    jobData: JobData | null;
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
            contents: `Analyze the following text. Classify it into a category (e.g., 'Education', 'Job', 'Recipe', 'Post', 'Design'), providing a title and one-sentence summary. If the text is a recipe or job posting, extract structured data. If it contains a specific date, event, or deadline, extract details into an 'event' object. IMPORTANT: If a date is mentioned without a year (e.g., "October 12"), assume it refers to the nearest future date and provide the full YYYY-MM-DD format. Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: classificationSchema,
            },
        });
        
        const parsedJson = JSON.parse(response.text.trim());
        const { event, recipe, job, ...classificationData } = parsedJson;
        
        const classification = parseAndValidateClassification(JSON.stringify(classificationData));

        const extractedEvent: ExtractedEvent | null = event || null;
        const recipeData: RecipeData | null = recipe && recipe.ingredients && recipe.steps ? recipe : null;
        const jobData: JobData | null = job || null;

        return { classification, extractedEvent, recipeData, jobData };
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
        const textPart = { 
            text: `Analyze this image carefully:
1. Extract ALL visible text using OCR and place in 'body' field
2. If this is food/recipe content or a job posting, parse it into a structured format.
3. Classify the content type (e.g., 'Education' for slides, 'Design' for inspiration, 'Job' for listings, 'Post' for social media. Use "recipe" for food content).
4. Create a descriptive title and summary
5. Extract any event/date information if present. IMPORTANT: If a date is mentioned without a year (e.g., "October 12"), assume it refers to the nearest future date and provide the full YYYY-MM-DD format.`
        };

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: imageClassificationSchema,
            },
        });

        const parsedJson = JSON.parse(response.text.trim());
        const { event, recipe, job, ...classificationData } = parsedJson;

        const classification = parseAndValidateClassification(JSON.stringify(classificationData));
        const extractedEvent: ExtractedEvent | null = event || null;
        const recipeData: RecipeData | null = recipe && recipe.ingredients && recipe.steps ? recipe : null;
        const jobData: JobData | null = job || null;

        return { classification, extractedEvent, recipeData, jobData };
    } catch (error) {
        console.error("Error classifying image content with Gemini:", error);
        return null;
    }
};