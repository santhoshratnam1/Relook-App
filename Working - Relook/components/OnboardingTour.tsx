
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

interface OnboardingTourProps {
  onComplete: () => void;
}

type TourStep = {
  target?: string;
  title: string;
  content: string;
  emoji?: string;
};

const tourSteps: TourStep[] = [
  {
    title: '👋 Hey there!',
    content: "Welcome to RELOOK! Let's take a fun 30-second tour of your new smart memory system.",
    emoji: '✨',
  },
  {
    target: '[data-tour-id="add-to-inbox"]',
    title: '📥 Capture Everything',
    content: 'Paste text, upload screenshots, or save links. Our AI instantly analyzes and categorizes it all!',
    emoji: '🤖',
  },
  {
    target: '[data-tour-id="nav-/inbox"]',
    title: '📮 Your Inbox',
    content: 'New items land here. Swipe to organize or delete. It\'s that easy!',
    emoji: '👆',
  },
  {
    target: '[data-tour-id="nav-/decks"]',
    title: '📚 Create Decks',
    content: 'Group related items into Decks. Think of them as your personal knowledge collections.',
    emoji: '🎯',
  },
  {
    target: '[data-tour-id="nav-/tree"]',
    title: '🌳 Watch It Grow',
    content: 'Your Knowledge Tree grows with every save. Complete missions, earn XP, and level up!',
    emoji: '🎮',
  },
  {
    title: '🚀 Ready to Roll!',
    content: 'That\'s it! Start saving your first item and build your digital memory garden.',
    emoji: '🎉',
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const step = tourSteps[currentStep];
  const isCenterStep = !step.target;

  useLayoutEffect(() => {
    if (step.target) {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => {
        const element = document.querySelector(step.target);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
          setIsVisible(true);
        } else {
          // Element not found, skip to next
          handleNext();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setTargetRect(null);
      setIsVisible(true);
    }
  }, [currentStep, step.target]);

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (currentStep < tourSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }, 150);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 150);
  };

  const highlightStyle: React.CSSProperties = targetRect ? {
    position: 'fixed',
    left: `${targetRect.left - 6}px`,
    top: `${targetRect.top - 6}px`,
    width: `${targetRect.width + 12}px`,
    height: `${targetRect.height + 12}px`,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px 4px rgba(230, 240, 198, 0.3)',
    borderRadius: '12px',
    zIndex: 10001,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    border: '2px solid rgba(230, 240, 198, 0.5)',
  } : {};

  const getPopoverPosition = (): React.CSSProperties => {
    if (!targetRect) return {};

    const padding = 16;
    const popoverWidth = 280;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate if target is in bottom half of screen
    const isBottomHalf = targetRect.top > viewportHeight / 2;
    
    let left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
    
    // Keep popover on screen horizontally
    if (left < padding) left = padding;
    if (left + popoverWidth > viewportWidth - padding) {
      left = viewportWidth - popoverWidth - padding;
    }

    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      left: `${left}px`,
      zIndex: 10002,
      width: `${popoverWidth}px`,
      maxWidth: `calc(100vw - ${padding * 2}px)`,
    };

    if (isBottomHalf) {
      // Show above target
      return {
        ...baseStyle,
        bottom: `${viewportHeight - targetRect.top + 16}px`,
      };
    } else {
      // Show below target
      return {
        ...baseStyle,
        top: `${targetRect.bottom + 16}px`,
      };
    }
  };
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[10000]" 
      style={{ 
        animation: 'fadeIn 0.3s ease-out',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out'
      }}
      onClick={!isCenterStep ? handleSkip : undefined}
    >
      {/* Spotlight overlay */}
      {targetRect && <div style={highlightStyle} />}
      
      {isCenterStep ? (
        /* Center modal for intro/outro */
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4">
          <div 
            className="bg-gradient-to-br from-[#1a1b1e] to-[#0f1012] p-8 rounded-3xl border-2 border-[#E6F0C6]/20 max-w-sm w-full text-center shadow-2xl"
            style={{
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {step.emoji && (
              <div className="text-6xl mb-4 animate-float">{step.emoji}</div>
            )}
            <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-gray-300 text-base leading-relaxed mb-8">{step.content}</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleNext} 
                className="font-bold py-3 px-6 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                {isLastStep ? "Let's Go! 🚀" : isFirstStep ? 'Start Tour' : 'Next'}
              </button>
              {!isLastStep && (
                <button 
                  onClick={handleSkip} 
                  className="text-sm text-gray-500 hover:text-white transition-colors py-2"
                >
                  Skip Tour
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Floating tooltip for feature highlights */
        <div 
          style={{
            ...getPopoverPosition(),
            animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-br from-[#1a1b1e] to-[#0f1012] p-5 rounded-2xl border-2 border-[#E6F0C6]/20 shadow-2xl">
            <div className="flex items-start gap-3 mb-3">
              {step.emoji && <span className="text-3xl flex-shrink-0">{step.emoji}</span>}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{step.content}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-xs text-gray-500 font-medium">
                {currentStep + 1} of {tourSteps.length}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleSkip} 
                  className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5"
                >
                  Skip
                </button>
                <button 
                  onClick={handleNext} 
                  className="text-sm font-bold py-1.5 px-5 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-95 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default OnboardingTour;
