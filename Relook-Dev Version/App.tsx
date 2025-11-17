import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import RemindersPage from './pages/Reminders';
import DecksPage from './pages/Decks';
import DeckDetail from './pages/DeckDetail';
import ItemDetail from './pages/ItemDetail';
import KnowledgeTreePage from './pages/KnowledgeTreePage';
import UndoNotification from './components/UndoNotification';
import SearchModal from './components/SearchModal';
import SideMenu from './components/SideMenu';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import RewardModal from './components/RewardModal';
import AchievementsPage from './pages/AchievementsPage';
import StorePage from './pages/StorePage';
import MyStuffPage from './pages/MyStuffPage';
import OnboardingTour from './components/OnboardingTour';
import ComboNotification from './components/ComboNotification';
import StreakNotification from './components/StreakNotification';
import InsightsPage from './pages/InsightsPage';
import DevTools from './components/DevTools';
import { 
    User, Rewards, Item, Reminder, ContentType, ItemStatus, SourceType, EventData, Deck, 
    Mission, MissionType, Achievement, GenericReward
} from './types';
import { StoreItem } from './data/store';
import { getDailyMissions } from './data/missions';
import { ACHIEVEMENTS_BLUEPRINT } from './data/achievements';
import { classifyContent } from './services/geminiService';
import { generateMockData, generateMockItem } from './data/mockData';

const initialUser: User = {
  id: 'user-123',
  display_name: 'Alex',
  avatar_url: 'https://picsum.photos/seed/relookuser/100/100',
};

const initialRewards: Rewards = { xp: 0, level: 1, streak: 0, last_activity: new Date(0) };
const initialItems: Item[] = [];
const initialReminders: Reminder[] = [];
const initialDecks: Deck[] = [];

const XP_PER_ITEM = 50;
const XP_PER_DECK_CREATE = 100;
const XP_PER_ADD_TO_DECK = 20;
const XP_BASE_PER_LEVEL = 1000;
const MYSTERY_BOX_XP = 250;


interface UndoState {
  item: Item;
  reminder?: Reminder;
  createdDeckId?: string;
  previousRewards: Rewards;
  timeoutId: number;
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

type AddItemData = Omit<Item, 'id' | 'user_id' | 'created_at' | 'status' | 'thumbnail_url' | 'reminder_id' | 'deck_ids' | 'design_data' | 'education_data'>;

const App: React.FC = () => {
  const initialIsDevMode = useMemo(() => JSON.parse(localStorage.getItem('relook-dev-mode') || 'false'), []);
  const [isDevMode, setIsDevMode] = useState<boolean>(initialIsDevMode);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('relook-auth'));
  const [currentPath, setCurrentPath] = useState('/');
  const [navHistory, setNavHistory] = useState(['/']);
  
