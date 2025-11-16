import { GoogleGenAI, Type } from "@google/genai";
import { 
    ContentType, EventData, RecipeData, JobData, PostData, 
    PortfolioData, TutorialData, ProductData, OfferData, AnnouncementData, 
    ResearchData, UpdateData, TeamSpotlightData, QuoteData, FestivalData
} from '../types';

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

// --- START OF SCHEMAS ---

const eventSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is an event announcement or invitation, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'The title of the event.' },
        type: { type: Type.STRING, enum: ['Conference', 'Webinar', 'Workshop', 'Meetup'], description: 'The type of event.' },
        date: { type: Type.STRING, description: 'The date in YYYY-MM-DD format. Infer the year for the nearest upcoming date if missing.' },
        time: { type: Type.STRING, description: 'The time in HH:MM (24-hour) format.' },
        location: { type: Type.STRING, description: 'Physical or virtual location.' },
        host: { type: Type.STRING, description: 'The hosting company or person.' },
        speakers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of speakers.' },
        agenda: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 key agenda bullet points.' },
        registrationLink: { type: Type.STRING, description: 'URL for registration.' },
    },
    required: ['title', 'date'],
};

const jobSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a job posting, extract structured job data.',
    properties: {
        role: { type: Type.STRING, description: 'Job title or role.' },
        company: { type: Type.STRING, description: 'Hiring company name.' },
        location: { type: Type.STRING, description: 'Job location.' },
        jobType: { type: Type.STRING, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], description: 'Employment type.' },
        salary: { type: Type.STRING, description: 'Salary range, if mentioned.' },
        experience: { type: Type.STRING, description: 'Years of experience required.' },
        skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Required skills or tools.' },
        deadline: { type: Type.STRING, description: 'Application deadline in YYYY-MM-DD format.' },
        applyLink: { type: Type.STRING, description: 'URL to apply.' },
    },
    required: ['role']
};

const productSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a product launch or showcase, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'The product name.' },
        category: { type: Type.STRING, description: 'Product category (e.g., Electronics, App).' },
        price: { type: Type.STRING, description: 'Price.' },
        releaseDate: { type: Type.STRING, description: 'Release date.' },
        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-6 key features.' },
        availableOn: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Where the product is available (e.g., Website, Amazon).' },
        warranty: { type: Type.STRING, description: 'Warranty period.' },
        version: { type: Type.STRING, description: 'Product version (e.g., V1.0, Pro).' },
    },
    required: ['name']
};

const portfolioSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a portfolio project showcase, extract details.',
    properties: {
        projectName: { type: Type.STRING, description: 'The name of the project or app.' },
        projectType: { type: Type.STRING, enum: ['UI/UX', 'Game Design', '3D Model', 'VFX'], description: 'The type of project.' },
        toolsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Software or tools used.' },
        duration: { type: Type.STRING, description: 'Project duration (e.g., "Start–End", "2 weeks").' },
        role: { type: Type.STRING, description: 'Your role in the project (e.g., Designer, Lead).' },
        client: { type: Type.STRING, description: 'The client, if any.' },
        deliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Final deliverables (e.g., Website, App, Concept).' },
        outcome: { type: Type.STRING, description: 'What was achieved.' },
    },
    required: ['projectName']
};

const tutorialSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a tutorial or how-to guide, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the tutorial.' },
        difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Expert'], description: 'Difficulty level.' },
        toolsRequired: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tools needed.' },
        duration: { type: Type.STRING, description: 'Estimated time to complete.' },
        stepsCount: { type: Type.INTEGER, description: 'Number of steps.' },
        category: { type: Type.STRING, description: 'Category (e.g., Design, Coding).' },
        downloadLink: { type: Type.STRING, description: 'Link to download resources.' },
    },
    required: ['title']
};

const offerSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a discount or offer, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the offer (e.g., Diwali Sale).' },
        validTill: { type: Type.STRING, description: 'Offer validity date in YYYY-MM-DD format.' },
        discount: { type: Type.STRING, description: 'Discount percentage or amount.' },
        applicableOn: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Products or services the offer applies to.' },
        conditions: { type: Type.STRING, description: 'Terms and conditions.' },
        couponCode: { type: Type.STRING, description: 'The coupon code.' },
        platform: { type: Type.STRING, description: 'Where the offer is valid (e.g., Website, Store).' },
    },
    required: ['title']
};

const announcementSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is an announcement, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the announcement.' },
        type: { type: Type.STRING, enum: ['Company Update', 'Launch', 'News'], description: 'Type of announcement.' },
        effectiveFrom: { type: Type.STRING, description: 'Effective date in YYYY-MM-DD format.' },
        teamInvolved: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Team or people involved.' },
        impact: { type: Type.STRING, description: 'What changes or is the impact.' },
        moreInfoLink: { type: Type.STRING, description: 'Link for more information.' },
    },
    required: ['title']
};

const researchSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a research or data report, extract details.',
    properties: {
        reportTitle: { type: Type.STRING, description: 'Title of the report.' },
        source: { type: Type.STRING, description: 'Source of the data.' },
        year: { type: Type.INTEGER, description: 'Year of publication.' },
        industry: { type: Type.STRING, description: 'Relevant industry.' },
        region: { type: Type.STRING, description: 'Geographic region.' },
        sampleSize: { type: Type.INTEGER, description: 'Sample size of the study.' },
        keyInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Bullet points of key insights.' },
        fullReportLink: { type: Type.STRING, description: 'Link to the full report.' },
    },
    required: ['reportTitle']
};

const updateSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a game or app update/patch notes, extract details.',
    properties: {
        updateTitle: { type: Type.STRING, description: 'Title of the update.' },
        version: { type: Type.STRING, description: 'Version number (e.g., v1.3).' },
        releaseDate: { type: Type.STRING, description: 'Release date in YYYY-MM-DD format.' },
        newFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of new features.' },
        bugFixes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of bug fixes.' },
        platforms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Platforms the update applies to (iOS, Android, PC).' },
        downloadLink: { type: Type.STRING, description: 'Link to download the update.' },
    },
    required: ['updateTitle']
};

const teamSpotlightSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a team member spotlight, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'Name of the team member.' },
        role: { type: Type.STRING, description: 'Their role.' },
        experience: { type: Type.STRING, description: 'Years of experience.' },
        skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key skills.' },
        funFact: { type: Type.STRING, description: 'A fun fact about them.' },
        location: { type: Type.STRING, description: 'Their location.' },
        quote: { type: Type.STRING, description: 'A personal quote.' },
    },
    required: ['name']
};

const quoteSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is primarily a quote, extract details.',
    properties: {
        text: { type: Type.STRING, description: 'The full quote text.' },
        author: { type: Type.STRING, description: 'The author of the quote.' },
        category: { type: Type.STRING, enum: ['Motivation', 'Productivity'], description: 'Category of the quote.' },
        theme: { type: Type.STRING, enum: ['Aesthetic', 'Minimal', 'Tech'], description: 'Visual theme.' },
    },
    required: ['text']
};

const festivalSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a festival or holiday greeting, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'Name of the festival (e.g., Happy Diwali).' },
        date: { type: Type.STRING, description: 'Date of the festival in YYYY-MM-DD format.' },
        theme: { type: Type.STRING, enum: ['Traditional', 'Modern', 'Minimal'], description: 'Visual theme.' },
        colorsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Primary hex colors used.' },
        specialMessage: { type: Type.STRING, description: 'The greeting message.' },
    },
    required: ['name']
};

const recipeSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is food/cooking content, extract structured recipe data. Parse ALL ingredients and steps carefully.',
    properties: {
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Complete list of ALL ingredients with exact quantities.' },
        steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Step-by-step cooking instructions.' },
        prepTime: { type: Type.STRING, description: 'Preparation time.' },
        cookTime: { type: Type.STRING, description: 'Cooking time.' },
        servings: { type: Type.STRING, description: 'Number of servings.' },
        difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'], description: 'Difficulty level.' }
    },
    required: ['ingredients', 'steps']
};

const postSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a generic social media post with no other specific structure, extract its details.',
    properties: {
        author: { type: Type.STRING, description: 'The post author.' },
        platform: { type: Type.STRING, enum: ['LinkedIn', 'X', 'Instagram', 'Facebook', 'Blog', 'Other'], description: 'The platform of the post.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Relevant hashtags or keywords.' }
    }
};

// --- MAIN SCHEMAS ---

const classificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, enum: Object.values(ContentType) },
        title: { type: Type.STRING, description: 'A concise, compelling title based on the main heading, under 10 words.' },
        summary: { type: Type.STRING, description: 'A one-sentence summary of the content.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of specific, descriptive tags or sub-categories. Examples: "Job Vacancy", "UI/UX Showcase", "Product Launch", "Event Invitation", "How-To Guide".' },
        event: eventSchemaProperties,
        job: jobSchemaProperties,
        product: productSchemaProperties,
        portfolio: portfolioSchemaProperties,
        tutorial: tutorialSchemaProperties,
        offer: offerSchemaProperties,
        announcement: announcementSchemaProperties,
        research: researchSchemaProperties,
        update: updateSchemaProperties,
        team_spotlight: teamSpotlightSchemaProperties,
        quote: quoteSchemaProperties,
        festival: festivalSchemaProperties,
        recipe: recipeSchemaProperties,
        post: postSchemaProperties,
    },
    required: ['category', 'title', 'summary']
};

