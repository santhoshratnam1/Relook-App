import React, { useState } from 'react';

interface MysteryBoxCardProps {
    onClaim: () => void;
}

const MysteryBoxCard: React.FC<MysteryBoxCardProps> = ({ onClaim }) => {
    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaimClick = () => {
        setIsClaimed(true);
        setTimeout(onClaim, 300);
    };

    return (
        <div className="px-4 mb-4">
            <div className={`dashboard-card border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 ${isClaimed ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}>
                <p className="text-base font-bold text-white mb-1">All Missions Complete!</p>
                <p className="text-sm text-gray-400 mb-6">You've earned a special reward.</p>
                
                <div className="flex justify-center my-6">
                    <button 
                        onClick={handleClaimClick}
                        className="animate-box-shake transition-transform active:scale-95"
                        aria-label="Claim Mystery Box"
                    >
                        <div className="text-6xl">🎁</div>
                    </button>
                </div>

                <button 
                    onClick={handleClaimClick}
                    className="w-full font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all"
                >
                    Claim Mystery Box
                </button>
            </div>
        </div>
    );
};

export default MysteryBoxCard;