  const [user, setUser] = useState<User>(() => initialIsDevMode ? generateMockData().user : JSON.parse(localStorage.getItem('relook-user') || JSON.stringify(initialUser)));
  const [rewards, setRewards] = useState<Rewards>(() => initialIsDevMode ? generateMockData().rewards : JSON.parse(localStorage.getItem('relook-rewards') || JSON.stringify(initialRewards), (key, value) => key === 'last_activity' ? new Date(value) : value));
  const [items, setItems] = useState<Item[]>(() => initialIsDevMode ? generateMockData().items : JSON.parse(localStorage.getItem('relook-items') || JSON.stringify(initialItems), (key, value) => (key === 'created_at' || key === 'reminder_time') ? new Date(value) : value));
  const [reminders, setReminders] = useState<Reminder[]>(() => initialIsDevMode ? generateMockData().reminders : JSON.parse(localStorage.getItem('relook-reminders') || JSON.stringify(initialReminders), (key, value) => key === 'reminder_time' ? new Date(value) : value));
  const [decks, setDecks] = useState<Deck[]>(() => initialIsDevMode ? generateMockData().decks : JSON.parse(localStorage.getItem('relook-decks') || JSON.stringify(initialDecks), (key, value) => key === 'created_at' ? new Date(value) : value));
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [missions, setMissions] = useState<Mission[]>(() => initialIsDevMode ? generateMockData().missions : JSON.parse(localStorage.getItem('relook-missions') || '[]'));
  const [achievements, setAchievements] = useState<Achievement[]>(() => initialIsDevMode ? generateMockData().achievements : JSON.parse(localStorage.getItem('relook-achievements') || '[]'));
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedReward, setEarnedReward] = useState<GenericReward | null>(null);
  const [isMysteryBoxAvailable, setIsMysteryBoxAvailable] = useState<boolean>(() => initialIsDevMode ? true : JSON.parse(localStorage.getItem('relook-mystery-box-available') || 'false'));
  const [equippedItems, setEquippedItems] = useState<{[key: string]: string}>(() => initialIsDevMode ? generateMockData().equippedItems : JSON.parse(localStorage.getItem('relook-equipped-items') || '{}'));

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => (localStorage.getItem('relook-font-size') as 'sm' | 'md' | 'lg') || 'md');

  const [comboCount, setComboCount] = useState(0);
  const comboTimerRef = useRef<number | null>(null);
  const [streakNotificationCount, setStreakNotificationCount] = useState(0);
  const prevStreakRef = useRef(rewards.streak);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const seedMockData = useCallback(() => {
    const mockData = generateMockData();
    setUser(mockData.user);
    setRewards(mockData.rewards);
    setItems(mockData.items);
    setReminders(mockData.reminders);
    setDecks(mockData.decks);
    setMissions(mockData.missions);
    setAchievements(mockData.achievements);
    setEquippedItems(mockData.equippedItems);
    setIsMysteryBoxAvailable(true);
  }, []);

  const handleToggleDevMode = () => {
    const nextDevMode = !isDevMode;
    setIsDevMode(nextDevMode);
    localStorage.setItem('relook-dev-mode', JSON.stringify(nextDevMode));
    window.location.reload();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL app data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-auth', JSON.stringify(isAuthenticated)); }, [isAuthenticated, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-user', JSON.stringify(user)); }, [user, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-rewards', JSON.stringify(rewards)); }, [rewards, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-items', JSON.stringify(items)); }, [items, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-reminders', JSON.stringify(reminders));}, [reminders, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-decks', JSON.stringify(decks)); }, [decks, isDevMode]);
  useEffect(() => { 
    if (!isDevMode) {
        localStorage.setItem('relook-missions', JSON.stringify(missions)); 
        localStorage.setItem('relook-missions-date', new Date().toISOString());
    }
  }, [missions, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-achievements', JSON.stringify(achievements)); }, [achievements, isDevMode]);
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-mystery-box-available', JSON.stringify(isMysteryBoxAvailable)); }, [isMysteryBoxAvailable, isDevMode]);
  
  useEffect(() => { if (!isDevMode) localStorage.setItem('relook-font-size', fontSize); }, [fontSize, isDevMode]);

  useEffect(() => {
    if (!isDevMode) localStorage.setItem('relook-equipped-items', JSON.stringify(equippedItems));
    const theme = equippedItems.theme;
    const root = document.documentElement;
    root.classList.remove('theme-ocean-depths', 'theme-sunset-glow');
    if (theme === 'theme_dark_ocean') root.classList.add('theme-ocean-depths');
    else if (theme === 'theme_sunset') root.classList.add('theme-sunset-glow');
  }, [equippedItems, isDevMode]);

  useEffect(() => {
    if (isDevMode) return;
    const onboardingComplete = localStorage.getItem('relook-onboarding-complete') === 'true';
    if (!onboardingComplete && isAuthenticated && items.length === 0) {
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, items.length, isDevMode]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('relook-onboarding-complete', 'true');
  };

  useEffect(() => {
    if (rewards.streak > prevStreakRef.current && rewards.streak > 0) {
      setStreakNotificationCount(rewards.streak);
    }
    prevStreakRef.current = rewards.streak;
  }, [rewards.streak]);

  const updateRewards = useCallback((xpToAdd: number) => {
    setRewards(prev => {
      let newXp = prev.xp + xpToAdd;
      let newLevel = prev.level;
      let xpForNextLevel = XP_BASE_PER_LEVEL * newLevel;
      while (newXp >= xpForNextLevel) {
        newLevel++;
        newXp -= xpForNextLevel;
        xpForNextLevel = XP_BASE_PER_LEVEL * newLevel;
      }
      
      const now = new Date();
      const lastActivity = new Date(prev.last_activity);
      let newStreak = prev.streak;
      if (!isSameDay(lastActivity, now)) {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        newStreak = isSameDay(lastActivity, yesterday) ? prev.streak + 1 : 1;
      }

      return { ...prev, xp: newXp, level: newLevel, streak: newStreak, last_activity: new Date() };
    });
  }, []);

  const checkAchievements = useCallback((updatedItems: Item[], updatedDecks: Deck[], updatedRewards: Rewards) => {
    setAchievements(prev => {
        let newAchievements = [...prev];
        let achievementUnlocked = false;

        for (const blueprint of ACHIEVEMENTS_BLUEPRINT) {
            const existing = newAchievements.find(a => a.id === blueprint.id);
            if (existing && existing.unlocked) continue;
            
            let currentProgress = 0;
            if (blueprint.id === 'first_steps') currentProgress = updatedItems.length;
            if (blueprint.id === 'organizer') currentProgress = updatedDecks.length;
            if (blueprint.id === 'streak_7' || blueprint.id === 'streak_30') currentProgress = updatedRewards.streak;
            if (blueprint.id === 'night_owl') {
                const nightOwlAch = newAchievements.find(a => a.id === 'night_owl');
                currentProgress = nightOwlAch ? nightOwlAch.progress : 0;
            }

            if (currentProgress >= blueprint.goal) {
                const newAchievement = { ...blueprint, progress: blueprint.goal, unlocked: true };
                newAchievements = newAchievements.map(a => a.id === blueprint.id ? newAchievement : a);
                setEarnedReward({ title: "Achievement Unlocked!", description: newAchievement.title, reward: newAchievement.reward, emoji: '🏆' });
                setShowRewardModal(true);
                achievementUnlocked = true;
                if (newAchievement.reward.includes('XP')) {
                    const xpAmount = parseInt(newAchievement.reward.split('+')[1].trim().split(' ')[0]);
                    if (!isNaN(xpAmount)) updateRewards(xpAmount);
                }
            } else if (existing) {
                newAchievements = newAchievements.map(a => a.id === blueprint.id ? { ...a, progress: currentProgress } : a);
            }
        }
        return newAchievements;
    });
}, [updateRewards]);


  useEffect(() => {
    if (!isAuthenticated || isDevMode) return;

    const lastMissionDate = localStorage.getItem('relook-missions-date');
    const now = new Date();

    if (!lastMissionDate || !isSameDay(new Date(lastMissionDate), now)) {
        const newMissions = getDailyMissions().map(m => ({ ...m, progress: 0 }));
        setMissions(newMissions);
        setIsMysteryBoxAvailable(false); // Reset mystery box for the new day
        localStorage.setItem('relook-missions-date', now.toISOString());
    } else if (missions.length === 0) {
        const newMissions = getDailyMissions().map(m => ({ ...m, progress: 0 }));
        setMissions(newMissions);
    }

    if (achievements.length === 0) {
      setAchievements(ACHIEVEMENTS_BLUEPRINT.map(a => ({ ...a, progress: 0, unlocked: false })));
    }
  }, [isAuthenticated, isDevMode, missions.length, achievements.length]);
  
  useEffect(() => {
    checkAchievements(items, decks, rewards);
  }, [items, decks, rewards, checkAchievements]);

  const updateMissionProgress = useCallback((missionId: MissionType, amount = 1) => {
    setMissions(prevMissions => {
        let missionJustCompleted = false;
        const newMissions = prevMissions.map(m => {
            if (m.id === missionId && m.progress < m.goal) {
                const newProgress = m.progress + amount;
                if (newProgress >= m.goal) {
                    missionJustCompleted = true;
                }
                return { ...m, progress: Math.min(newProgress, m.goal) };
            }
            return m;
        });

        if (missionJustCompleted) {
            const mission = missions.find(m => m.id === missionId);
            if (mission) updateRewards(mission.xp);
        }

        const allComplete = newMissions.length > 0 && newMissions.every(m => m.progress >= m.goal);
        if (allComplete && !isMysteryBoxAvailable) {
            setIsMysteryBoxAvailable(true);
        }
        return newMissions;
    });
  }, [updateRewards, missions, isMysteryBoxAvailable]);

  const handleClaimMysteryBox = () => {
    updateRewards(MYSTERY_BOX_XP);
    setIsMysteryBoxAvailable(false);
    setEarnedReward({
        title: "Mystery Box Opened!",
        description: "You found a treasure!",
        reward: `+${MYSTERY_BOX_XP} XP`,
        emoji: '🎁'
    });
    setShowRewardModal(true);
};


  const handleAddItem = useCallback((data: AddItemData) => {
    if (undoState) clearTimeout(undoState.timeoutId);
    
    const previousRewards = { ...rewards };
    const newItemId = `item-${Date.now()}`;
    let newReminder: Reminder | undefined = undefined;
  
    let newItem: Item = { ...data, id: newItemId, user_id: user.id, created_at: new Date(), status: ItemStatus.New, thumbnail_url: data.source_type === SourceType.Screenshot ? `https://picsum.photos/seed/${Date.now()}/200/200` : undefined };
  
    if (data.event_data) {
      const { title, date, time } = data.event_data;
      const reminderTime = new Date(`${date}T${time || '09:00:00'}`);
      if (!isNaN(reminderTime.getTime())) {
        newReminder = { id: `reminder-${Date.now()}`, item_id: newItemId, title: title, reminder_time: reminderTime };
        newItem.reminder_id = newReminder.id;
        setReminders(prev => [newReminder!, ...prev]);
      }
    }
  
    const AUTO_ORGANIZE_CONFIG: { [key in ContentType]?: string } = { [ContentType.Event]: "Events", [ContentType.Job]: "Jobs", [ContentType.Recipe]: "Recipes", [ContentType.Tutorial]: "Tutorials", [ContentType.Portfolio]: "Portfolios", [ContentType.Product]: "Products", [ContentType.Offer]: "Offers" };
    let finalDecks = [...decks];
    let xpToAdd = XP_PER_ITEM;
    let createdDeckId: string | undefined = undefined;
  
    const deckName = AUTO_ORGANIZE_CONFIG[newItem.content_type];
    if (deckName) {
      let autoDeck = finalDecks.find(d => d.title.toLowerCase() === deckName.toLowerCase());
      if (!autoDeck) {
        autoDeck = { id: `deck-${Date.now()}`, user_id: user.id, title: deckName, description: `Auto-created for ${newItem.content_type} items`, created_at: new Date() };
        finalDecks.unshift(autoDeck);
        createdDeckId = autoDeck.id;
      }
      newItem.deck_ids = [...(newItem.deck_ids || []), autoDeck.id];
      xpToAdd += XP_PER_ADD_TO_DECK;
      updateMissionProgress(MissionType.ORGANIZE_ITEM);
    }
  
    const newItems = [newItem, ...items];
    setItems(newItems);
    if (createdDeckId) setDecks(finalDecks);
    
    // Combo logic
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    setComboCount((prev) => prev + 1);
    comboTimerRef.current = window.setTimeout(() => setComboCount(0), 10000);
  
    updateRewards(xpToAdd);
    updateMissionProgress(MissionType.CLASSIFY_FIRST_ITEM);
    updateMissionProgress(MissionType.SAVE_X_ITEMS, newItems.filter(i => isSameDay(i.created_at, new Date())).length);


    // Night Owl Achievement Check
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 23 || hour < 4) {
        const nightOwlAch = achievements.find(a => a.id === 'night_owl');
        if (nightOwlAch && !nightOwlAch.unlocked) {
            setAchievements(prev => prev.map(a => a.id === 'night_owl' ? {...a, progress: 1} : a));
        }
    }
  
    if (!isDevMode) {
        const timeoutId = window.setTimeout(() => setUndoState(null), 5000);
        setUndoState({ item: newItem, reminder: newReminder, previousRewards, timeoutId, createdDeckId });
    }
  }, [undoState, rewards, user.id, items, decks, achievements, updateMissionProgress, updateRewards, isDevMode]);
  
  const handleCreateDeck = useCallback((deckData: { title: string; description: string }) => {
    const newDeck: Deck = { id: `deck-${Date.now()}`, user_id: user.id, title: deckData.title, description: deckData.description, created_at: new Date() };
    const newDecks = [newDeck, ...decks];
    setDecks(newDecks);
    updateRewards(XP_PER_DECK_CREATE);
    updateMissionProgress(MissionType.CREATE_DECK);
    return newDeck;
  }, [user.id, decks, updateRewards, updateMissionProgress]);
  
  const handleLogin = useCallback((loggedInUser: User) => { setIsAuthenticated(true); setUser(loggedInUser); setCurrentPath('/'); setNavHistory(['/']); setRegistrationSuccessMessage(''); }, []);
  const handleLogout = useCallback(() => { setIsAuthenticated(false); }, []);
  const handleSignUpSuccess = useCallback(() => { setRegistrationSuccessMessage('Account created! Please log in to continue.'); setAuthPage('login'); }, []);
  const handleUpdateUser = useCallback((updatedUser: { display_name: string; avatar_url: string; }) => { setUser(prev => ({ ...prev, ...updatedUser })); }, []);
  const handleNavigate = useCallback((path: string) => { if (path === currentPath) return; setNavHistory(prev => [...prev, path]); setCurrentPath(path); setIsSelectMode(false); setSelectedItemIds([]); }, [currentPath]);
  const handleBack = useCallback(() => { if (navHistory.length > 1) { const newHistory = [...navHistory]; newHistory.pop(); const prevPath = newHistory[newHistory.length - 1]; setNavHistory(newHistory); setCurrentPath(prevPath); } }, [navHistory]);
  const handleUndo = useCallback(() => { if (!undoState) return; clearTimeout(undoState.timeoutId); setItems(prev => prev.filter(i => i.id !== undoState.item.id)); if (undoState.reminder) { setReminders(prev => prev.filter(r => r.id !== undoState.reminder!.id)); } if (undoState.createdDeckId) { setDecks(prev => prev.filter(d => d.id !== undoState.createdDeckId)); } setRewards(undoState.previousRewards); setUndoState(null); }, [undoState]);
  const handleAddItemToDeck = useCallback((itemId: string, deckId: string) => { const item = items.find(i => i.id === itemId); if (!item || item.deck_ids?.includes(deckId)) return; setItems(prevItems => prevItems.map(i => i.id === itemId ? { ...i, deck_ids: [...(i.deck_ids || []), deckId] } : i )); updateRewards(XP_PER_ADD_TO_DECK); updateMissionProgress(MissionType.ORGANIZE_ITEM); }, [items, updateMissionProgress, updateRewards]);
  const handleAutoAddItemToDeck = useCallback((item: Item) => { const suggestedDeckName = `${item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)} Collection`; const existingDeck = decks.find(d => d.title.toLowerCase().includes(item.content_type.toLowerCase())); if (existingDeck) { handleAddItemToDeck(item.id, existingDeck.id); } else { const newDeck: Deck = { id: `deck-${Date.now()}`, user_id: user.id, title: suggestedDeckName, description: `Auto-created for ${item.content_type} items`, created_at: new Date() }; const newDecks = [newDeck, ...decks]; setDecks(newDecks); setItems(prev => prev.map(i => i.id === item.id ? { ...i, deck_ids: [newDeck.id] } : i )); updateRewards(XP_PER_ADD_TO_DECK); updateMissionProgress(MissionType.ORGANIZE_ITEM); } }, [decks, user.id, handleAddItemToDeck, updateRewards, updateMissionProgress]);
  const handleCompleteReminder = useCallback((reminderId: string) => { const reminder = reminders.find(r => r.id === reminderId); if (!reminder) return; setReminders(prev => prev.filter(r => r.id !== reminderId)); setItems(prev => prev.map(i => i.reminder_id === reminderId ? { ...i, reminder_id: undefined } : i)); const mission = missions.find(m => m.id === MissionType.COMPLETE_REMINDER); if(mission){ updateRewards(mission.xp); updateMissionProgress(MissionType.COMPLETE_REMINDER); } }, [reminders, updateMissionProgress, updateRewards, missions]);
  const handleUpdateItem = useCallback(async (itemId: string, data: { title: string; body: string }) => { const itemToUpdate = items.find(i => i.id === itemId); if (!itemToUpdate) return; const itemWithUserEdits = { ...itemToUpdate, ...data }; setItems(prevItems => prevItems.map(item => item.id === itemId ? itemWithUserEdits : item)); try { const classificationResult = await classifyContent(data.body); if (classificationResult) { const newEvent = classificationResult.eventData; const oldReminderId = itemToUpdate.reminder_id; const oldReminder = oldReminderId ? reminders.find(r => r.id === oldReminderId) : null; let nextReminders = [...reminders]; let newReminderId: string | undefined = oldReminderId; if (newEvent) { const reminderTime = new Date(`${newEvent.date}T${newEvent.time || '09:00:00'}`); if (!isNaN(reminderTime.getTime())) { if (oldReminder) { const reminderIndex = nextReminders.findIndex(r => r.id === oldReminder.id); if (reminderIndex !== -1) { nextReminders[reminderIndex] = { ...oldReminder, title: newEvent.title, reminder_time: reminderTime }; } } else { const newReminder = { id: `reminder-${Date.now()}`, item_id: itemId, title: newEvent.title, reminder_time: reminderTime }; nextReminders = [newReminder, ...nextReminders]; newReminderId = newReminder.id; } } } else if (oldReminder) { nextReminders = nextReminders.filter(r => r.id !== oldReminder.id); newReminderId = undefined; } setReminders(nextReminders); const finalUpdatedItem: Item = { ...itemWithUserEdits, summary: classificationResult.classification.summary, content_type: classificationResult.classification.category, tags: classificationResult.classification.tags, reminder_id: newReminderId, event_data: classificationResult.eventData || undefined, job_data: classificationResult.jobData || undefined, product_data: classificationResult.productData || undefined, portfolio_data: classificationResult.portfolioData || undefined, tutorial_data: classificationResult.tutorialData || undefined, offer_data: classificationResult.offerData || undefined, announcement_data: classificationResult.announcementData || undefined, research_data: classificationResult.researchData || undefined, update_data: classificationResult.updateData || undefined, team_spotlight_data: classificationResult.teamSpotlightData || undefined, quote_data: classificationResult.quoteData || undefined, festival_data: classificationResult.festivalData || undefined, recipe_data: classificationResult.recipeData || undefined, post_data: classificationResult.postData || undefined, headings: classificationResult.headings, sections: classificationResult.sections, keyPhrases: classificationResult.keyPhrases, urls: classificationResult.urls, entities: classificationResult.entities, sentiment: classificationResult.sentiment, language: classificationResult.language, }; setItems(prevItems => prevItems.map(item => item.id === itemId ? finalUpdatedItem : item)); } } catch (error) { console.error('Error re-classifying item during update. User text changes are saved.', error); } }, [items, reminders]);
  const handleDeleteItem = useCallback((itemId: string) => { const itemToDelete = items.find(i => i.id === itemId); if (!itemToDelete) return; setItems(prevItems => prevItems.filter(i => i.id !== itemId)); if (itemToDelete.reminder_id) { setReminders(prevReminders => prevReminders.filter(r => r.id !== itemToDelete.reminder_id)); } }, [items]);
  const handlePurchase = useCallback((itemId: string, price: number) => { setRewards(prev => { const newXp = Math.max(0, prev.xp - price); return { ...prev, xp: newXp }; }); console.log(`Purchased ${itemId} for ${price} XP`); }, []);
  const handleEquipItem = useCallback((item: StoreItem) => { setEquippedItems(prev => ({ ...prev, [item.type]: item.id === prev[item.type] ? undefined : item.id })); }, []);
  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => setFontSize(size);

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedItemIds([]); // Clear selection when toggling
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkDelete = () => {
    setItems(prev => prev.filter(item => !selectedItemIds.includes(item.id)));
    // Also remove any associated reminders
    const remindersToDelete = items
      .filter(item => selectedItemIds.includes(item.id) && item.reminder_id)
      .map(item => item.reminder_id);
    setReminders(prev => prev.filter(r => !remindersToDelete.includes(r.id)));
    
    setIsSelectMode(false);
    setSelectedItemIds([]);
  };

  const handleBulkAddToDeck = (deckId: string) => {
    setItems(prev => prev.map(item => {
      if (selectedItemIds.includes(item.id) && !item.deck_ids?.includes(deckId)) {
        return { ...item, deck_ids: [...(item.deck_ids || []), deckId] };
      }
      return item;
    }));
    updateRewards(XP_PER_ADD_TO_DECK * selectedItemIds.length);
    updateMissionProgress(MissionType.ORGANIZE_ITEM, selectedItemIds.length);
    setIsSelectMode(false);
    setSelectedItemIds([]);
  };

  const recentItems = useMemo(() => items.slice(0, 3), [items]);
  const newInboxItems = useMemo(() => items.filter(i => i.status === ItemStatus.New), [items]);

  if (!isAuthenticated && !isDevMode) {
    if (authPage === 'signup') return <SignUpPage onSignUpSuccess={handleSignUpSuccess} onShowLogin={() => setAuthPage('login')} />;
    return <LoginPage onLogin={handleLogin} onShowSignUp={() => setAuthPage('signup')} registrationSuccessMessage={registrationSuccessMessage}/>;
  }

  const renderPage = () => {
    if (currentPath.startsWith('/decks/')) { const deckId = currentPath.split('/')[2]; return <DeckDetail deckId={deckId} decks={decks} items={items} onNavigate={handleNavigate} onBack={handleBack} />; }
    if (currentPath.startsWith('/item/')) { const itemId = currentPath.split('/')[2]; return <ItemDetail itemId={itemId} items={items} decks={decks} reminders={reminders} onAddItemToDeck={handleAddItemToDeck} onCreateDeck={handleCreateDeck} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onNavigate={handleNavigate} onBack={handleBack}/>; }
    switch (currentPath) {
      case '/': return <Dashboard user={user} rewards={rewards} recentItems={recentItems} onItemAdded={handleAddItem} missions={missions} achievements={achievements} onNavigate={handleNavigate} equippedItems={equippedItems} isMysteryBoxAvailable={isMysteryBoxAvailable} onClaimMysteryBox={handleClaimMysteryBox} />;
      case '/inbox': return <Inbox items={newInboxItems} decks={decks} onAutoAddItemToDeck={handleAutoAddItemToDeck} onDeleteItem={handleDeleteItem} onNavigate={handleNavigate} isSelectMode={isSelectMode} onToggleSelectMode={handleToggleSelectMode} selectedItemIds={selectedItemIds} onSelectItem={handleSelectItem} onBulkDelete={handleBulkDelete} onBulkAddToDeck={handleBulkAddToDeck} onCreateDeck={handleCreateDeck} />;
      case '/tree': return <KnowledgeTreePage user={user} rewards={rewards} itemCount={items.length} deckCount={decks.length} equippedItems={equippedItems} lastActivity={rewards.last_activity} />;
      case '/decks': return <DecksPage decks={decks} items={items} onCreateDeck={handleCreateDeck} onNavigate={handleNavigate} />;
      case '/reminders': return <RemindersPage reminders={reminders} items={items} onCompleteReminder={handleCompleteReminder} />;
      case '/profile': return <ProfilePage user={user} onUpdateUser={handleUpdateUser} onBack={handleBack} fontSize={fontSize} onFontSizeChange={handleFontSizeChange} />;
      case '/achievements': return <AchievementsPage achievements={achievements} onBack={handleBack} />;
      case '/store': return <StorePage user={user} rewards={rewards} onBack={handleBack} onPurchase={handlePurchase} />;
      case '/my-stuff': return <MyStuffPage equippedItems={equippedItems} onEquipItem={handleEquipItem} onBack={handleBack} />;
      case '/insights': return <InsightsPage user={user} items={items} onBack={handleBack} />;
      default: return <Dashboard user={user} rewards={rewards} recentItems={recentItems} onItemAdded={handleAddItem} missions={missions} achievements={achievements} onNavigate={handleNavigate} equippedItems={equippedItems} isMysteryBoxAvailable={isMysteryBoxAvailable} onClaimMysteryBox={handleClaimMysteryBox} />;
    }
  };

  return (
    <div className="bg-bg-color text-white min-h-screen font-sans w-full" style={{ maxWidth: '100vw', overflowX: 'hidden', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      <Header onMenuClick={() => setIsMenuOpen(true)} onSearchClick={() => setIsSearchOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} rewards={rewards} onNavigate={handleNavigate} onLogout={handleLogout} isDevMode={isDevMode} onToggleDevMode={handleToggleDevMode}/>
      <main className="safe-area-top">{renderPage()}</main>
      <ComboNotification comboCount={comboCount} />
      <StreakNotification streakCount={streakNotificationCount} />
      {undoState && <UndoNotification onUndo={handleUndo} />}
      {isSearchOpen && <SearchModal items={items} onClose={() => setIsSearchOpen(false)} onNavigate={handleNavigate} />}
      {showRewardModal && earnedReward && ( <RewardModal reward={earnedReward} onClose={() => { setShowRewardModal(false); setEarnedReward(null); }} /> )}
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      {isDevMode && <DevTools onReseed={seedMockData} onGrantXp={() => updateRewards(500)} onAddItem={() => handleAddItem(generateMockItem(Date.now(), ContentType.Post, 0, false) as AddItemData)} onClearData={clearAllData} />}
      <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