const imageClassificationSchema = {
    ...classificationSchema,
    properties: {
        ...classificationSchema.properties,
        body: { type: Type.STRING, description: 'The full text extracted from the image. If no text, provide a description of the image.' },
    },
     required: ['category', 'title', 'summary', 'body']
};

// --- TYPES & PARSING ---

type ClassificationResult = {
    classification: { category: ContentType; title: string; summary: string; tags?: string[] };
    eventData: EventData | null;
    jobData: JobData | null;
    productData: ProductData | null;
    portfolioData: PortfolioData | null;
    tutorialData: TutorialData | null;
    offerData: OfferData | null;
    announcementData: AnnouncementData | null;
    researchData: ResearchData | null;
    updateData: UpdateData | null;
    teamSpotlightData: TeamSpotlightData | null;
    quoteData: QuoteData | null;
    festivalData: FestivalData | null;
    recipeData: RecipeData | null;
    postData: PostData | null;
}
type ImageClassificationResult = Omit<ClassificationResult, 'classification'> & {
    classification: { category: ContentType; title: string; summary: string; body: string; tags?: string[] };
}

const parseAndValidateClassification = (jsonString: string) => {
    const result = JSON.parse(jsonString);
    if (Object.values(ContentType).includes(result.category)) {
        return result;
    }
    console.warn(`Received unknown category: ${result.category}. Defaulting to 'other'.`);
    return { ...result, category: ContentType.Other };
}

const MAIN_PROMPT = `Analyze the following text. First, classify it into the most specific category. Second, create a concise title, a one-sentence summary, and a list of descriptive tags. Third, if it matches a specific data structure (Event, Job, Product, etc.), extract all relevant fields. IMPORTANT: For dates without a year (e.g., "October 12"), assume the nearest future date and provide the full YYYY-MM-DD format. Text: "`;
const IMAGE_PROMPT = `Analyze this image: 1. Extract ALL text into 'body'. 2. Classify into the most specific content category. 3. Create a title and summary. 4. Generate a list of specific, descriptive tags. 5. If it matches a specific data structure (Event, Job, Product, etc.), extract all relevant fields. 6. For dates without a year, infer the nearest future year.`;

export const classifyContent = async (text: string): Promise<ClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${MAIN_PROMPT}${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: classificationSchema,
            },
        });
        
        const parsedJson = JSON.parse(response.text.trim());
        const { event, job, product, portfolio, tutorial, offer, announcement, research, update, team_spotlight, quote, festival, recipe, post, ...classificationData } = parsedJson;
        
        const classification = parseAndValidateClassification(JSON.stringify(classificationData));

        return { 
            classification, 
            eventData: event || null,
            jobData: job || null,
            productData: product || null,
            portfolioData: portfolio || null,
            tutorialData: tutorial || null,
            offerData: offer || null,
            announcementData: announcement || null,
            researchData: research || null,
            updateData: update || null,
            teamSpotlightData: team_spotlight || null,
            quoteData: quote || null,
            festivalData: festival || null,
            recipeData: recipe && recipe.ingredients && recipe.steps ? recipe : null,
            postData: post || null,
        };
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
        const textPart = { text: IMAGE_PROMPT };

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: imageClassificationSchema,
            },
        });

        const parsedJson = JSON.parse(response.text.trim());
        const { event, job, product, portfolio, tutorial, offer, announcement, research, update, team_spotlight, quote, festival, recipe, post, ...classificationData } = parsedJson;

        const classification = parseAndValidateClassification(JSON.stringify(classificationData));

        return { 
            classification, 
            eventData: event || null,
            jobData: job || null,
            productData: product || null,
            portfolioData: portfolio || null,
            tutorialData: tutorial || null,
            offerData: offer || null,
            announcementData: announcement || null,
            researchData: research || null,
            updateData: update || null,
            teamSpotlightData: team_spotlight || null,
            quoteData: quote || null,
            festivalData: festival || null,
            recipeData: recipe && recipe.ingredients && recipe.steps ? recipe : null,
            postData: post || null,
        };
    } catch (error) {
        console.error("Error classifying image content with Gemini:", error);
        return null;
    }
};
