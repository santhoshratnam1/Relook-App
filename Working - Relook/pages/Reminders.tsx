
import React from 'react';
import { Reminder, Item } from '../types';
import DashboardCard from '../components/DashboardCard';
import { BellIcon } from '../components/IconComponents';

interface RemindersPageProps {
  reminders: Reminder[];
  items: Item[];
  onCompleteReminder: (reminderId: string) => void;
}

const RemindersPage: React.FC<RemindersPageProps> = ({ reminders, items, onCompleteReminder }) => {
  // FIX: Explicitly type the Map to ensure correct type inference for `sourceItem`.
  const itemsById = new Map<string, Item>(items.map(item => [item.id, item]));

  const formatDateTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="px-6 space-y-4">
      <h2 className="text-2xl font-bold text-white mt-4">Reminders</h2>
      {reminders.length === 0 && (
          <div className="text-center py-16 text-gray-400">
              <BellIcon className="w-12 h-12 mx-auto mb-4" />
              <p>No reminders found.</p>
              <p className="text-sm">The AI will automatically create them when you save items with dates or deadlines.</p>
          </div>
      )}
      {reminders.sort((a,b) => new Date(a.reminder_time).getTime() - new Date(b.reminder_time).getTime())
        .map((reminder) => {
        const sourceItem = itemsById.get(reminder.item_id);
        return (
          <DashboardCard key={reminder.id} className="hover:scale-[1.01]">
            <div>
              <p className="font-bold text-white">{reminder.title}</p>
              <p className="text-sm text-cyan-300 font-semibold mt-1">{formatDateTime(reminder.reminder_time)}</p>
              {sourceItem && (
                 <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-1">From item:</p>
                    <p className="text-sm font-semibold text-gray-300 line-clamp-1">{sourceItem.title}</p>
                 </div>
              )}
               <div className="mt-4">
                <button 
                    onClick={() => onCompleteReminder(reminder.id)}
                    className="w-full font-bold py-2 px-4 rounded-full bg-gradient-to-r from-[#e6f0c680] to-[#f6f2d880] text-black hover:opacity-90 transition-opacity text-sm"
                >
                    Mark as Complete
                </button>
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
};

export default RemindersPage;