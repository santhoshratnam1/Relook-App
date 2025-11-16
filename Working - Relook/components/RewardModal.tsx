import React from 'react';
import { Achievement } from '../types';

interface RewardModalProps {
    earnedReward: Achievement;
    onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ earnedReward, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-8 rounded-3xl border-2 border-[#E6F0C6] max-w-sm mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
                <h3 className="text-xl font-bold text-[#E6F0C6] mb-2">{earnedReward.title}</h3>
                <p className="text-gray-400 mb-4">{earnedReward.description}</p>
                <div className="bg-black/40 p-4 rounded-xl mb-6">
                    <p className="text-sm text-gray-400 mb-1">Reward:</p>
                    <p className="text-lg font-bold text-white">{earnedReward.reward}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-bold hover:opacity-90 transition-opacity"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default RewardModal;
