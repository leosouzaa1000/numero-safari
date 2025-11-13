import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8; // Slower for kids
      utterance.pitch = 1.2; // Higher pitch for friendly voice
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playSound = useCallback((type: 'pop' | 'success' | 'complete') => {
    // Using Web Audio API for simple sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'pop':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'success':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'complete':
        // Happy melody
        [523, 659, 784].forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.2 + 0.3);
          osc.start(audioContext.currentTime + i * 0.2);
          osc.stop(audioContext.currentTime + i * 0.2 + 0.3);
        });
        break;
    }
  }, []);

  return { speak, playSound };
}
