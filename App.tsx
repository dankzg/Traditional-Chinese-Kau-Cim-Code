import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CimBucket } from './components/CimBucket';
import { FortuneDisplay } from './components/FortuneDisplay';
import { drawFortune } from './services/geminiService';
import { Fortune, GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Audio Context Reference
  const audioCtxRef = useRef<AudioContext | null>(null);

  // CSS Injection for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes bucket-shake {
        0% { transform: rotate(0deg) translate(0, 0); }
        25% { transform: rotate(-5deg) translate(-5px, 5px); }
        50% { transform: rotate(5deg) translate(5px, -5px); }
        75% { transform: rotate(-5deg) translate(-5px, 5px); }
        100% { transform: rotate(0deg) translate(0, 0); }
      }
      .animate-bucket-shake {
        animation: bucket-shake 0.2s infinite;
      }
      @keyframes stick-jostle {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      .animate-stick-jostle {
        animation: stick-jostle 0.3s infinite ease-in-out;
      }
      .writing-vertical-rl {
        writing-mode: vertical-rl;
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- Audio Logic ---

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playStickSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Create a small cluster of sounds to simulate multiple sticks hitting
    const collisionCount = 1 + Math.floor(Math.random() * 2); // 1 or 2 impacts per "shake" cycle

    for (let i = 0; i < collisionCount; i++) {
      const t = ctx.currentTime + (Math.random() * 0.03); // Slight offset
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Triangle wave gives a slightly hollow, woody character
      osc.type = 'triangle';
      // Randomize pitch to simulate different stick lengths/thicknesses (800Hz - 1400Hz)
      osc.frequency.value = 800 + Math.random() * 600;

      // Bandpass to focus the resonance
      filter.type = 'bandpass';
      filter.frequency.value = osc.frequency.value;
      filter.Q.value = 1;

      // Percussive envelope: fast attack, fast decay
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.005); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); // Short Decay

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    }
  }, []);

  // Effect loop for sound during shaking
  useEffect(() => {
    let timeoutId: any;

    const soundLoop = () => {
      if (gameState === 'SHAKING') {
        playStickSound();
        // Random interval between shakes for natural feel (80ms - 200ms)
        const nextDelay = 80 + Math.random() * 120;
        timeoutId = setTimeout(soundLoop, nextDelay);
      }
    };

    if (gameState === 'SHAKING') {
      soundLoop();
    }

    return () => clearTimeout(timeoutId);
  }, [gameState, playStickSound]);

  // --- End Audio Logic ---

  const handleDraw = useCallback(async () => {
    if (loading || gameState !== 'IDLE') return;

    // Initialize audio context on user interaction
    initAudio();

    setLoading(true);
    setGameState('SHAKING');

    // Minimum shake time for effect (2.5 seconds)
    const minShakeTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Fetch fortune
    const fortunePromise = drawFortune();

    try {
      const [_, result] = await Promise.all([minShakeTime, fortunePromise]);
      setFortune(result);
      
      setGameState('DROPPING');
      
      // Drop animation time (e.g., 1 second)
      setTimeout(() => {
        setGameState('REVEALED');
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Failed to draw", error);
      setGameState('IDLE');
      setLoading(false);
      alert("求簽失敗，請稍後再試。 (Failed to connect to the spirits)");
    }
  }, [gameState, loading, initAudio]);

  const handleReset = useCallback(() => {
    setFortune(null);
    setGameState('IDLE');
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8e1] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}>
      </div>

      {/* Header */}
      <div className="z-10 mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#8B0000] mb-2 font-serif tracking-widest drop-shadow-md">
          靈簽
        </h1>
        <p className="text-[#500000] font-serif text-lg tracking-wider">
          誠心求問 • 指點迷津
        </p>
      </div>

      {/* Main Interaction Area */}
      <div className="z-10 flex flex-col items-center gap-8">
        <CimBucket gameState={gameState} />
        
        <div className="h-20 flex items-center justify-center">
            {gameState === 'IDLE' && (
                <button
                    onClick={handleDraw}
                    disabled={loading}
                    className="px-12 py-4 bg-gradient-to-b from-[#8B0000] to-[#500000] text-[#FFD700] 
                               font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl hover:scale-105 
                               transform transition-all duration-200 border-2 border-[#DAA520]
                               flex items-center gap-3 font-serif"
                >
                    <span>搖 簽</span>
                </button>
            )}

            {gameState === 'SHAKING' && (
                <div className="text-[#8B0000] text-xl font-serif animate-pulse">
                    誠心默念所求之事...
                </div>
            )}
            
            {gameState === 'DROPPING' && (
                <div className="text-[#8B0000] text-xl font-serif">
                    靈簽降臨...
                </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-[#8B0000] opacity-50 text-sm font-serif">
        Traditional Kau Cim Simulation
      </div>

      {/* Result Modal */}
      {gameState === 'REVEALED' && (
        <FortuneDisplay fortune={fortune} onReset={handleReset} />
      )}
    </div>
  );
}