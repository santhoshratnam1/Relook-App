
export enum ContentType {
  // Main structured types
  Event = 'event',
  Job = 'job',
  Product = 'product',
  Portfolio = 'portfolio',
  Tutorial = 'tutorial',
  Offer = 'offer',
  Announcement = 'announcement',
  Research = 'research',
  Update = 'update',
  TeamSpotlight = 'team_spotlight',
  Quote = 'quote',
  Festival = 'festival',
  
  // Kept for backward compatibility or simpler classification
  Recipe = 'recipe',
  Post = 'post',
  Meme = 'meme',
  Other = 'other',

  // Deprecated, use Tutorial and Portfolio
  Education = 'education',
  Design = 'design',
}

export enum ItemStatus {
  New = 'new',
  Reviewed = 'reviewed',
  Archived = 'archived',
}

export enum SourceType {
  Screenshot = 'screenshot',
  Instagram = 'instagram',
  LinkedIn = 'linkedin',
  Bookmark = 'bookmark',
  Manual = 'manual',
}

export interface User {
  id: string;
  display_name: string;
  avatar_url: string;
}

export interface Rewards {
  xp: number;
  level: number;
  streak: number;
  last_activity: Date;
}

// ========================================
// ENHANCED STRUCTURED DATA INTERFACES
// ========================================

export interface EventData {
    title: string;
    type?: 'Conference' | 'Webinar' | 'Workshop' | 'Meetup' | 'Seminar' | 'Launch Event' | 'Networking' | 'Competition' | 'Exhibition' | 'Festival';
    date: string; // "YYYY-MM-DD"
    time?: string; // "HH:MM"
    endTime?: string;
    duration?: string;
    location?: string;
    host?: string;
    organizer?: string;
    speakers?: string[];
    agenda?: string[];
    topics?: string[];
    targetAudience?: string;
    registrationLink?: string;
    cost?: string;
    capacity?: string;
    prerequisites?: string;
    certificates?: string;
    contactEmail?: string;
    hashtags?: string[];
}

export interface JobData {
    role: string;
    company?: string;
    companyDescription?: string;
    location?: string;
    jobType?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance' | 'Temporary';
    workMode?: 'Remote' | 'On-site' | 'Hybrid';
    salary?: string;
    experience?: string;
    education?: string;
    skillsRequired?: string[];
    responsibilities?: string[];
    qualifications?: string[];
    benefits?: string[];
    department?: string;
    reportingTo?: string;
    deadline?: string; // "YYYY-MM-DD"
    applyLink?: string;
    contactEmail?: string;
    jobId?: string;
}

export interface ProductData {
    name: string;
    brand?: string;
    category?: string;
    subCategory?: string;
    price?: string;
    originalPrice?: string;
    discount?: string;
    releaseDate?: string;
    keyFeatures?: string[];
    specifications?: string[];
    colors?: string[];
    sizes?: string[];
    availableOn?: string[];
    warranty?: string;
    version?: string;
    compatibility?: string;
    dimensions?: string;
    weight?: string;
    materials?: string;
    targetAudience?: string;
    productLink?: string;
}

export interface PortfolioData {
    projectName: string;
    projectType?: 'UI/UX' | 'Game Design' | '3D Model' | 'VFX' | 'Graphic Design' | 'Web Design' | 'App Design' | 'Motion Graphics' | 'Branding' | 'Illustration' | 'Animation';
    description?: string;
    challenge?: string;
    solution?: string;
    toolsUsed?: string[];
    duration?: string;
    role?: string;
    teamSize?: string;
    client?: string;
    industry?: string;
    deliverables?: string[];
    process?: string[];
    outcome?: string;
    keyFeatures?: string[];
    technologies?: string[];
    platforms?: string[];
    awards?: string;
    projectLink?: string;
    caseStudyLink?: string;
}

export interface TutorialData {
    title: string;
    description?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Expert' | 'Advanced' | 'All Levels';
    prerequisites?: string[];
    toolsRequired?: string[];
    duration?: string;
    stepsCount?: number;
    category?: string;
    subcategory?: string;
    topics?: string[];
    learningOutcomes?: string[];
    targetAudience?: string;
    instructor?: string;
    language?: string;
    downloadLink?: string;
    videoLink?: string;
    articleLink?: string;
    cost?: string;
}

export interface OfferData {
    title: string;
    description?: string;
    validFrom?: string; // "YYYY-MM-DD"
    validTill?: string; // "YYYY-MM-DD"
    discount?: string;
    originalPrice?: string;
    salePrice?: string;
    applicableOn?: string[];
    exclusions?: string[];
    conditions?: string;
    minPurchase?: string;
    maxDiscount?: string;
    couponCode?: string;
    platform?: string;
    offerType?: 'Percentage' | 'Flat' | 'BOGO' | 'Cashback' | 'Bundle';
    category?: string;
    redemptionLimit?: string;
    offerLink?: string;
}

export interface AnnouncementData {
    title: string;
    type?: 'Company Update' | 'Launch' | 'News' | 'Policy Change' | 'Milestone' | 'Award' | 'Partnership' | 'Hiring' | 'Event';
    description?: string;
    effectiveFrom?: string; // "YYYY-MM-DD"
    department?: string;
    teamInvolved?: string[];
    impact?: string;
    actionRequired?: string;
    deadline?: string;
    moreInfoLink?: string;
    contactPerson?: string;
    contactEmail?: string;
    priority?: 'High' | 'Medium' | 'Low' | 'Urgent';
    audience?: string;
}

