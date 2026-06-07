import React from 'react';
import { PixelCard } from '@/components/ui/PixelCard';
import { UserStats } from '@/lib/types';

interface ProfileProps {
  stats: UserStats;
}

export const Profile: React.FC<ProfileProps> = ({ stats }) => {
  const { exp, maxExp, level, solvedCount, gold, history, achievements } = stats;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 h-full overflow-y-auto custom-scrollbar pb-20">
      {/* 左侧：个人信息 & 数据统计 */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <PixelCard variant="dark" className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[url('/assets/images/background.jpg')] bg-cover bg-center opacity-20 pixel-rendering"></div>
          
          <h2 className="font-heading text-xl text-accent mb-6 z-10 flex items-center gap-2">
            <i className="ra ra-helmet"></i>
            勇者档案
          </h2>
          
          <div className="w-32 h-32 bg-secondary border-4 border-black shadow-pixel-sm mb-4 relative z-10 flex items-center justify-center overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=HeroKnight" 
              alt="RPG Avatar" 
              className="w-full h-full pixel-rendering object-cover"
            />
          </div>
          
          <h3 className="font-heading text-lg text-white z-10 mb-2">Pixel Hero</h3>
          <p className="font-body text-muted-foreground z-10 text-xl mb-4 flex items-center gap-2">
            <i className="ra ra-crossed-swords"></i> Lv. {level} 算法剑士
          </p>
          
          {/* 经验条 */}
          <div className="w-full z-10">
            <div className="flex justify-between text-xs font-heading mb-1 text-white">
              <span>EXP</span>
              <span>{exp} / {maxExp}</span>
            </div>
            <div className="h-4 border-2 border-black bg-primary/80 overflow-hidden p-[2px]">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.min(100, (exp / maxExp) * 100)}%` }} />
            </div>
          </div>
        </PixelCard>

        <PixelCard variant="default" className="p-6">
          <h3 className="font-heading text-md mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
            <i className="ra ra-bar-chart"></i> 数据统计
          </h3>
          <div className="flex flex-col gap-4 font-body text-xl">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><i className="ra ra-scroll-unfurled"></i> 斩杀魔物 (解题)</span>
              <span className="text-accent font-bold">{solvedCount} 只</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><i className="ra ra-gold-bar text-warning"></i> 累计财富</span>
              <span className="text-warning font-bold">{gold} G</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><i className="ra ra-swords text-destructive"></i> 胜率</span>
              <span className="text-white font-bold">85%</span>
            </div>
          </div>
        </PixelCard>
      </div>

      {/* 右侧：成就系统 & 历史记录 */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        {/* 成就系统 */}
        <PixelCard variant="dark" className="p-6 flex-1">
          <h3 className="font-heading text-md text-warning mb-4 flex items-center gap-2 border-b-2 border-black/50 pb-2">
            <i className="ra ra-trophy"></i> 荣誉勋章 (成就)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div key={ach.id} className={`border-2 border-black p-3 flex flex-col items-center text-center gap-2 transition-all ${ach.unlocked ? 'bg-secondary' : 'bg-secondary/30 opacity-60 grayscale'}`}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 border-black ${ach.unlocked ? 'bg-accent/20 text-accent' : 'bg-primary text-muted-foreground'}`}>
                  <i className={`ra ${ach.icon} text-2xl`}></i>
                </div>
                <h4 className="font-heading text-xs mt-1 text-white">{ach.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{ach.description}</p>
              </div>
            ))}
          </div>
        </PixelCard>

        {/* 历史记录 */}
        <PixelCard variant="default" className="p-6 flex-1">
          <h3 className="font-heading text-md mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
            <i className="ra ra-hourglass"></i> 战斗编年史 (历史)
          </h3>
          <div className="flex flex-col gap-3">
            {history.length === 0 && (
              <div className="text-center text-muted-foreground py-8 font-body text-lg">
                暂无战斗记录，快去挑战魔物吧！
              </div>
            )}
            {history.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border-2 border-black bg-background/50 hover:bg-secondary transition-colors cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-xs text-white">{item.problem}</span>
                  <span className="font-body text-sm text-muted-foreground">{item.date} · 对战 {item.boss}</span>
                </div>
                <div className="flex items-center">
                  {item.result === 'victory' ? (
                    <span className="text-accent font-heading text-xs flex items-center gap-1">
                      <i className="ra ra-laurel"></i> 胜利
                    </span>
                  ) : (
                    <span className="text-destructive font-heading text-xs flex items-center gap-1">
                      <i className="ra ra-skull"></i> 阵亡
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};