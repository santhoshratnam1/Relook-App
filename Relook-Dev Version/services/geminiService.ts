

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

// --- START OF DETAILED SCHEMAS ---

const eventSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is an event announcement or invitation, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'The title of the event.' },
        type: { type: Type.STRING, enum: ['Conference', 'Webinar', 'Workshop', 'Meetup', 'Seminar', 'Launch Event', 'Networking', 'Competition', 'Exhibition', 'Festival'], description: 'The type of event.' },
        date: { type: Type.STRING, description: 'The date in YYYY-MM-DD format. Infer the year for the nearest upcoming date if missing.' },
        time: { type: Type.STRING, description: 'The start time in HH:MM (24-hour) format.' },
        endTime: { type: Type.STRING, description: 'The end time in HH:MM (24-hour) format.' },
        duration: { type: Type.STRING, description: 'Total duration of the event (e.g., "3 hours", "2 days").' },
        location: { type: Type.STRING, description: 'Physical or virtual location.' },
        host: { type: Type.STRING, description: 'The hosting company or person.' },
        organizer: { type: Type.STRING, description: 'The organizing body, if different from host.' },
        speakers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of speakers.' },
        agenda: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 key agenda bullet points.' },
        topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key topics to be covered.' },
        targetAudience: { type: Type.STRING, description: 'Who the event is for (e.g., "Developers", "Designers").' },
        registrationLink: { type: Type.STRING, description: 'URL for registration.' },
        cost: { type: Type.STRING, description: 'Cost of attendance (e.g., "Free", "$50").' },
        capacity: { type: Type.STRING, description: 'Maximum number of attendees.' },
        prerequisites: { type: Type.STRING, description: 'Any prerequisites for attending.' },
        certificates: { type: Type.STRING, description: 'Information about certificates of completion.' },
        contactEmail: { type: Type.STRING, description: 'Contact email for inquiries.' },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Official event hashtags.' },
    },
    required: ['title', 'date'],
};

const jobSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a job posting, extract structured job data.',
    properties: {
        role: { type: Type.STRING, description: 'Job title or role.' },
        company: { type: Type.STRING, description: 'Hiring company name.' },
        companyDescription: { type: Type.STRING, description: 'A brief description of the company.' },
        location: { type: Type.STRING, description: 'Job location.' },
        jobType: { type: Type.STRING, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Temporary'], description: 'Employment type.' },
        workMode: { type: Type.STRING, enum: ['Remote', 'On-site', 'Hybrid'], description: 'The work mode.' },
        salary: { type: Type.STRING, description: 'Salary range, if mentioned.' },
        experience: { type: Type.STRING, description: 'Years of experience required.' },
        education: { type: Type.STRING, description: 'Required educational background.' },
        skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Required skills or tools.' },
        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key responsibilities.' },
        qualifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Required qualifications.' },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of benefits offered.' },
        department: { type: Type.STRING, description: 'The department for this role.' },
        reportingTo: { type: Type.STRING, description: 'The manager or role this position reports to.' },
        deadline: { type: Type.STRING, description: 'Application deadline in YYYY-MM-DD format.' },
        applyLink: { type: Type.STRING, description: 'URL to apply.' },
        contactEmail: { type: Type.STRING, description: 'Contact email for applications.' },
        jobId: { type: Type.STRING, description: 'The job identification number.' },
    },
    required: ['role']
};

const productSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a product launch or showcase, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'The product name.' },
        brand: { type: Type.STRING, description: 'The brand of the product.' },
        category: { type: Type.STRING, description: 'Product category (e.g., Electronics, App).' },
        subCategory: { type: Type.STRING, description: 'Product sub-category.' },
        price: { type: Type.STRING, description: 'Price.' },
        originalPrice: { type: Type.STRING, description: 'Original price before discount.' },
        discount: { type: Type.STRING, description: 'Discount amount or percentage.' },
        releaseDate: { type: Type.STRING, description: 'Release date.' },
        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-6 key features.' },
        specifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Technical specifications.' },
        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Available colors.' },
        sizes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Available sizes.' },
        availableOn: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Where the product is available (e.g., Website, Amazon).' },
        warranty: { type: Type.STRING, description: 'Warranty period.' },
        version: { type: Type.STRING, description: 'Product version (e.g., V1.0, Pro).' },
        compatibility: { type: Type.STRING, description: 'Compatibility information.' },
        dimensions: { type: Type.STRING, description: 'Product dimensions.' },
        weight: { type: Type.STRING, description: 'Product weight.' },
        materials: { type: Type.STRING, description: 'Materials used.' },
        targetAudience: { type: Type.STRING, description: 'The target audience for the product.' },
        productLink: { type: Type.STRING, description: 'Link to the product page.' },
    },
    required: ['name']
};

const portfolioSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a portfolio project showcase, extract details.',
    properties: {
        projectName: { type: Type.STRING, description: 'The name of the project or app.' },
        projectType: { type: Type.STRING, enum: ['UI/UX', 'Game Design', '3D Model', 'VFX', 'Graphic Design', 'Web Design', 'App Design', 'Motion Graphics', 'Branding', 'Illustration', 'Animation'], description: 'The type of project.' },
        description: { type: Type.STRING, description: 'A brief description of the project.' },
        challenge: { type: Type.STRING, description: 'The main challenge or problem statement.' },
        solution: { type: Type.STRING, description: 'How the challenge was solved.' },
        toolsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Software or tools used.' },
        duration: { type: Type.STRING, description: 'Project duration (e.g., "Start–End", "2 weeks").' },
        role: { type: Type.STRING, description: 'Your role in the project (e.g., Designer, Lead).' },
        teamSize: { type: Type.STRING, description: 'The size of the team.' },
        client: { type: Type.STRING, description: 'The client, if any.' },
        industry: { type: Type.STRING, description: 'The industry of the client or project.' },
        deliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Final deliverables (e.g., Website, App, Concept).' },
        process: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Steps of the design process.' },
        outcome: { type: Type.STRING, description: 'What was achieved.' },
        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key features of the project.' },
        technologies: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Technologies used.' },
        platforms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Platforms the project is for (e.g., iOS, Web).' },
        awards: { type: Type.STRING, description: 'Any awards won.' },
        projectLink: { type: Type.STRING, description: 'Link to view the project.' },
        caseStudyLink: { type: Type.STRING, description: 'Link to the full case study.' },
    },
    required: ['projectName']
};

const tutorialSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a tutorial or how-to guide, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the tutorial.' },
        description: { type: Type.STRING, description: 'A brief summary of the tutorial.' },
        difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Expert', 'Advanced', 'All Levels'], description: 'Difficulty level.' },
        prerequisites: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Prerequisites for the tutorial.' },
        toolsRequired: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tools needed.' },
        duration: { type: Type.STRING, description: 'Estimated time to complete.' },
        stepsCount: { type: Type.INTEGER, description: 'Number of steps.' },
        category: { type: Type.STRING, description: 'Category (e.g., Design, Coding).' },
        subcategory: { type: Type.STRING, description: 'Subcategory.' },
        topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Topics covered.' },
        learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'What the user will learn.' },
        targetAudience: { type: Type.STRING, description: 'The intended audience.' },
        instructor: { type: Type.STRING, description: 'The instructor or author.' },
        language: { type: Type.STRING, description: 'Language of the tutorial.' },
        downloadLink: { type: Type.STRING, description: 'Link to download resources.' },
        videoLink: { type: Type.STRING, description: 'Link to a video version.' },
        articleLink: { type: Type.STRING, description: 'Link to a text version.' },
        cost: { type: Type.STRING, description: 'Cost of the tutorial.' },
    },
    required: ['title']
};

const offerSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a discount or offer, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the offer (e.g., Diwali Sale).' },
        description: { type: Type.STRING, description: 'A brief description of the offer.' },
        validFrom: { type: Type.STRING, description: 'Offer start date in YYYY-MM-DD format.' },
        validTill: { type: Type.STRING, description: 'Offer validity date in YYYY-MM-DD format.' },
        discount: { type: Type.STRING, description: 'Discount percentage or amount.' },
        originalPrice: { type: Type.STRING, description: 'Original price.' },
        salePrice: { type: Type.STRING, description: 'Price after discount.' },
        applicableOn: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Products or services the offer applies to.' },
        exclusions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Items excluded from the offer.' },
        conditions: { type: Type.STRING, description: 'Terms and conditions.' },
        minPurchase: { type: Type.STRING, description: 'Minimum purchase amount required.' },
        maxDiscount: { type: Type.STRING, description: 'Maximum discount amount.' },
        couponCode: { type: Type.STRING, description: 'The coupon code.' },
        platform: { type: Type.STRING, description: 'Where the offer is valid (e.g., Website, Store).' },
        offerType: { type: Type.STRING, enum: ['Percentage', 'Flat', 'BOGO', 'Cashback', 'Bundle'], description: 'Type of offer.' },
        category: { type: Type.STRING, description: 'Category of the offer.' },
        redemptionLimit: { type: Type.STRING, description: 'Limit on redemptions.' },
        offerLink: { type: Type.STRING, description: 'Link to the offer.' },
    },
    required: ['title']
};

const announcementSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is an announcement, extract details.',
    properties: {
        title: { type: Type.STRING, description: 'Title of the announcement.' },
        type: { type: Type.STRING, enum: ['Company Update', 'Launch', 'News', 'Policy Change', 'Milestone', 'Award', 'Partnership', 'Hiring', 'Event'], description: 'Type of announcement.' },
        description: { type: Type.STRING, description: 'A detailed description.' },
        effectiveFrom: { type: Type.STRING, description: 'Effective date in YYYY-MM-DD format.' },
        department: { type: Type.STRING, description: 'Relevant department.' },
        teamInvolved: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Team or people involved.' },
        impact: { type: Type.STRING, description: 'What changes or is the impact.' },
        actionRequired: { type: Type.STRING, description: 'Any action required from the reader.' },
        deadline: { type: Type.STRING, description: 'Deadline for action.' },
        moreInfoLink: { type: Type.STRING, description: 'Link for more information.' },
        contactPerson: { type: Type.STRING, description: 'Contact person.' },
        contactEmail: { type: Type.STRING, description: 'Contact email.' },
        priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Urgent'], description: 'Priority level.' },
        audience: { type: Type.STRING, description: 'Intended audience.' },
    },
    required: ['title']
};

const researchSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a research or data report, extract details.',
    properties: {
        reportTitle: { type: Type.STRING, description: 'Title of the report.' },
        abstract: { type: Type.STRING, description: 'The abstract or summary.' },
        source: { type: Type.STRING, description: 'Source of the data.' },
        authors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Authors of the report.' },
        year: { type: Type.INTEGER, description: 'Year of publication.' },
        publicationDate: { type: Type.STRING, description: 'Full publication date.' },
        industry: { type: Type.STRING, description: 'Relevant industry.' },
        region: { type: Type.STRING, description: 'Geographic region.' },
        methodology: { type: Type.STRING, description: 'Methodology used.' },
        sampleSize: { type: Type.INTEGER, description: 'Sample size of the study.' },
        demographics: { type: Type.STRING, description: 'Demographics of the sample.' },
        keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key findings.' },
        keyInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Bullet points of key insights.' },
        trends: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Identified trends.' },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Recommendations.' },
        dataPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific data points.' },
        limitations: { type: Type.STRING, description: 'Limitations of the study.' },
        futureResearch: { type: Type.STRING, description: 'Suggestions for future research.' },
        fullReportLink: { type: Type.STRING, description: 'Link to the full report.' },
        doi: { type: Type.STRING, description: 'Digital Object Identifier.' },
    },
    required: ['reportTitle']
};

const updateSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a game or app update/patch notes, extract details.',
    properties: {
        updateTitle: { type: Type.STRING, description: 'Title of the update.' },
        version: { type: Type.STRING, description: 'Version number (e.g., v1.3).' },
        versionType: { type: Type.STRING, enum: ['Major', 'Minor', 'Patch', 'Hotfix'], description: 'Type of version update.' },
        releaseDate: { type: Type.STRING, description: 'Release date in YYYY-MM-DD format.' },
        newFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of new features.' },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of improvements.' },
        bugFixes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of bug fixes.' },
        performance: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Performance updates.' },
        security: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Security updates.' },
        knownIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Known issues.' },
        deprecations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Deprecated features.' },
        platforms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Platforms the update applies to (iOS, Android, PC).' },
        compatibility: { type: Type.STRING, description: 'Compatibility information.' },
        fileSize: { type: Type.STRING, description: 'Size of the update.' },
        downloadLink: { type: Type.STRING, description: 'Link to download the update.' },
        changelog: { type: Type.STRING, description: 'Link to the full changelog.' },
    },
    required: ['updateTitle']
};

const teamSpotlightSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a team member spotlight, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'Name of the team member.' },
        role: { type: Type.STRING, description: 'Their role.' },
        department: { type: Type.STRING, description: 'Their department.' },
        experience: { type: Type.STRING, description: 'Years of experience.' },
        education: { type: Type.STRING, description: 'Educational background.' },
        skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key skills.' },
        specializations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Areas of specialization.' },
        achievements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Notable achievements.' },
        currentProjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Current projects.' },
        interests: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Professional interests.' },
        hobbies: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Personal hobbies.' },
        funFact: { type: Type.STRING, description: 'A fun fact about them.' },
        location: { type: Type.STRING, description: 'Their location.' },
        joinDate: { type: Type.STRING, description: 'Date they joined the company.' },
        quote: { type: Type.STRING, description: 'A personal quote.' },
        bio: { type: Type.STRING, description: 'A short biography.' },
        linkedIn: { type: Type.STRING, description: 'LinkedIn profile URL.' },
        twitter: { type: Type.STRING, description: 'Twitter handle.' },
        portfolio: { type: Type.STRING, description: 'Portfolio URL.' },
    },
    required: ['name']
};

const quoteSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is primarily a quote, extract details.',
    properties: {
        text: { type: Type.STRING, description: 'The full quote text.' },
        author: { type: Type.STRING, description: 'The author of the quote.' },
        source: { type: Type.STRING, description: 'The source of the quote (e.g., book, speech).' },
        context: { type: Type.STRING, description: 'The context in which the quote was said.' },
        year: { type: Type.STRING, description: 'The year of the quote.' },
        category: { type: Type.STRING, enum: ['Motivation', 'Productivity', 'Leadership', 'Success', 'Innovation', 'Life', 'Business'], description: 'Category of the quote.' },
        theme: { type: Type.STRING, enum: ['Aesthetic', 'Minimal', 'Tech', 'Professional', 'Inspirational'], description: 'Visual theme.' },
        language: { type: Type.STRING, description: 'Language of the quote.' },
        relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Related topics.' },
    },
    required: ['text']
};

const festivalSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a festival or holiday greeting, extract details.',
    properties: {
        name: { type: Type.STRING, description: 'Name of the festival (e.g., Happy Diwali).' },
        occasion: { type: Type.STRING, description: 'The specific occasion.' },
        date: { type: Type.STRING, description: 'Date of the festival in YYYY-MM-DD format.' },
        duration: { type: Type.STRING, description: 'Duration of the festival.' },
        theme: { type: Type.STRING, enum: ['Traditional', 'Modern', 'Minimal', 'Festive', 'Corporate'], description: 'Visual theme.' },
        colorsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Primary hex colors used.' },
        specialMessage: { type: Type.STRING, description: 'The greeting message.' },
        culturalSignificance: { type: Type.STRING, description: 'Cultural significance.' },
        traditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Associated traditions.' },
        symbols: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key symbols.' },
        region: { type: Type.STRING, description: 'Region where it is celebrated.' },
        company: { type: Type.STRING, description: 'Company sending the greeting.' },
    },
    required: ['name']
};

const recipeSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is food/cooking content, extract structured recipe data. Parse ALL ingredients and steps carefully.',
    properties: {
        recipeName: { type: Type.STRING, description: 'The name of the recipe.' },
        description: { type: Type.STRING, description: 'A brief description of the dish.' },
        cuisine: { type: Type.STRING, description: 'Type of cuisine (e.g., Italian, Mexican).' },
        course: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Main Course', 'Side Dish', 'Beverage'], description: 'The course of the meal.' },
        dietaryInfo: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Dietary information (e.g., Vegan, Gluten-Free).' },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Complete list of ALL ingredients with exact quantities.' },
        steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Step-by-step cooking instructions.' },
        prepTime: { type: Type.STRING, description: 'Preparation time.' },
        cookTime: { type: Type.STRING, description: 'Cooking time.' },
        totalTime: { type: Type.STRING, description: 'Total time required.' },
        servings: { type: Type.STRING, description: 'Number of servings.' },
        difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'], description: 'Difficulty level.' },
        equipment: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Equipment needed.' },
        techniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Cooking techniques used.' },
        tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tips for success.' },
        variations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Possible variations.' },
        storage: { type: Type.STRING, description: 'Storage instructions.' },
        reheating: { type: Type.STRING, description: 'Reheating instructions.' },
        nutritionInfo: { type: Type.STRING, description: 'Nutritional information.' },
        allergens: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Potential allergens.' },
        author: { type: Type.STRING, description: 'Author of the recipe.' },
        source: { type: Type.STRING, description: 'Source of the recipe.' },
    },
    required: ['ingredients', 'steps']
};

const postSchemaProperties = {
    type: Type.OBJECT,
    description: 'If this is a generic social media post with no other specific structure, extract its details.',
    properties: {
        author: { type: Type.STRING, description: 'The post author.' },
        authorHandle: { type: Type.STRING, description: 'Author\'s social media handle.' },
        authorTitle: { type: Type.STRING, description: 'Author\'s title or profession.' },
        platform: { type: Type.STRING, enum: ['LinkedIn', 'X', 'Instagram', 'Facebook', 'Blog', 'Medium', 'Substack', 'Other'], description: 'The platform of the post.' },
        postType: { type: Type.STRING, enum: ['Text', 'Image', 'Video', 'Link', 'Poll', 'Carousel', 'Story'], description: 'Type of post.' },
        postDate: { type: Type.STRING, description: 'Date of the post.' },
        contentTheme: { type: Type.STRING, description: 'The theme of the content.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Relevant hashtags or keywords.' },
        mentions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Mentioned users or pages.' },
        engagement: { type: Type.STRING, description: 'Engagement metrics (e.g., "1.2k likes").' },
        callToAction: { type: Type.STRING, description: 'The call to action.' },
        links: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Links included in the post.' },
        sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral', 'Promotional', 'Educational', 'Inspirational'], description: 'Sentiment of the post.' },
        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key points from the post.' },
        mediaDescription: { type: Type.STRING, description: 'Description of any media attached.' },
    }
};

// --- METADATA & HELPER SCHEMAS ---

const generalMetadataProperties = {
    headings: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Main headings or section titles.' },
    sections: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Summaries of key sections.' },
    keyPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Important keywords or phrases.' },
    urls: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Any URLs found.' },
    entities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Named entities like people or organizations.' },
    sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'], description: 'Overall sentiment.' },
    language: { type: Type.STRING, description: 'Primary language (e.g., "English").' },
};

const imageMetadataProperties = {
    visualElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key visual elements (e.g., "logo", "chart").' },
    textLayout: { type: Type.STRING, description: 'Description of text layout (e.g., "Header with bullet points").' },
    imageQuality: { type: Type.STRING, description: 'Image quality assessment (e.g., "High", "Blurry").' },
};

