import React from 'react';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div>
        <PixelCard variant="dark" className="w-full max-w-md flex flex-col items-center text-center p-8 border-4 border-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <i className="ra ra-skull text-6xl text-destructive mb-4 animate-pulse"></i>
          <h2 className="font-heading text-4xl text-destructive mb-2 text-shadow-pixel">YOU DIED</h2>
          <p className="font-body text-xl text-muted-foreground mb-8">胜败乃兵家常事，大侠请重新来过...</p>
          
          <PixelButton variant="destructive" onClick={onClose} className="w-full text-lg">
            重新挑战
          </PixelButton>
        </PixelCard>
      </div>
    </div>
  );
};