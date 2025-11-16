import { Mission, MissionType } from '../types';

export const DAILY_MISSIONS_BLUEPRINT: Omit<Mission, 'progress'>[] = [
  {
    id: MissionType.CLASSIFY_FIRST_ITEM,
    title: 'Daily Discovery',
    description: 'Classify your first item of the day.',
    xp: 25,
    goal: 1,
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
];
