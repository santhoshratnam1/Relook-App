import { Mission, MissionType } from '../types';

export const DAILY_MISSIONS_POOL: Omit<Mission, 'progress'>[] = [
  {
    id: MissionType.SAVE_X_ITEMS,
    title: 'Daily Discovery',
    description: 'Save 2 new items.',
    xp: 50,
    goal: 2,
  },
  {
    id: MissionType.ORGANIZE_ITEM,
    title: 'Tidy Up',
    description: 'Organize an item into a deck.',
    xp: 30,
    goal: 1,
  },
  {
    id: MissionType.COMPLETE_REMINDER,
    title: 'Task Master',
    description: 'Complete one of your reminders.',
    xp: 50,
    goal: 1,
  },
  {
    id: MissionType.CREATE_DECK,
    title: 'Architect',
    description: 'Create a new deck for your items.',
    xp: 100,
    goal: 1,
  },
  {
    id: MissionType.SAVE_X_ITEMS,
    title: 'Super Saver',
    description: 'Save 5 new items.',
    xp: 120,
    goal: 5,
  },
];

// Helper to get a set of random missions for the day
export const getDailyMissions = (count: number = 3): Omit<Mission, 'progress'>[] => {
    const shuffled = [...DAILY_MISSIONS_POOL].sort(() => 0.5 - Math.random());
    // Ensure we don't have duplicate mission IDs if the pool is small or has duplicates
    const uniqueMissions = Array.from(new Map(shuffled.map(m => [m.id, m])).values());
    return uniqueMissions.slice(0, count);
};
