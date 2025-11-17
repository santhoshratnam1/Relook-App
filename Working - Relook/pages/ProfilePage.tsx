
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeftIcon } from '../components/IconComponents';
import ImageLoader from '../components/ImageLoader';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (data: { display_name: string; avatar_url: string; }) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onBack }) => {
  const [displayName, setDisplayName] = useState(user.display_name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onUpdateUser({ display_name: displayName, avatar_url: avatarUrl });
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="px-6 space-y-4 animate-fade-in">
        <div className="mt-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="flex items-center space-x-4">
                <ImageLoader src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full border-2 border-white/20" />
                <div className="flex-1">
                    <label htmlFor="avatar-url" className="text-sm font-semibold text-gray-300">Avatar URL</label>
                    <input
                        id="avatar-url"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="mt-1 w-full p-2 bg-[#0C0D0F] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="display-name" className="text-sm font-semibold text-gray-300">Display Name</label>
                <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 w-full p-2 bg-[#0C0D0F] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!displayName.trim()}
            >
                Save Changes
            </button>
        </form>
    </div>
  );
};

export default ProfilePage;