import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import RemindersPage from './pages/Reminders';
import DecksPage from './pages/Decks';
import DeckDetail from './pages/DeckDetail';
import KnowledgeTreePage from './pages/KnowledgeTreePage';
import UndoNotification from './components/UndoNotification';
import { User, Rewards, Item, Reminder, ContentType, ItemStatus, SourceType, ExtractedEvent, Deck, Mission, MissionType } from './types';
import { DAILY_MISSIONS_BLUEPRINT } from './data/missions';

const initialUser: User = {
  id: 'user-123',
  display_name: 'Alex',
  avatar_url: 'https://picsum.photos/seed/relookuser/100/100',
};

const initialRewards: Rewards = { xp: 450, level: 3, streak: 5, last_activity: new Date() };
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
  previousRewards: Rewards;
  timeoutId: number;
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [user] = useState<User>(initialUser);

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


  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => { localStorage.setItem('relook-rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('relook-items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('relook-reminders', JSON.stringify(reminders));}, [reminders]);
  useEffect(() => { localStorage.setItem('relook-decks', JSON.stringify(decks)); }, [decks]);
  useEffect(() => { 
    localStorage.setItem('relook-missions', JSON.stringify(missions)); 
    localStorage.setItem('relook-missions-date', new Date().toISOString());
  }, [missions]);

  useEffect(() => {
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
  }, []);


  const updateRewards = (xpToAdd: number, fromStreak = false) => {
    setRewards(prev => {
      let newXp = prev.xp + xpToAdd;
      let newLevel = prev.level;
      let xpForNextLevel = XP_BASE_PER_LEVEL * newLevel;
      while (newXp >= xpForNextLevel) {
        newLevel++;
        newXp -= xpForNextLevel;
        xpForNextLevel = XP_BASE_PER_LEVEL * newLevel;
      }
      
      const newStreak = (fromStreak || isSameDay(prev.last_activity, new Date())) ? prev.streak : (prev.streak + 1);

      return { ...prev, xp: newXp, level: newLevel, streak: newStreak, last_activity: new Date() };
    });
  }

  const updateMissionProgress = (missionId: MissionType, amount = 1) => {
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
                updateRewards(mission.xp, true);
            }
        }
        return newMissions;
    });
  }

  const handleAddItem = (data: { title: string; body: string; content_type: ContentType; source_type: SourceType; extractedEvent: ExtractedEvent | null }) => {
    if (undoState) clearTimeout(undoState.timeoutId);
    
    const previousRewards = { ...rewards };
    const newItemId = `item-${Date.now()}`;
    let newReminder: Reminder | undefined = undefined;
    
    const newItem: Item = {
      id: newItemId, user_id: user.id, created_at: new Date(), status: ItemStatus.New,
      thumbnail_url: data.source_type === SourceType.Screenshot ? `https://picsum.photos/seed/${Date.now()}/200/200` : undefined,
      title: data.title, body: data.body, content_type: data.content_type, source_type: data.source_type,
    };
    
    if (data.extractedEvent) {
      const { title, date, time } = data.extractedEvent;
      const reminderTime = new Date(`${date}T${time || '09:00:00'}`);
      if(!isNaN(reminderTime.getTime())) {
          newReminder = { id: `reminder-${Date.now()}`, item_id: newItemId, title: title, reminder_time: reminderTime };
          newItem.reminder_id = newReminder.id;
          setReminders(prev => [newReminder!, ...prev]);
      }
    }
    setItems(prev => [newItem, ...prev]);
    updateRewards(XP_PER_ITEM);
    updateMissionProgress(MissionType.CLASSIFY_FIRST_ITEM);

    const timeoutId = window.setTimeout(() => setUndoState(null), 5000);
    setUndoState({ item: newItem, reminder: newReminder, previousRewards, timeoutId });
  };

  const handleUndo = () => {
    if (!undoState) return;
    clearTimeout(undoState.timeoutId);
    setItems(prev => prev.filter(i => i.id !== undoState.item.id));
    if (undoState.reminder) setReminders(prev => prev.filter(r => r.id !== undoState.reminder!.id));
    setRewards(undoState.previousRewards);
    setUndoState(null);
  };

  const handleCreateDeck = (deckData: { title: string; description: string }) => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      user_id: user.id,
      title: deckData.title,
      description: deckData.description,
      created_at: new Date(),
    };
    setDecks(prev => [newDeck, ...prev]);
    updateRewards(XP_PER_DECK_CREATE, true);
  };

  const handleAddItemToDeck = (itemId: string, deckId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.deck_ids?.includes(deckId)) return;

    setItems(prevItems => prevItems.map(i => 
        i.id === itemId 
        ? { ...i, deck_ids: [...(i.deck_ids || []), deckId] } 
        : i
    ));

    updateRewards(XP_PER_ADD_TO_DECK, true);
    // FIX: Corrected typo from `ORGANIZ` to `ORGANIZE_ITEM`
    updateMissionProgress(MissionType.ORGANIZE_ITEM);
  };

  const handleCompleteReminder = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;
    
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    // Also remove reminder_id from item if it exists
    setItems(prev => prev.map(i => i.reminder_id === reminderId ? { ...i, reminder_id: undefined } : i));

    const mission = DAILY_MISSIONS_BLUEPRINT.find(m => m.id === MissionType.COMPLETE_REMINDER);
    if(mission){
      updateRewards(mission.xp, true);
      updateMissionProgress(MissionType.COMPLETE_REMINDER);
    }
  };

  // FIX: Added render function and main return statement for the component.
  const renderPage = () => {
    const cleanPath = currentPath.slice(1) || '/';
    
    if (cleanPath.startsWith('decks/')) {
        const deckId = cleanPath.split('/')[2];
        return <DeckDetail deckId={deckId} decks={decks} items={items} />;
    }

    switch (cleanPath) {
      case '/':
        return <Dashboard user={user} rewards={rewards} recentItems={items.slice(0, 3)} onItemAdded={handleAddItem} missions={missions} />;
      case '/inbox':
        return <Inbox items={items.filter(i => i.status === ItemStatus.New)} decks={decks} onAddItemToDeck={handleAddItemToDeck} onCreateDeck={handleCreateDeck} />;
      case '/tree':
        return <KnowledgeTreePage user={user} rewards={rewards} itemCount={items.length} deckCount={decks.length} />;
      case '/decks':
        return <DecksPage decks={decks} items={items} onCreateDeck={handleCreateDeck} />;
      case '/reminders':
        return <RemindersPage reminders={reminders} items={items} onCompleteReminder={handleCompleteReminder} />;
      default:
        return <Dashboard user={user} rewards={rewards} recentItems={items.slice(0, 3)} onItemAdded={handleAddItem} missions={missions} />;
    }
  };

  return (
    <div className="bg-[#0C0D0F] text-white min-h-screen font-sans pb-24 max-w-md mx-auto">
      <Header />
      <main>
        {renderPage()}
      </main>
      {undoState && <UndoNotification onUndo={handleUndo} />}
      <Navigation currentPath={currentPath} />
    </div>
  );
};

// FIX: Added default export for the App component.
export default App;