export interface ResearchData {
    reportTitle: string;
    abstract?: string;
    source?: string;
    authors?: string[];
    year?: number;
    publicationDate?: string;
    industry?: string;
    region?: string;
    methodology?: string;
    sampleSize?: number;
    demographics?: string;
    keyFindings?: string[];
    keyInsights?: string[];
    trends?: string[];
    recommendations?: string[];
    dataPoints?: string[];
    limitations?: string;
    futureResearch?: string;
    fullReportLink?: string;
    doi?: string;
}

export interface UpdateData {
    updateTitle: string;
    version?: string;
    versionType?: 'Major' | 'Minor' | 'Patch' | 'Hotfix';
    releaseDate?: string; // "YYYY-MM-DD"
    newFeatures?: string[];
    improvements?: string[];
    bugFixes?: string[];
    performance?: string[];
    security?: string[];
    knownIssues?: string[];
    deprecations?: string[];
    platforms?: string[];
    compatibility?: string;
    fileSize?: string;
    downloadLink?: string;
    changelog?: string;
}

export interface TeamSpotlightData {
    name: string;
    role?: string;
    department?: string;
    experience?: string;
    education?: string;
    skills?: string[];
    specializations?: string[];
    achievements?: string[];
    currentProjects?: string[];
    interests?: string[];
    hobbies?: string[];
    funFact?: string;
    location?: string;
    joinDate?: string;
    quote?: string;
    bio?: string;
    linkedIn?: string;
    twitter?: string;
    portfolio?: string;
}

export interface QuoteData {
    text: string;
    author?: string;
    source?: string;
    context?: string;
    year?: string;
    category?: 'Motivation' | 'Productivity' | 'Leadership' | 'Success' | 'Innovation' | 'Life' | 'Business';
    theme?: 'Aesthetic' | 'Minimal' | 'Tech' | 'Professional' | 'Inspirational';
    language?: string;
    relatedTopics?: string[];
}

export interface FestivalData {
    name: string;
    occasion?: string;
    date?: string; // "YYYY-MM-DD"
    duration?: string;
    theme?: 'Traditional' | 'Modern' | 'Minimal' | 'Festive' | 'Corporate';
    colorsUsed?: string[];
    specialMessage?: string;
    culturalSignificance?: string;
    traditions?: string[];
    symbols?: string[];
    region?: string;
    company?: string;
}

export interface RecipeData {
    recipeName?: string;
    description?: string;
    cuisine?: string;
    course?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Appetizer' | 'Main Course' | 'Side Dish' | 'Beverage';
    dietaryInfo?: string[];
    ingredients: string[];
    steps: string[];
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    equipment?: string[];
    techniques?: string[];
    tips?: string[];
    variations?: string[];
    storage?: string;
    reheating?: string;
    nutritionInfo?: string;
    allergens?: string[];
    author?: string;
    source?: string;
}

export interface PostData {
    author?: string;
    authorHandle?: string;
    authorTitle?: string;
    platform?: 'LinkedIn' | 'X' | 'Instagram' | 'Facebook' | 'Blog' | 'Medium' | 'Substack' | 'Other';
    postType?: 'Text' | 'Image' | 'Video' | 'Link' | 'Poll' | 'Carousel' | 'Story';
    postDate?: string;
    contentTheme?: string;
    tags?: string[];
    mentions?: string[];
    engagement?: string;
    callToAction?: string;
    links?: string[];
    sentiment?: 'Positive' | 'Negative' | 'Neutral' | 'Promotional' | 'Educational' | 'Inspirational';
    keyPoints?: string[];
    mediaDescription?: string;
}

// Kept for backward compatibility; new data will use PortfolioData
export interface DesignData extends PortfolioData {}
// Kept for backward compatibility; new data will use TutorialData
export interface EducationData extends TutorialData {}

// ========================================
// MAIN ITEM INTERFACE WITH ENHANCED FIELDS
// ========================================

export interface Item {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  body: string;
  content_type: ContentType;
  tags?: string[];
  thumbnail_url?: string;
  source_type: SourceType;
  created_at: Date;
  status: ItemStatus;
  reminder_id?: string;
  deck_ids?: string[];

  // Enhanced metadata fields
  headings?: string[];
  sections?: string[];
  keyPhrases?: string[];
  urls?: string[];
  entities?: string[];
  sentiment?: string;
  language?: string;
  
  // For screenshots/images
  visualElements?: string[];
  textLayout?: string;
  imageQuality?: string;

  // Structured Data Fields
  event_data?: EventData;
  job_data?: JobData;
  product_data?: ProductData;
  portfolio_data?: PortfolioData;
  tutorial_data?: TutorialData;
  offer_data?: OfferData;
  announcement_data?: AnnouncementData;
  research_data?: ResearchData;
  update_data?: UpdateData;
  team_spotlight_data?: TeamSpotlightData;
  quote_data?: QuoteData;
  festival_data?: FestivalData;

  // Legacy fields
  recipe_data?: RecipeData;
  post_data?: PostData;
  design_data?: DesignData;
  education_data?: EducationData;
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: Date;
}

export interface Reminder {
  id: string;
  item_id: string;
  title: string;
  reminder_time: Date;
}

export enum MissionType {
  CLASSIFY_FIRST_ITEM = 'CLASSIFY_FIRST_ITEM',
  ORGANIZE_ITEM = 'ORGANIZE_ITEM',
  COMPLETE_REMINDER = 'COMPLETE_REMINDER',
}

export interface Mission {
  id: MissionType;
  title: string;
  description: string;
  xp: number;
  goal: number;
  progress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  unlocked: boolean;
  reward: string;
}