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

// --- Detailed Structured Data Interfaces ---

export interface EventData {
    title: string;
    type?: 'Conference' | 'Webinar' | 'Workshop' | 'Meetup';
    date: string; // "YYYY-MM-DD"
    time?: string; // "HH:MM"
    location?: string;
    host?: string;
    speakers?: string[];
    agenda?: string[];
    registrationLink?: string;
}

export interface JobData {
    role: string;
    company?: string;
    location?: string;
    jobType?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
    salary?: string;
    experience?: string;
    skillsRequired?: string[];
    deadline?: string; // "YYYY-MM-DD"
    applyLink?: string;
}

export interface ProductData {
    name: string;
    category?: string;
    price?: string;
    releaseDate?: string;
    keyFeatures?: string[];
    availableOn?: string[];
    warranty?: string;
    version?: string;
}

export interface PortfolioData { // Formerly DesignData
    projectName: string;
    projectType?: 'UI/UX' | 'Game Design' | '3D Model' | 'VFX';
    toolsUsed?: string[];
    duration?: string;
    role?: string;
    client?: string;
    deliverables?: string[];
    outcome?: string;
}

export interface TutorialData { // Formerly EducationData
    title: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Expert';
    toolsRequired?: string[];
    duration?: string;
    stepsCount?: number;
    category?: string;
    downloadLink?: string;
}

export interface OfferData {
    title: string;
    validTill?: string; // "YYYY-MM-DD"
    discount?: string;
    applicableOn?: string[];
    conditions?: string;
    couponCode?: string;
    platform?: string;
}

export interface AnnouncementData {
    title: string;
    type?: 'Company Update' | 'Launch' | 'News';
    effectiveFrom?: string; // "YYYY-MM-DD"
    teamInvolved?: string[];
    impact?: string;
    moreInfoLink?: string;
}

export interface ResearchData {
    reportTitle: string;
    source?: string;
    year?: number;
    industry?: string;
    region?: string;
    sampleSize?: number;
    keyInsights?: string[];
    fullReportLink?: string;
}

export interface UpdateData {
    updateTitle: string;
    version?: string;
    releaseDate?: string; // "YYYY-MM-DD"
    newFeatures?: string[];
    bugFixes?: string[];
    platforms?: string[];
    downloadLink?: string;
}

export interface TeamSpotlightData {
    name: string;
    role?: string;
    experience?: string;
    skills?: string[];
    funFact?: string;
    location?: string;
    quote?: string;
}

export interface QuoteData {
    text: string;
    author?: string;
    category?: 'Motivation' | 'Productivity';
    theme?: 'Aesthetic' | 'Minimal' | 'Tech';
}

export interface FestivalData {
    name: string;
    date?: string; // "YYYY-MM-DD"
    theme?: 'Traditional' | 'Modern' | 'Minimal';
    colorsUsed?: string[];
    specialMessage?: string;
}


// --- Legacy or Simple Interfaces ---
export interface RecipeData {
  ingredients: string[];
  steps: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface PostData {
    author?: string;
    platform?: 'LinkedIn' | 'X' | 'Instagram' | 'Facebook' | 'Blog' | 'Other';
    tags?: string[];
}

// Kept for backward compatibility; new data will use PortfolioData
export interface DesignData extends PortfolioData {}
// Kept for backward compatibility; new data will use TutorialData
export interface EducationData extends TutorialData {}


// --- Main Item Interface ---
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
