// Local Storage Persistence Utility

const STORAGE_KEY = 'metal_nonmetal_challenge_data';

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'Marie Curie', score: 280, level: 'All Levels', date: '2026-06-01' },
  { rank: 2, name: 'Albert Einstein', score: 260, level: 'All Levels', date: '2026-06-02' },
  { rank: 3, name: 'Nikola Tesla', score: 250, level: 'All Levels', date: '2026-06-03' },
  { rank: 4, name: 'Ada Lovelace', score: 220, level: 'Level 3 Completed', date: '2026-06-04' },
  { rank: 5, name: 'Isaac Newton', score: 190, level: 'Level 2 Completed', date: '2026-06-04' },
  { rank: 6, name: 'Rosalind Franklin', score: 160, level: 'Level 2 Completed', date: '2026-06-04' },
  { rank: 7, name: 'Stephen Hawking', score: 130, level: 'Level 1 Completed', date: '2026-06-04' },
  { rank: 8, name: 'Dmitri Mendeleev', score: 110, level: 'Level 1 Completed', date: '2026-06-04' },
  { rank: 9, name: 'Jane Goodall', score: 90, level: 'Level 1 Completed', date: '2026-06-04' },
  { rank: 10, name: 'Galileo Galilei', score: 80, level: 'Level 1 Completed', date: '2026-06-04' }
];

const INITIAL_STATE = {
  playerName: '',
  playerAvatar: 'chemist', // chemist, physicist, astronaut, robot
  completedLevels: [], // 1, 2, 3
  scores: {
    level1: 0,
    level2: 0,
    level3: 0
  },
  accuracy: {
    level1: 0,
    level2: 0,
    level3: 0
  },
  times: {
    level1: null,
    level2: null,
    level3: null
  },
  unlockedAchievements: [], // 'metal_master', 'non_metal_ninja', etc.
  leaderboard: DEFAULT_LEADERBOARD,
  soundMuted: false,
  darkMode: true
};

export const getGameState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveGameState(INITIAL_STATE);
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(data);
    // Fill in missing default values in case structure updates
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.error('Error loading game state:', e);
    return INITIAL_STATE;
  }
};

export const saveGameState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
};

export const resetGameState = () => {
  const resetState = {
    ...INITIAL_STATE,
    leaderboard: getGameState().leaderboard // Keep the leaderboard intact
  };
  saveGameState(resetState);
  return resetState;
};

export const addLeaderboardEntry = (name, score, level) => {
  const state = getGameState();
  const newEntry = {
    name: name || 'Anonymous Student',
    score: score,
    level: level,
    date: new Date().toISOString().split('T')[0]
  };

  const list = [...state.leaderboard, newEntry];
  // Sort descending by score
  list.sort((a, b) => b.score - a.score);
  
  // Prune to top 10
  const prunedList = list.slice(0, 10).map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  const updatedState = { ...state, leaderboard: prunedList };
  saveGameState(updatedState);
  return updatedState;
};
