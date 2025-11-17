import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeftIcon } from '../components/IconComponents';
import ImageLoader from '../components/ImageLoader';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (data: { display_name: string; avatar_url: string; }) => void;
  onBack: () => void;
  fontSize: 'sm' | 'md' | 'lg';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onBack, fontSize, onFontSizeChange }) => {
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

        <div className="pt-6 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-3">Appearance</h2>
          <div>
            <label className="text-sm font-semibold text-gray-300">Font Size</label>
            <div className="mt-2 flex bg-[#0C0D0F] border border-white/10 rounded-lg p-1">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                        key={size}
                        type="button"
                        onClick={() => onFontSizeChange(size)}
                        className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${
                            fontSize === size
                                ? 'bg-white/20 text-white'
                                : 'text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                    </button>
                ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;