const detailedSchemaMap = {
    [ContentType.Event]: eventSchemaProperties,
    [ContentType.Job]: jobSchemaProperties,
    [ContentType.Product]: productSchemaProperties,
    [ContentType.Portfolio]: portfolioSchemaProperties,
    [ContentType.Tutorial]: tutorialSchemaProperties,
    [ContentType.Offer]: offerSchemaProperties,
    [ContentType.Announcement]: announcementSchemaProperties,
    [ContentType.Research]: researchSchemaProperties,
    [ContentType.Update]: updateSchemaProperties,
    [ContentType.TeamSpotlight]: teamSpotlightSchemaProperties,
    [ContentType.Quote]: quoteSchemaProperties,
    [ContentType.Festival]: festivalSchemaProperties,
    [ContentType.Recipe]: recipeSchemaProperties,
    [ContentType.Post]: postSchemaProperties,
    [ContentType.Design]: portfolioSchemaProperties, // Legacy support
    [ContentType.Education]: tutorialSchemaProperties, // Legacy support
};

// --- INITIAL CLASSIFICATION SCHEMAS (SIMPLIFIED) ---

const initialTextClassificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, enum: Object.values(ContentType) },
        title: { type: Type.STRING, description: 'A concise, compelling title under 10 words.' },
        summary: { type: Type.STRING, description: 'A one-sentence summary.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific, descriptive tags.' },
    },
    required: ['category', 'title', 'summary']
};

const initialImageClassificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, enum: Object.values(ContentType) },
        title: { type: Type.STRING, description: 'A concise, compelling title under 10 words.' },
        summary: { type: Type.STRING, description: 'A one-sentence summary.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific, descriptive tags.' },
        body: { type: Type.STRING, description: 'Full text extracted from the image. If no text, describe the image.' },
        ...imageMetadataProperties,
    },
     required: ['category', 'title', 'summary', 'body']
};

const initialAudioClassificationSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, enum: Object.values(ContentType) },
        title: { type: Type.STRING, description: 'A concise, compelling title under 10 words, based on the transcript.' },
        summary: { type: Type.STRING, description: 'A one-sentence summary of the transcript.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific, descriptive tags from the transcript.' },
        body: { type: Type.STRING, description: 'Full and accurate transcription of the audio.' },
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
    headings?: string[];
    sections?: string[];
    keyPhrases?: string[];
    urls?: string[];
    entities?: string[];
    sentiment?: string;
    language?: string;
}

type MediaClassificationResult = Omit<ClassificationResult, 'classification'> & {
    classification: { category: ContentType; title: string; summary: string; body: string; tags?: string[] };
    visualElements?: string[];
    textLayout?: string;
    imageQuality?: string;
}

const parseAndValidateClassification = (result: any) => {
    if (Object.values(ContentType).includes(result.category)) {
        return result;
    }
    console.warn(`Received unknown category: ${result.category}. Defaulting to 'other'.`);
    return { ...result, category: ContentType.Other };
}

// --- HELPER FOR 2ND STEP DATA EXTRACTION ---

async function extractDetailedData(text: string, category: ContentType): Promise<{ structured: any, general: any }> {
    const aiClient = getAiClient();
    if (!aiClient || !text || text.trim().length === 0) {
        return { structured: {}, general: {} };
    }

    const detailedSchema = detailedSchemaMap[category as keyof typeof detailedSchemaMap];
    
    // If no specific schema for this category, just extract general metadata.
    if (!detailedSchema) {
        const metadataPrompt = `From the following text, extract general metadata: headings, key phrases, URLs, entities, sentiment, and language. Text: "${text}"`;
        const metadataSchema = { type: Type.OBJECT, properties: generalMetadataProperties };
        const metadataResponse = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: metadataPrompt,
            config: { responseMimeType: "application/json", responseSchema: metadataSchema }
        });
        return { structured: {}, general: JSON.parse(metadataResponse.text.trim()) };
    }

    // Combine detailed schema and general metadata schema for one call
    const combinedSchema = {
        type: Type.OBJECT,
        properties: {
            structuredData: detailedSchema,
            generalMetadata: { type: Type.OBJECT, properties: generalMetadataProperties }
        },
        required: ['structuredData', 'generalMetadata']
    };

    const prompt = `The following text is classified as "${category}". Extract the detailed structured data and general metadata from it. For dates without a year (e.g., "October 12"), assume the nearest future date and provide the full YYYY-MM-DD format. Text: "${text}"`;

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: combinedSchema }
        });
        const result = JSON.parse(response.text.trim());
        return { structured: result.structuredData || {}, general: result.generalMetadata || {} };
    } catch (e) {
        console.error(`Error extracting detailed data for category ${category}:`, e);
        return { structured: {}, general: {} };
    }
}

