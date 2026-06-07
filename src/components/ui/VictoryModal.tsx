import React from 'react';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';

interface VictoryModalProps {
  isOpen: boolean;
  monsterName: string;
  expEarned: number;
  goldEarned: number;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ 
  isOpen, 
  monsterName, 
  expEarned, 
  goldEarned, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="animate-bounce-short">
        <PixelCard variant="dark" className="w-full max-w-md flex flex-col items-center text-center p-8 border-4 border-warning shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <i className="ra ra-trophy text-6xl text-warning mb-4 animate-pulse"></i>
          <h2 className="font-heading text-4xl text-warning mb-2 text-shadow-pixel">战斗胜利！</h2>
          <p className="font-body text-xl text-muted-foreground mb-8">你成功斩杀了 <span className="text-white">{monsterName}</span></p>

          <div className="flex flex-col gap-4 w-full px-4 md:px-8 mb-8">
            <div className="flex justify-between items-center bg-background/50 p-4 border-2 border-black">
              <span className="font-heading text-blue-400 flex items-center gap-3">
                <i className="ra ra-crystal-wand text-2xl"></i> 获得经验
              </span>
              <span className="font-heading text-xl text-white">+{expEarned}</span>
            </div>
            <div className="flex justify-between items-center bg-background/50 p-4 border-2 border-black">
              <span className="font-heading text-warning flex items-center gap-3">
                <i className="ra ra-gold-bar text-2xl"></i> 获得金币
              </span>
              <span className="font-heading text-xl text-white">+{goldEarned}</span>
            </div>
          </div>

          <PixelButton variant="warning" onClick={onClose} className="w-full text-lg">
            继续冒险
          </PixelButton>
        </PixelCard>
      </div>
    </div>
  );
};