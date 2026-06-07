import React, { useState, useEffect } from 'react';
import { PixelCard } from '@/components/ui/PixelCard';
import { SpriteAnimator } from '@/components/ui/SpriteAnimator';

interface ArenaProps {
  playerHp: number;
  maxSteps: number;
  currentStep: number;
}

export const Arena: React.FC<ArenaProps> = ({ playerHp, maxSteps, currentStep }) => {
  const bossHpPercent = Math.max(0, 100 - (currentStep / maxSteps) * 100);
  
  const [playerHit, setPlayerHit] = useState(false);
  const [bossHit, setBossHit] = useState(false);

  // 监听血量变化，触发受击动画
  useEffect(() => {
    if (playerHp < 100) {
      setPlayerHit(true);
      const timer = setTimeout(() => setPlayerHit(false), 500);
      return () => clearTimeout(timer);
    }
  }, [playerHp]);

  useEffect(() => {
    if (bossHpPercent < 100) {
      setBossHit(true);
      const timer = setTimeout(() => setBossHit(false), 500);
      return () => clearTimeout(timer);
    }
  }, [bossHpPercent]);

  return (
    <PixelCard className="h-full relative overflow-hidden flex flex-col justify-between">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pixel-rendering opacity-60"
        style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
      />
      
      {/* Top Status Bars */}
      <div className="relative z-10 flex justify-between p-4 w-full">
        {/* Player HP */}
        <div className="flex flex-col gap-1 w-1/3">
          <span className="font-heading text-[10px] text-accent">英雄生命值</span>
          <div className="h-4 border-2 border-black bg-primary/80 overflow-hidden p-[2px]">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${playerHp}%` }} />
          </div>
        </div>
        
        {/* Monster HP */}
        <div className="flex flex-col gap-1 w-1/3 items-end">
          <span className="font-heading text-[10px] text-destructive">怪物生命值</span>
          <div className="h-4 border-2 border-black bg-primary/80 overflow-hidden p-[2px] w-full flex justify-end">
            <div className="h-full bg-destructive transition-all duration-300" style={{ width: `${bossHpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Battle Scene */}
      <div className="relative z-10 flex-1 flex items-end justify-between px-16 pb-8">
        {/* Player Sprite (Soldier) */}
        <div className="relative flex flex-col items-center justify-end w-1/3">
          {/* 
            Tiny RPG Character Asset Pack - Free Soldier
            Frame size: 100x100. Total 6 frames. 
          */}
          <SpriteAnimator 
            src="/assets/images/hero_idle.png"
            frameWidth={100}
            frameHeight={100}
            frameCount={6}
            fps={8}
            scale={3} // 增大比例，使角色显得更大
            isHit={playerHit}
          />
        </div>
        
        {/* Monster Sprite (Orc) */}
        <div className="relative flex flex-col items-center justify-end w-1/3">
          {bossHpPercent === 0 && (
            <div className="absolute inset-0 bg-red-500/50 mix-blend-color-burn animate-pulse z-20"></div>
          )}
          {/* 
            Tiny RPG Character Asset Pack - Free Orc
            Frame size: 100x100. Total 6 frames.
            flipX={true} 因为素材默认是朝右的，需要让它朝左面对英雄 
          */}
          <SpriteAnimator 
            src="/assets/images/goblin_idle.png"
            frameWidth={100}
            frameHeight={100}
            frameCount={6}
            fps={8}
            scale={3.2} // 怪物稍微比英雄大一点，更有压迫感
            flipX={true}
            isHit={bossHit}
            className={bossHpPercent === 0 ? 'opacity-0 transition-opacity duration-1000' : ''}
          />
        </div>
      </div>
    </PixelCard>
  );
};
