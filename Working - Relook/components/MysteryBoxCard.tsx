import React, { useState } from 'react';

interface MysteryBoxCardProps {
    onClaim: () => void;
}

const MysteryBoxCard: React.FC<MysteryBoxCardProps> = ({ onClaim }) => {
    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaimClick = () => {
        setIsClaimed(true);
        setTimeout(onClaim, 300); // Wait for animation before calling parent
    };

    return (
        <div className="px-4 mb-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 border border-purple-400 text-center transition-all duration-300 ${isClaimed ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}>
                <p className="text-lg font-bold text-white mb-2">🎉 All Missions Complete!</p>
                <p className="text-sm text-gray-300 mb-4">You've earned a special reward.</p>
                
                <div className="flex justify-center my-4">
                    <button 
                        onClick={handleClaimClick}
                        className="animate-box-shake transition-transform active:scale-95"
                        aria-label="Claim Mystery Box"
                    >
                        <div className="text-7xl" style={{filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4))'}}>🎁</div>
                    </button>
                </div>

                <button 
                    onClick={handleClaimClick}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg"
                >
                    Claim Mystery Box
                </button>
            </div>
        </div>
    );
};

export default MysteryBoxCard;
