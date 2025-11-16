import { Achievement } from '../types';

export const ACHIEVEMENTS_BLUEPRINT: Omit<Achievement, 'progress' | 'unlocked'>[] = [
    { id: 'first_steps', title: 'First Steps', description: 'Save your first 10 items', goal: 10, reward: '🏆 +500 XP' },
    { id: 'organizer', title: 'Organizer', description: 'Create 5 decks', goal: 5, reward: '🎨 Custom Colors' },
    { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7 day streak', goal: 7, reward: '🔥 Bronze Badge' },
    { id: 'streak_30', title: 'Month Master', description: 'Maintain a 30 day streak', goal: 30, reward: '🔥 Silver Badge' }
];
