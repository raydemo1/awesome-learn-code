import React, { useState } from 'react';
import { Arena } from '@/components/game/Arena';
import { Visualizer } from '@/components/game/Visualizer';
import { Console } from '@/components/game/Console';
import { UploadModal } from '@/components/ui/UploadModal';
import { PixelButton } from '@/components/ui/PixelButton';
import { VictoryModal } from '@/components/ui/VictoryModal';
import { GameOverModal } from '@/components/ui/GameOverModal';
import { MOCK_LEVEL_DATA } from '@/lib/levelData';
import { UserStats, Achievement, INITIAL_ACHIEVEMENTS } from '@/lib/types';

import { Profile } from '@/components/profile/Profile';

export default function GamePage() {
  const [currentView, setCurrentView] = useState<'game' | 'profile'>('game');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 使用状态保存当前关卡数据，默认使用 Mock 数据
  const [levelData, setLevelData] = useState(MOCK_LEVEL_DATA);
  const [playerHp, setPlayerHp] = useState(100);

  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [rewards, setRewards] = useState({ exp: 0, gold: 0 });

  // 全局用户数据状态
  const [userStats, setUserStats] = useState<UserStats>({
    exp: 0,
    maxExp: 1000,
    level: 1,
    solvedCount: 0,
    gold: 0,
    history: [],
    achievements: INITIAL_ACHIEVEMENTS
  });

  // 新成就解锁提示
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const handleOptionSelect = (isCorrect: boolean, feedbackMsg: string) => {
    setFeedback(feedbackMsg);
    
    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        if (currentStep < levelData.total_steps - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          // 触发胜利结算弹窗，随机给点奖励数值
          const expEarned = Math.floor(Math.random() * 50) + 100;
          const goldEarned = Math.floor(Math.random() * 30) + 20;
          setRewards({ exp: expEarned, gold: goldEarned });
          setShowVictory(true);

          // 更新全局状态与成就
          setUserStats(prev => {
            let newExp = prev.exp + expEarned;
            let newLevel = prev.level;
            let newMaxExp = prev.maxExp;
            
            if (newExp >= newMaxExp) {
              newLevel += 1;
              newExp -= newMaxExp;
              newMaxExp = Math.floor(newMaxExp * 1.5);
            }
            
            const newGold = prev.gold + goldEarned;
            const newSolvedCount = prev.solvedCount + 1;
            const newHistory = [{
              id: Date.now().toString(),
              date: new Date().toLocaleDateString(),
              problem: '算法题挑战', 
              boss: levelData.monster_name,
              result: 'victory' as const
            }, ...prev.history];

            const newAchievements = [...prev.achievements];
            let newlyUnlocked: Achievement | null = null;

            if (newSolvedCount === 1 && !newAchievements[0].unlocked) {
              newAchievements[0].unlocked = true; newlyUnlocked = newAchievements[0];
            } else if (newSolvedCount === 5 && !newAchievements[1].unlocked) {
              newAchievements[1].unlocked = true; newlyUnlocked = newAchievements[1];
            } else if (newSolvedCount === 10 && !newAchievements[2].unlocked) {
              newAchievements[2].unlocked = true; newlyUnlocked = newAchievements[2];
            } else if (playerHp === 100 && !newAchievements[3].unlocked) {
              newAchievements[3].unlocked = true; newlyUnlocked = newAchievements[3];
            } else if (newGold >= 200 && !newAchievements[5].unlocked) {
              newAchievements[5].unlocked = true; newlyUnlocked = newAchievements[5];
            }

            if (newlyUnlocked) {
              setTimeout(() => {
                setNewAchievement(newlyUnlocked);
                setTimeout(() => setNewAchievement(null), 4000);
              }, 1000);
            }

            return {
              ...prev,
              exp: newExp,
              maxExp: newMaxExp,
              level: newLevel,
              gold: newGold,
              solvedCount: newSolvedCount,
              history: newHistory,
              achievements: newAchievements
            };
          });
        }
      }, 2000);
    } else {
      // 答错扣血
      setPlayerHp(prev => Math.max(0, prev - 20));
      setTimeout(() => setFeedback(null), 3000);
      
      if (playerHp - 20 <= 0) {
        setTimeout(() => {
          // 触发失败结算弹窗
          setShowGameOver(true);

          setUserStats(prev => {
            const newHistory = [{
              id: Date.now().toString(),
              date: new Date().toLocaleDateString(),
              problem: '算法题挑战',
              boss: levelData.monster_name,
              result: 'defeat' as const
            }, ...prev.history];

            const deathCount = newHistory.filter(h => h.result === 'defeat').length;
            const newAchievements = [...prev.achievements];
            let newlyUnlocked = null;

            if (deathCount === 3 && !newAchievements[4].unlocked) {
              newAchievements[4].unlocked = true;
              newlyUnlocked = newAchievements[4];
            }

            if (newlyUnlocked) {
              setTimeout(() => {
                setNewAchievement(newlyUnlocked);
                setTimeout(() => setNewAchievement(null), 4000);
              }, 1000);
            }

            return { ...prev, history: newHistory, achievements: newAchievements };
          });
        }, 500);
      }
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setPlayerHp(100);
    setShowVictory(false);
    setShowGameOver(false);
  };

  const handleGenerateLevel = async (problemText: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem_text: problemText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate level');
      }
      
      const newLevelData = await response.json();
      setLevelData(newLevelData);
      setCurrentStep(0);
      setPlayerHp(100);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error generating level:", error);
      alert("生成关卡失败，请检查后端服务是否启动，或者 API Key 是否有效。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col p-2 md:p-6 overflow-hidden">
      {/* Header with RPG Awesome Icons */}
      <header className="flex justify-between items-center mb-4 px-4 font-heading text-xs md:text-sm">
        <h1 className="text-warning text-shadow-pixel flex items-center gap-2">
          <i className="ra ra-dragon text-xl"></i>
          {currentView === 'game' ? `当前关卡: ${levelData.monster_name}` : '勇者档案 (主页)'}
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-foreground flex items-center gap-2 hidden md:flex">
            <i className="ra ra-crystal-wand text-lg text-blue-400"></i>
            经验: {userStats.exp}
          </span>
          <span className="text-warning flex items-center gap-2 hidden md:flex">
            <i className="ra ra-gold-bar text-lg text-warning"></i>
            金币: {userStats.gold}
          </span>
          
          <div className="flex gap-2 ml-2 md:ml-4">
            {currentView === 'game' ? (
              <PixelButton 
                variant="default" 
                size="sm" 
                onClick={() => setCurrentView('profile')}
                className="flex items-center gap-2"
              >
                <i className="ra ra-player"></i>
                档案
              </PixelButton>
            ) : (
              <PixelButton 
                variant="default" 
                size="sm" 
                onClick={() => setCurrentView('game')}
                className="flex items-center gap-2"
              >
                <i className="ra ra-crossed-swords"></i>
                战斗
              </PixelButton>
            )}

            <PixelButton 
              variant="accent" 
              size="sm" 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <i className="ra ra-book"></i>
              新挑战
            </PixelButton>
          </div>
        </div>
      </header>

      {/* Dynamic View Rendering */}
      {currentView === 'profile' ? (
        <Profile stats={userStats} />
      ) : (
        <div className="flex-1 flex flex-col justify-center gap-4 max-w-7xl mx-auto w-full">
          
          {/* Top Area: Split Screen */}
          <div className="flex flex-col md:flex-row gap-4 h-[35vh] md:h-[45vh] shrink-0">
            {/* Left: Combat Arena */}
            <div className="w-full md:w-1/2 h-full">
              <Arena playerHp={playerHp} maxSteps={levelData.total_steps} currentStep={currentStep} />
            </div>
            
            {/* Right: Data Visualizer */}
            <div className="w-full md:w-1/2 h-full">
              <Visualizer currentState={levelData.steps[currentStep].visual_state} />
            </div>
          </div>

          {/* Bottom Area: Console / Dialog */}
          <div className="flex-1 relative min-h-[30vh]">
            {feedback ? (
              // Feedback Overlay
              <div className={`absolute inset-0 z-20 border-3 border-black shadow-pixel p-6 flex items-center justify-center text-center ${
                feedback.includes('正确') ? 'bg-accent text-black' : 'bg-destructive text-foreground'
              }`}>
                <h2 className="font-body text-3xl md:text-4xl">{feedback}</h2>
              </div>
            ) : null}
            
            <Console step={levelData.steps[currentStep]} onSelectOption={handleOptionSelect} />
          </div>
        </div>
      )}

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleGenerateLevel}
        isLoading={isGenerating}
      />

      <VictoryModal 
        isOpen={showVictory}
        monsterName={levelData.monster_name}
        expEarned={rewards.exp}
        goldEarned={rewards.gold}
        onClose={resetGame}
      />

      <GameOverModal 
        isOpen={showGameOver}
        onClose={resetGame}
      />

      {/* Achievement Unlock Toast */}
      {newAchievement && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce-short">
          <div className="bg-secondary border-4 border-warning shadow-[0_0_15px_rgba(255,215,0,0.5)] p-4 flex items-center gap-4 min-w-[250px]">
            <div className="w-12 h-12 bg-warning/20 border-2 border-warning flex items-center justify-center rounded-full text-warning">
              <i className={`ra ${newAchievement.icon} text-2xl animate-pulse`}></i>
            </div>
            <div>
              <p className="font-heading text-xs text-warning mb-1">成就解锁！</p>
              <p className="font-heading text-sm text-white">{newAchievement.title}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