// --- MAIN API FUNCTIONS ---

export const classifyContent = async (text: string): Promise<ClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }

    try {
        // STEP 1: Initial classification
        const initialPrompt = `Analyze the following text. Classify it into the most specific category. Then, create a concise title, a one-sentence summary, and a list of descriptive tags. Text: "${text}"`;
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: initialPrompt,
            config: { responseMimeType: "application/json", responseSchema: initialTextClassificationSchema },
        });
        
        const classification = parseAndValidateClassification(JSON.parse(response.text.trim()));

        // STEP 2: Detailed data extraction
        const { structured, general } = await extractDetailedData(text, classification.category);
        
        // STEP 3: Combine and return
        return { 
            classification, 
            eventData: classification.category === ContentType.Event ? structured : null,
            jobData: classification.category === ContentType.Job ? structured : null,
            productData: classification.category === ContentType.Product ? structured : null,
            portfolioData: [ContentType.Portfolio, ContentType.Design].includes(classification.category) ? structured : null,
            tutorialData: [ContentType.Tutorial, ContentType.Education].includes(classification.category) ? structured : null,
            offerData: classification.category === ContentType.Offer ? structured : null,
            announcementData: classification.category === ContentType.Announcement ? structured : null,
            researchData: classification.category === ContentType.Research ? structured : null,
            updateData: classification.category === ContentType.Update ? structured : null,
            teamSpotlightData: classification.category === ContentType.TeamSpotlight ? structured : null,
            quoteData: classification.category === ContentType.Quote ? structured : null,
            festivalData: classification.category === ContentType.Festival ? structured : null,
            recipeData: classification.category === ContentType.Recipe && structured.ingredients && structured.steps ? structured : null,
            postData: classification.category === ContentType.Post ? structured : null,
            ...general,
        };
    } catch (error) {
        console.error("Error classifying content with Gemini:", error);
        return null;
    }
};

export const classifyImageContent = async (imageData: string, mimeType: string): Promise<MediaClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }
    
    try {
        // STEP 1: Initial classification and text extraction from image
        const imagePart = { inlineData: { data: imageData, mimeType: mimeType } };
        const initialPrompt = `Analyze this image: 1. Extract ALL text into 'body'. 2. Classify into the most specific content category. 3. Create a title and summary. 4. Generate descriptive tags. 5. Extract image-specific metadata: visual elements, text layout, image quality.`;

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: initialPrompt }] },
            config: { responseMimeType: "application/json", responseSchema: initialImageClassificationSchema },
        });

        const initialResultJson = JSON.parse(response.text.trim());
        const classification = parseAndValidateClassification(initialResultJson);

        // STEP 2: Detailed data extraction based on extracted text and category
        const { structured, general } = await extractDetailedData(classification.body, classification.category);

        // STEP 3: Combine all results and return
        return { 
            classification, 
            eventData: classification.category === ContentType.Event ? structured : null,
            jobData: classification.category === ContentType.Job ? structured : null,
            productData: classification.category === ContentType.Product ? structured : null,
            portfolioData: [ContentType.Portfolio, ContentType.Design].includes(classification.category) ? structured : null,
            tutorialData: [ContentType.Tutorial, ContentType.Education].includes(classification.category) ? structured : null,
            offerData: classification.category === ContentType.Offer ? structured : null,
            announcementData: classification.category === ContentType.Announcement ? structured : null,
            researchData: classification.category === ContentType.Research ? structured : null,
            updateData: classification.category === ContentType.Update ? structured : null,
            teamSpotlightData: classification.category === ContentType.TeamSpotlight ? structured : null,
            quoteData: classification.category === ContentType.Quote ? structured : null,
            festivalData: classification.category === ContentType.Festival ? structured : null,
            recipeData: classification.category === ContentType.Recipe && structured.ingredients && structured.steps ? structured : null,
            postData: classification.category === ContentType.Post ? structured : null,
            ...general,
            visualElements: initialResultJson.visualElements, 
            textLayout: initialResultJson.textLayout, 
            imageQuality: initialResultJson.imageQuality,
        };
    } catch (error) {
        console.error("Error classifying image content with Gemini:", error);
        return null;
    }
};

