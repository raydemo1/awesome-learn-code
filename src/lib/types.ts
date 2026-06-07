export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface HistoryItem {
  id: string;
  date: string;
  problem: string;
  boss: string;
  result: 'victory' | 'defeat';
}

export interface UserStats {
  exp: number;
  maxExp: number;
  level: number;
  solvedCount: number;
  gold: number;
  history: HistoryItem[];
  achievements: Achievement[];
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', icon: 'ra-sword', title: '初出茅庐', description: '击败第一只魔物', unlocked: false },
  { id: '2', icon: 'ra-dragon', title: '屠龙勇士', description: '累计击败5只魔物', unlocked: false },
  { id: '3', icon: 'ra-scroll-unfurled', title: '算法学徒', description: '累计击败10只魔物', unlocked: false },
  { id: '4', icon: 'ra-gem-pendant', title: '完美无瑕', description: '满血通关一次', unlocked: false },
  { id: '5', icon: 'ra-bone-bite', title: '百折不挠', description: '累计阵亡3次', unlocked: false },
  { id: '6', icon: 'ra-crown-coin', title: '大富翁', description: '累计获得200金币', unlocked: false },
];
