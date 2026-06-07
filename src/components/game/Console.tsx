import React, { useState, useEffect } from 'react';
import { PixelCard } from '@/components/ui/PixelCard';
import { PixelButton } from '@/components/ui/PixelButton';

interface Option {
  id: string;
  text: string;
  is_correct: boolean;
  damage: number;
  feedback: string;
}

interface Step {
  step_id: number;
  description: string;
  question: string;
  options: Option[];
}

interface ConsoleProps {
  step: Step;
  onSelectOption: (isCorrect: boolean, feedback: string) => void;
}

export const Console: React.FC<ConsoleProps> = ({ step, onSelectOption }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const text = step.description + " " + step.question;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [step]);

  return (
    <PixelCard variant="dialog" className="h-full flex flex-col justify-between border-t-0 md:border-t-3">
      {/* Dialog Text */}
      <div className="flex-1 mb-4 overflow-y-auto">
        <p className="font-body text-xl md:text-2xl leading-relaxed whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse inline-block w-3 h-5 bg-foreground ml-1 align-middle" />
        </p>
      </div>

      {/* Action Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {step.options.map((option) => (
          <PixelButton 
            key={option.id}
            onClick={() => onSelectOption(option.is_correct, option.feedback)}
            className="w-full font-code text-sm normal-case py-6 flex items-center justify-start px-8 gap-4"
          >
            <i className="ra ra-sword text-xl opacity-50 group-hover:opacity-100 group-hover:text-accent transition-opacity"></i>
            <span className="text-warning font-heading">[{option.id}]</span>
            <span className="flex-1 text-left">{option.text}</span>
          </PixelButton>
        ))}
      </div>
    </PixelCard>
  );
};
