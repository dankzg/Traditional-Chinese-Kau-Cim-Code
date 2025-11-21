import React from 'react';
import { Fortune } from '../types';

interface FortuneDisplayProps {
  fortune: Fortune | null;
  onReset: () => void;
}

export const FortuneDisplay: React.FC<FortuneDisplayProps> = ({ fortune, onReset }) => {
  if (!fortune) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex flex-col md:flex-row max-w-4xl w-full bg-[#Fdfbf7] rounded-xl overflow-hidden shadow-2xl border-4 border-[#8B0000]">
        
        {/* Left Side: The Stick (Visual) */}
        <div className="md:w-1/3 bg-[#f4e4bc] flex flex-col items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#8B0000] border-double">
            <div className="relative h-96 w-16 bg-gradient-to-r from-[#D2B48C] via-[#F4A460] to-[#D2B48C] shadow-xl border-x-2 border-[#8B4513] flex flex-col items-center justify-between py-4 rounded-sm transform hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full border-2 border-[#8B0000] flex items-center justify-center mb-2">
                     <span className="text-[#8B0000] font-serif font-bold">簽</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center py-4 writing-vertical-rl text-2xl font-bold text-[#500000] tracking-widest font-serif">
                    {fortune.title}
                </div>

                <div className="w-full flex justify-center mt-2 opacity-50">
                    <div className="w-8 h-1 bg-[#8B0000] rounded"></div>
                </div>
            </div>
        </div>

        {/* Right Side: The Interpretation */}
        <div className="md:w-2/3 p-8 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]">
            <h2 className="text-4xl font-serif font-bold text-[#8B0000] mb-6 text-center border-b-2 border-[#8B0000] pb-4">
                {fortune.title}
            </h2>

            {/* Poem Section */}
            <div className="flex-1 flex justify-center items-center mb-8">
                <div className="flex flex-row-reverse gap-8 font-serif text-2xl text-gray-800 leading-loose">
                    {fortune.poem.map((line, index) => (
                        <div key={index} className="writing-vertical-rl border-l border-gray-300 pl-2 h-48 flex items-center">
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Meaning Section */}
            <div className="mb-6 p-4 bg-[#fff8e1] rounded-lg border border-[#DAA520]">
                <h3 className="font-bold text-[#8B0000] mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#8B0000] rounded-full mr-2"></span>
                    聖意 (Meaning)
                </h3>
                <p className="text-gray-700 font-serif text-lg">{fortune.meaning}</p>
            </div>

             {/* Interpretation Section */}
             <div className="mb-8">
                <h3 className="font-bold text-[#8B0000] mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#8B0000] rounded-full mr-2"></span>
                    仙機 (Details)
                </h3>
                <p className="text-gray-700 font-serif text-lg leading-relaxed">
                    {fortune.interpretation}
                </p>
            </div>

            <button 
                onClick={onReset}
                className="w-full py-4 bg-[#8B0000] hover:bg-[#A52A2A] text-[#FFD700] font-bold text-xl rounded-lg shadow-lg transition-colors duration-200 border border-[#DAA520]"
            >
                誠心再求 (Draw Again)
            </button>
        </div>
      </div>
    </div>
  );
};
