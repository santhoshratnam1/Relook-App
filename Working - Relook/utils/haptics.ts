export const hapticFeedback = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30;
    navigator.vibrate(duration);
  }
  
  // For iOS devices with Haptic Feedback API
  // This is a conceptual check; in a real-world scenario, you might need a Capacitor/Cordova plugin.
  if (typeof (window as any).Haptics?.impact === 'function') {
    (window as any).Haptics.impact({ style });
  }
};
