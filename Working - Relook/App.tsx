
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { 
    User, Rewards, Item, Reminder, ContentType, ItemStatus, SourceType, EventData, Deck, 
    Mission, MissionType, Achievement
} from './types';
import { StoreItem } from './data/store';
import { DAILY_MISSIONS_BLUEPRINT } from './data/missions';
import { ACHIEVEMENTS_BLUEPRINT } from './data/achievements';
import { classifyContent } from './services/geminiService';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('relook-auth'));
  const [currentPath, setCurrentPath] = useState('/');
  const [navHistory, setNavHistory] = useState(['/']);
  
  const [user, setUser] = useState<User>(() => JSON.parse(localStorage.getItem('relook-user') || JSON.stringify(initialUser)));
  const [rewards, setRewards] = useState<Rewards>(() => JSON.parse(localStorage.getItem('relook-rewards') || JSON.stringify(initialRewards), (key, value) => key === 'last_activity' ? new Date(value) : value));
  const [items, setItems] = useState<Item[]>(() => JSON.parse(localStorage.getItem('relook-items') || JSON.stringify(initialItems), (key, value) => (key === 'created_at' || key === 'reminder_time') ? new Date(value) : value));
  const [reminders, setReminders] = useState<Reminder[]>(() => JSON.parse(localStorage.getItem('relook-reminders') || JSON.stringify(initialReminders), (key, value) => key === 'reminder_time' ? new Date(value) : value));
  const [decks, setDecks] = useState<Deck[]>(() => JSON.parse(localStorage.getItem('relook-decks') || JSON.stringify(initialDecks), (key, value) => key === 'created_at' ? new Date(value) : value));
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [missions, setMissions] = useState<Mission[]>(() => {
    const savedMissions = localStorage.getItem('relook-missions');
    const savedDate = localStorage.getItem('relook-missions-date');
    if (savedMissions && savedDate && isSameDay(new Date(savedDate), new Date())) {
        return JSON.parse(savedMissions);
    }
    return [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => JSON.parse(localStorage.getItem('relook-achievements') || '[]'));
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedReward, setEarnedReward] = useState<Achievement | null>(null);
  const [equippedItems, setEquippedItems] = useState<{[key: string]: string}>(() => {
    return JSON.parse(localStorage.getItem('relook-equipped-items') || '{}');
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState('');

  useEffect(() => { localStorage.setItem('relook-auth', JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('relook-user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('relook-rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('relook-items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('relook-reminders', JSON.stringify(reminders));}, [reminders]);
  useEffect(() => { localStorage.setItem('relook-decks', JSON.stringify(decks)); }, [decks]);
  useEffect(() => { 
    localStorage.setItem('relook-missions', JSON.stringify(missions)); 
    localStorage.setItem('relook-missions-date', new Date().toISOString());
  }, [missions]);
  useEffect(() => { localStorage.setItem('relook-achievements', JSON.stringify(achievements)); }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('relook-equipped-items', JSON.stringify(equippedItems));

    const theme = equippedItems.theme;
    const root = document.documentElement;
    root.classList.remove('theme-ocean-depths', 'theme-sunset-glow');
    if (theme === 'theme_dark_ocean') {
        root.classList.add('theme-ocean-depths');
    } else if (theme === 'theme_sunset') {
        root.classList.add('theme-sunset-glow');
    }
  }, [equippedItems]);

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

  const checkAchievements = useCallback((itemCount: number, deckCount: number, streak: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      let newProgress = achievement.progress;
      if (achievement.id === 'first_steps') newProgress = itemCount;
      if (achievement.id === 'organizer') newProgress = deckCount;
      if (achievement.id === 'streak_7') newProgress = streak;
      if (achievement.id === 'streak_30') newProgress = streak;
      
      const justUnlocked = !achievement.unlocked && newProgress >= achievement.goal;
      if (justUnlocked) {
        setEarnedReward(achievement);
        setShowRewardModal(true);
        if (achievement.reward.includes('XP')) {
          const xpAmount = parseInt(achievement.reward.split('+')[1].trim().split(' ')[0]);
          if (!isNaN(xpAmount)) {
            updateRewards(xpAmount);
          }
        }
        return { ...achievement, progress: achievement.goal, unlocked: true };
      }
      
      return { ...achievement, progress: newProgress };
    }));
  }, [updateRewards]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const lastActivity = rewards.last_activity;
    const now = new Date();

    if (!isSameDay(lastActivity, now)) {
        const newMissions = DAILY_MISSIONS_BLUEPRINT.map(m => ({ ...m, progress: 0 }));
        setMissions(newMissions);

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (!isSameDay(lastActivity, yesterday)) {
            setRewards(prev => ({ ...prev, streak: 0 }));
        }
    } else if (missions.length === 0) {
        const newMissions = DAILY_MISSIONS_BLUEPRINT.map(m => ({ ...m, progress: 0 }));
        setMissions(newMissions);
    }

    if (achievements.length === 0) {
      setAchievements(ACHIEVEMENTS_BLUEPRINT.map(a => ({ ...a, progress: 0, unlocked: false })));
    }
    checkAchievements(items.length, decks.length, rewards.streak);
  }, [isAuthenticated, achievements.length, checkAchievements, decks.length, items.length, missions.length, rewards.last_activity, rewards.streak]);

  const handleLogin = useCallback((loggedInUser: User) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    setCurrentPath('/');
    setNavHistory(['/']);
    setRegistrationSuccessMessage('');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const handleSignUpSuccess = useCallback(() => {
    setRegistrationSuccessMessage('Account created! Please log in to continue.');
    setAuthPage('login');
  }, []);


  const handleUpdateUser = useCallback((updatedUser: { display_name: string; avatar_url: string; }) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  }, []);

  const handleNavigate = useCallback((path: string) => {
    if (path === currentPath) return;
    setNavHistory(prev => [...prev, path]);
    setCurrentPath(path);
  }, [currentPath]);

  const handleBack = useCallback(() => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      const prevPath = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);
      setCurrentPath(prevPath);
    }
  }, [navHistory]);

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
            const mission = DAILY_MISSIONS_BLUEPRINT.find(m => m.id === missionId);
            if (mission) {
                updateRewards(mission.xp);
            }
        }
        return newMissions;
    });
  }, [updateRewards]);

  const handleAddItem = useCallback((data: AddItemData) => {
    if (undoState) clearTimeout(undoState.timeoutId);
  
    const previousRewards = { ...rewards };
    const newItemId = `item-${Date.now()}`;
    let newReminder: Reminder | undefined = undefined;
  
    let newItem: Item = {
      ...data,
      id: newItemId, 
      user_id: user.id, 
      created_at: new Date(), 
      status: ItemStatus.New,
      thumbnail_url: data.source_type === SourceType.Screenshot ? `https://picsum.photos/seed/${Date.now()}/200/200` : undefined,
    };
  
    if (data.event_data) {
      const { title, date, time } = data.event_data;
      const reminderTime = new Date(`${date}T${time || '09:00:00'}`);
      if (!isNaN(reminderTime.getTime())) {
        newReminder = { id: `reminder-${Date.now()}`, item_id: newItemId, title: title, reminder_time: reminderTime };
        newItem.reminder_id = newReminder.id;
        setReminders(prev => [newReminder!, ...prev]);
      }
    }
  
    const AUTO_ORGANIZE_CONFIG: { [key in ContentType]?: string } = {
        [ContentType.Event]: "Events",
        [ContentType.Job]: "Jobs",
        [ContentType.Recipe]: "Recipes",
        [ContentType.Tutorial]: "Tutorials",
        [ContentType.Portfolio]: "Portfolios",
        [ContentType.Product]: "Products",
        [ContentType.Offer]: "Offers",
    };

    let finalDecks = [...decks];
    let xpToAdd = XP_PER_ITEM;
    let createdDeckId: string | undefined = undefined;
  
    const deckName = AUTO_ORGANIZE_CONFIG[newItem.content_type];
    if (deckName) {
      let autoDeck = finalDecks.find(d => d.title.toLowerCase() === deckName.toLowerCase());
  
      if (!autoDeck) {
        autoDeck = {
          id: `deck-${Date.now()}`,
          user_id: user.id,
          title: deckName,
          description: `Auto-created for ${newItem.content_type} items`,
          created_at: new Date(),
        };
        finalDecks.unshift(autoDeck);
        createdDeckId = autoDeck.id; // Capture the new deck's ID
      }
  
      newItem.deck_ids = [...(newItem.deck_ids || []), autoDeck.id];
  
      xpToAdd += XP_PER_ADD_TO_DECK;
      updateMissionProgress(MissionType.ORGANIZE_ITEM);
    }
  
    const newItems = [newItem, ...items];
    setItems(newItems);
    if (createdDeckId) { // Only update decks state if a new one was actually created
      setDecks(finalDecks);
    }
  
    updateRewards(xpToAdd);
    updateMissionProgress(MissionType.CLASSIFY_FIRST_ITEM);
    checkAchievements(newItems.length, finalDecks.length, rewards.streak);
  
    const timeoutId = window.setTimeout(() => setUndoState(null), 5000);
    setUndoState({ item: newItem, reminder: newReminder, previousRewards, timeoutId, createdDeckId });
  }, [undoState, rewards, user.id, items, decks, checkAchievements, updateMissionProgress, updateRewards]);

  const handleUndo = useCallback(() => {
    if (!undoState) return;
    clearTimeout(undoState.timeoutId);
    setItems(prev => prev.filter(i => i.id !== undoState.item.id));
    if (undoState.reminder) {
        setReminders(prev => prev.filter(r => r.id !== undoState.reminder!.id));
    }
    if (undoState.createdDeckId) { // If a deck was created for this item
        setDecks(prev => prev.filter(d => d.id !== undoState.createdDeckId));
    }
    setRewards(undoState.previousRewards);
    setUndoState(null);
  }, [undoState]);

  const handleCreateDeck = useCallback((deckData: { title: string; description: string }) => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      user_id: user.id,
      title: deckData.title,
      description: deckData.description,
      created_at: new Date(),
    };
    const newDecks = [newDeck, ...decks];
    setDecks(newDecks);
    updateRewards(XP_PER_DECK_CREATE);
    checkAchievements(items.length, newDecks.length, rewards.streak);
  }, [user.id, decks, items.length, rewards.streak, checkAchievements, updateRewards]);

  const handleAddItemToDeck = useCallback((itemId: string, deckId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.deck_ids?.includes(deckId)) return;
  
    setItems(prevItems => prevItems.map(i => 
      i.id === itemId 
        ? { ...i, deck_ids: [...(i.deck_ids || []), deckId] } 
        : i
    ));
  
    updateRewards(XP_PER_ADD_TO_DECK);
    updateMissionProgress(MissionType.ORGANIZE_ITEM);
  }, [items, updateMissionProgress, updateRewards]);

  const handleAutoAddItemToDeck = useCallback((item: Item) => {
    const suggestedDeckName = `${item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)} Collection`;
    const existingDeck = decks.find(d => d.title.toLowerCase().includes(item.content_type.toLowerCase()));
    
    if (existingDeck) {
      handleAddItemToDeck(item.id, existingDeck.id);
    } else {
      const newDeck: Deck = {
        id: `deck-${Date.now()}`,
        user_id: user.id,
        title: suggestedDeckName,
        description: `Auto-created for ${item.content_type} items`,
        created_at: new Date(),
      };
      const newDecks = [newDeck, ...decks];
      setDecks(newDecks);
      
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, deck_ids: [newDeck.id] }
          : i
      ));
      
      updateRewards(XP_PER_ADD_TO_DECK);
      updateMissionProgress(MissionType.ORGANIZE_ITEM);
      checkAchievements(items.length, newDecks.length, rewards.streak);
    }
  }, [decks, user.id, items.length, rewards.streak, handleAddItemToDeck, updateRewards, updateMissionProgress, checkAchievements]);


  const handleCompleteReminder = useCallback((reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;
    
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    setItems(prev => prev.map(i => i.reminder_id === reminderId ? { ...i, reminder_id: undefined } : i));

    const mission = DAILY_MISSIONS_BLUEPRINT.find(m => m.id === MissionType.COMPLETE_REMINDER);
    if(mission){
      updateRewards(mission.xp);
      updateMissionProgress(MissionType.COMPLETE_REMINDER);
    }
  }, [reminders, updateMissionProgress, updateRewards]);

  const handleUpdateItem = useCallback(async (itemId: string, data: { title: string; body: string }) => {
    const itemToUpdate = items.find(i => i.id === itemId);
    if (!itemToUpdate) return;
  
    // 1. Optimistically update the item with the user's direct text edits.
    const itemWithUserEdits = { ...itemToUpdate, ...data };
    setItems(prevItems => prevItems.map(item => item.id === itemId ? itemWithUserEdits : item));
  
    try {
      // 2. Re-classify content with Gemini in the background.
      const classificationResult = await classifyContent(data.body);
  
      if (classificationResult) {
        const newEvent = classificationResult.eventData;
        const oldReminderId = itemToUpdate.reminder_id;
        const oldReminder = oldReminderId ? reminders.find(r => r.id === oldReminderId) : null;
        let nextReminders = [...reminders];
        let newReminderId: string | undefined = oldReminderId;
        
        // 3. Handle reminder creation/update/deletion logic.
        if (newEvent) {
          const reminderTime = new Date(`${newEvent.date}T${newEvent.time || '09:00:00'}`);
          if (!isNaN(reminderTime.getTime())) {
            if (oldReminder) {
              // Update existing reminder
              const reminderIndex = nextReminders.findIndex(r => r.id === oldReminder.id);
              if (reminderIndex !== -1) {
                nextReminders[reminderIndex] = { ...oldReminder, title: newEvent.title, reminder_time: reminderTime };
              }
            } else {
              // Create a new reminder
              const newReminder = { id: `reminder-${Date.now()}`, item_id: itemId, title: newEvent.title, reminder_time: reminderTime };
              nextReminders = [newReminder, ...nextReminders];
              newReminderId = newReminder.id;
            }
          }
        } else if (oldReminder) {
          // No new event data, so remove the old reminder
          nextReminders = nextReminders.filter(r => r.id !== oldReminder.id);
          newReminderId = undefined;
        }
        
        // 4. Update reminders state
        setReminders(nextReminders);
        
        // 5. Create the final item object with layered AI data and update items state
        const finalUpdatedItem: Item = { 
          ...itemWithUserEdits,
          summary: classificationResult.classification.summary,
          content_type: classificationResult.classification.category,
          tags: classificationResult.classification.tags,
          reminder_id: newReminderId,
          event_data: classificationResult.eventData || undefined,
          job_data: classificationResult.jobData || undefined,
          product_data: classificationResult.productData || undefined,
          portfolio_data: classificationResult.portfolioData || undefined,
          tutorial_data: classificationResult.tutorialData || undefined,
          offer_data: classificationResult.offerData || undefined,
          announcement_data: classificationResult.announcementData || undefined,
          research_data: classificationResult.researchData || undefined,
          update_data: classificationResult.updateData || undefined,
          team_spotlight_data: classificationResult.teamSpotlightData || undefined,
          quote_data: classificationResult.quoteData || undefined,
          festival_data: classificationResult.festivalData || undefined,
          recipe_data: classificationResult.recipeData || undefined,
          post_data: classificationResult.postData || undefined,
          headings: classificationResult.headings,
          sections: classificationResult.sections,
          keyPhrases: classificationResult.keyPhrases,
          urls: classificationResult.urls,
          entities: classificationResult.entities,
          sentiment: classificationResult.sentiment,
          language: classificationResult.language,
        };
        
        setItems(prevItems => prevItems.map(item => item.id === itemId ? finalUpdatedItem : item));
      }
    } catch (error) {
      console.error('Error re-classifying item during update. User text changes are saved.', error);
      // The user's text edits are already saved, so we just log the error.
    }
  }, [items, reminders]);

  const handleDeleteItem = useCallback((itemId: string) => {
    const itemToDelete = items.find(i => i.id === itemId);
    if (!itemToDelete) return;

    setItems(prevItems => prevItems.filter(i => i.id !== itemId));
    if (itemToDelete.reminder_id) {
      setReminders(prevReminders => prevReminders.filter(r => r.id !== itemToDelete.reminder_id));
    }
  }, [items]);

  const handlePurchase = useCallback((itemId: string, price: number) => {
    setRewards(prev => {
      const newXp = Math.max(0, prev.xp - price);
      return { ...prev, xp: newXp };
    });
    console.log(`Purchased ${itemId} for ${price} XP`);
  }, []);
  
  const handleEquipItem = useCallback((item: StoreItem) => {
    setEquippedItems(prev => ({
        ...prev,
        [item.type]: item.id === prev[item.type] ? null : item.id
    }));
  }, []);

  const recentItems = useMemo(() => items.slice(0, 3), [items]);
  const newInboxItems = useMemo(() => items.filter(i => i.status === ItemStatus.New), [items]);

  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return <SignUpPage onSignUpSuccess={handleSignUpSuccess} onShowLogin={() => setAuthPage('login')} />;
    }
    return <LoginPage 
      onLogin={handleLogin} 
      onShowSignUp={() => setAuthPage('signup')} 
      registrationSuccessMessage={registrationSuccessMessage}
    />;
  }

  const renderPage = () => {
    if (currentPath.startsWith('/decks/')) {
        const deckId = currentPath.split('/')[2];
        return <DeckDetail deckId={deckId} decks={decks} items={items} onNavigate={handleNavigate} onBack={handleBack} />;
    }

    if (currentPath.startsWith('/item/')) {
        const itemId = currentPath.split('/')[2];
        return <ItemDetail 
            itemId={itemId} 
            items={items} 
            decks={decks} 
            reminders={reminders}
            onAddItemToDeck={handleAddItemToDeck} 
            onCreateDeck={handleCreateDeck}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onNavigate={handleNavigate}
            onBack={handleBack}
        />;
    }

    switch (currentPath) {
      case '/':
        return <Dashboard 
          user={user} 
          rewards={rewards} 
          recentItems={recentItems} 
          onItemAdded={handleAddItem} 
          missions={missions} 
          achievements={achievements}
          onNavigate={handleNavigate} 
          equippedItems={equippedItems}
        />;
      case '/inbox':
        return <Inbox items={newInboxItems} decks={decks} onAutoAddItemToDeck={handleAutoAddItemToDeck} onDeleteItem={handleDeleteItem} onNavigate={handleNavigate} />;
      case '/tree':
        return <KnowledgeTreePage user={user} rewards={rewards} itemCount={items.length} deckCount={decks.length} equippedItems={equippedItems} />;
      case '/decks':
        return <DecksPage decks={decks} items={items} onCreateDeck={handleCreateDeck} onNavigate={handleNavigate} />;
      case '/reminders':
        return <RemindersPage reminders={reminders} items={items} onCompleteReminder={handleCompleteReminder} />;
      case '/profile':
        return <ProfilePage user={user} onUpdateUser={handleUpdateUser} onBack={handleBack} />;
      case '/achievements':
        return <AchievementsPage achievements={achievements} onBack={handleBack} />;
      case '/store':
        return <StorePage user={user} rewards={rewards} onBack={handleBack} onPurchase={handlePurchase} />;
      case '/my-stuff':
        return <MyStuffPage equippedItems={equippedItems} onEquipItem={handleEquipItem} onBack={handleBack} />;
      default:
        return <Dashboard 
          user={user} 
          rewards={rewards} 
          recentItems={recentItems} 
          onItemAdded={handleAddItem} 
          missions={missions} 
          achievements={achievements}
          onNavigate={handleNavigate} 
          equippedItems={equippedItems}
        />;
    }
  };

  return (
    <div className="bg-bg-color text-white min-h-screen font-sans w-full" style={{ 
      maxWidth: '100vw', 
      overflowX: 'hidden',
      paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' // Account for nav + safe area
    }}>
      <Header onMenuClick={() => setIsMenuOpen(true)} onSearchClick={() => setIsSearchOpen(true)} />
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        user={user}
        rewards={rewards}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="safe-area-top">
        {renderPage()}
      </main>
      {undoState && <UndoNotification onUndo={handleUndo} />}
      {isSearchOpen && <SearchModal items={items} onClose={() => setIsSearchOpen(false)} onNavigate={handleNavigate} />}
      {showRewardModal && earnedReward && (
        <RewardModal 
          earnedReward={earnedReward}
          onClose={() => {
            setShowRewardModal(false);
            setEarnedReward(null);
          }}
        />
      )}
      <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
