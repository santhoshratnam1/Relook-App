import {
  User, Rewards, Item, Reminder, Deck, Mission, Achievement,
  ContentType, ItemStatus, SourceType, MissionType
} from '../types';

const MOCK_USER_ID = 'dev-user-123';

export const generateMockUser = (): User => ({
  id: MOCK_USER_ID,
  display_name: 'Dev User',
  avatar_url: 'https://i.pravatar.cc/150?u=devuser',
});

export const generateMockRewards = (): Rewards => ({
  xp: 750,
  level: 5,
  streak: 3,
  last_activity: new Date(),
});

export const generateMockItem = (id: number, contentType: ContentType, daysAgo: number, hasDeck: boolean): Item => {
  const creationDate = new Date();
  creationDate.setDate(creationDate.getDate() - daysAgo);

  // FIX: Explicitly type baseItem as Item to allow adding optional properties later.
  const baseItem: Item = {
    id: `item-mock-${id}`,
    user_id: MOCK_USER_ID,
    title: `Mock Item ${id}: A ${contentType.replace('_', ' ')}`,
    summary: `This is a summary for the mock ${contentType} item, created ${daysAgo} days ago.`,
    body: `This is the full body content for the mock ${contentType} item. It contains more details than the summary.`,
    content_type: contentType,
    tags: ['mock', contentType],
    source_type: SourceType.Manual,
    created_at: creationDate,
    status: ItemStatus.New,
    deck_ids: hasDeck ? [`deck-mock-1`] : [],
  };

  if (contentType === ContentType.Event) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 10);
    baseItem.title = 'Upcoming Tech Conference';
    baseItem.summary = 'Annual conference for developers and designers.';
    baseItem.event_data = {
      title: 'Upcoming Tech Conference',
      date: eventDate.toISOString().split('T')[0],
      time: '10:00',
      location: 'Virtual',
    };
    baseItem.reminder_id = `reminder-mock-${id}`;
  }
  
  if (contentType === ContentType.Recipe) {
    baseItem.title = 'Classic Chocolate Chip Cookies';
    baseItem.summary = 'A delicious and easy recipe for classic cookies.';
    baseItem.recipe_data = {
        recipeName: 'Classic Chocolate Chip Cookies',
        ingredients: ['1 cup butter', '3/4 cup sugar', '2 eggs', '2 1/4 cups flour', '1 tsp baking soda', '2 cups chocolate chips'],
        steps: ['Preheat oven to 375°F (190°C).', 'Cream together butter and sugar.', 'Beat in eggs one at a time.', 'Stir in flour and baking soda.', 'Fold in chocolate chips.', 'Bake for 9-11 minutes.'],
    };
  }

  return baseItem;
};

export const generateMockItems = (): Item[] => [
  generateMockItem(1, ContentType.Event, 2, true),
  generateMockItem(2, ContentType.Recipe, 5, true),
  generateMockItem(3, ContentType.Job, 8, false),
  generateMockItem(4, ContentType.Portfolio, 1, true),
  generateMockItem(5, ContentType.Post, 0, false),
  generateMockItem(6, ContentType.Tutorial, 12, true),
  generateMockItem(7, ContentType.Product, 3, false),
  generateMockItem(8, ContentType.Quote, 6, true),
];

export const generateMockDecks = (): Deck[] => [
  {
    id: 'deck-mock-1',
    user_id: MOCK_USER_ID,
    title: 'Project Ideas',
    description: 'A collection of ideas for future projects.',
    created_at: new Date(),
  },
  {
    id: 'deck-mock-2',
    user_id: MOCK_USER_ID,
    title: 'Recipes to Try',
    description: 'Delicious recipes found online.',
    created_at: new Date(),
  },
];

export const generateMockReminders = (): Reminder[] => {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 10);
  return [
    {
      id: 'reminder-mock-1',
      item_id: 'item-mock-1',
      title: 'Upcoming Tech Conference',
      reminder_time: eventDate,
    }
  ];
};

export const generateMockMissions = (): Mission[] => [
  { id: MissionType.SAVE_X_ITEMS, title: 'Daily Discovery', description: 'Save 2 new items.', xp: 50, goal: 2, progress: 1 },
  { id: MissionType.ORGANIZE_ITEM, title: 'Tidy Up', description: 'Organize an item into a deck.', xp: 30, goal: 1, progress: 0 },
  { id: MissionType.COMPLETE_REMINDER, title: 'Task Master', description: 'Complete one of your reminders.', xp: 50, goal: 1, progress: 1 },
];

export const generateMockAchievements = (): Achievement[] => [
  { id: 'first_steps', title: 'First Steps', description: 'Save your first 10 items', goal: 10, progress: 8, unlocked: false, reward: '🏆 +500 XP' },
  { id: 'organizer', title: 'Organizer', description: 'Create 5 decks', goal: 5, progress: 2, unlocked: false, reward: '🎨 Custom Colors' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7 day streak', goal: 7, progress: 3, unlocked: false, reward: '🔥 Bronze Badge' },
];

export const generateMockEquippedItems = (): { [key: string]: string } => ({
  theme: 'theme_dark_ocean',
  companion: 'companion_cat',
});


export const generateMockData = () => ({
  user: generateMockUser(),
  rewards: generateMockRewards(),
  items: generateMockItems(),
  decks: generateMockDecks(),
  reminders: generateMockReminders(),
  missions: generateMockMissions(),
  achievements: generateMockAchievements(),
  equippedItems: generateMockEquippedItems(),
});