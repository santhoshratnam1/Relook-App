export enum ContentType {
  Learning = 'learning',
  Product = 'product',
  Event = 'event',
  Quote = 'quote',
  Meme = 'meme',
  Job = 'job',
  Recipe = 'recipe',
  Other = 'other',
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

export interface RecipeData {
  ingredients: string[];
  steps: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Item {
  id: string;
  user_id: string;
  title: string;
  body: string;
  content_type: ContentType;
  thumbnail_url?: string;
  source_type: SourceType;
  created_at: Date;
  status: ItemStatus;
  reminder_id?: string;
  deck_ids?: string[];
  recipe_data?: RecipeData;
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

export interface ExtractedEvent {
    title: string;
    date: string; // "YYYY-MM-DD"
    time?: string; // "HH:MM"
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