export const classifyAudioContent = async (audioData: string, mimeType: string): Promise<MediaClassificationResult | null> => {
    const aiClient = getAiClient();
    if (!aiClient) { return null; }

    try {
        // STEP 1: Transcribe audio and perform initial classification
        const audioPart = { inlineData: { data: audioData, mimeType } };
        const initialPrompt = `Analyze this audio recording. 1. Provide a full and accurate transcription into 'body'. 2. Based on the transcription, classify the content into the most specific category. 3. Create a concise title and a one-sentence summary. 4. Generate descriptive tags.`;

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash-native-audio-preview-09-2025", // Use a model capable of audio processing
            contents: { parts: [audioPart, { text: initialPrompt }] },
            config: { responseMimeType: "application/json", responseSchema: initialAudioClassificationSchema },
        });

        const initialResultJson = JSON.parse(response.text.trim());
        const classification = parseAndValidateClassification(initialResultJson);

        // STEP 2: Detailed data extraction from the transcribed text
        const { structured, general } = await extractDetailedData(classification.body, classification.category);

        // STEP 3: Combine results and return
        return {
            classification,
            eventData: classification.category === ContentType.Event ? structured : null,
            jobData: classification.category === ContentType.Job ? structured : null,
            productData: classification.category === ContentType.Product ? structured : null,
            portfolioData: [ContentType.Portfolio, ContentType.Design].includes(classification.category) ? structured : null,
            tutorialData: [ContentType.Tutorial, ContentType.Education].includes(classification.category) ? structured : null,
            offerData: classification.category === ContentType.Offer ? structured : null,
            announcementData: classification.category === ContentType.Announcement ? structured : null,
            researchData: classification.category === ContentType.Research ? structured : null,
            updateData: classification.category === ContentType.Update ? structured : null,
            teamSpotlightData: classification.category === ContentType.TeamSpotlight ? structured : null,
            quoteData: classification.category === ContentType.Quote ? structured : null,
            festivalData: classification.category === ContentType.Festival ? structured : null,
            recipeData: classification.category === ContentType.Recipe && structured.ingredients && structured.steps ? structured : null,
            postData: classification.category === ContentType.Post ? structured : null,
            ...general,
        };
    } catch (error) {
        console.error("Error classifying audio content with Gemini:", error);
        return null;
    }
};

export const suggestDeckNames = async (): Promise<string[] | null> => {
    const aiClient = getAiClient();
    if (!aiClient) return null;

    const prompt = "Suggest 5 creative, concise, and distinct names for a collection of notes or ideas. For example: 'Mind Sparks', 'Idea Vault', 'Concept Canvas'. Return only a JSON object with a 'names' array.";
    const schema = {
        type: Type.OBJECT,
        properties: {
            names: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of 5 creative names.'
            }
        },
        required: ['names']
    };

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        const result = JSON.parse(response.text.trim());
        return result.names || null;
    } catch (e) {
        console.error("Error suggesting deck names:", e);
        return null;
    }
};