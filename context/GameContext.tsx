import React, { createContext, useContext, useState, ReactNode } from 'react';
import { categories, getRandomWord } from '@/data/categories';

export type Player = {
  id: number;
  name: string;
  isImpostor: boolean;
  word: string;
  votes: number;
  hasVoted: boolean;
  eliminated: boolean;
};

type GameState = {
  players: Player[];
  categoryIndex: number;
  secretWord: string;
  impostorHint: string;
  impostorId: number | null;
  phase: 'home' | 'setup' | 'roleReveal' | 'discussion' | 'voting' | 'results';
  discussionTime: number; // seconds
  currentRevealIndex: number;
  winner: 'impostor' | 'crew' | null;
};

type GameContextType = {
  state: GameState;
  addPlayer: (name: string) => void;
  removePlayer: (id: number) => void;
  setCategoryIndex: (index: number) => void;
  setDiscussionTime: (seconds: number) => void;
  startGame: () => void;
  nextReveal: () => boolean;
  castVote: (voterId: number, targetId: number) => void;
  calculateResults: () => 'impostor' | 'crew';
  resetGame: () => void;
  setPhase: (phase: GameState['phase']) => void;
};

const initialState: GameState = {
  players: [],
  categoryIndex: 0,
  secretWord: '',
  impostorHint: '',
  impostorId: null,
  phase: 'home',
  discussionTime: 120,
  currentRevealIndex: 0,
  winner: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const addPlayer = (name: string) => {
    setState((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: prev.players.length + 1,
          name,
          isImpostor: false,
          word: '',
          votes: 0,
          hasVoted: false,
          eliminated: false,
        },
      ],
    }));
  };

  const removePlayer = (id: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  };

  const setCategoryIndex = (index: number) => {
    setState((prev) => ({ ...prev, categoryIndex: index }));
  };

  const setDiscussionTime = (seconds: number) => {
    setState((prev) => ({ ...prev, discussionTime: seconds }));
  };

  const startGame = () => {
    const word = getRandomWord(state.categoryIndex);
    const impostorIndex = Math.floor(Math.random() * state.players.length);
    const category = categories[state.categoryIndex];

    // Pista para el impostor: categoría + primera letra + longitud
    const firstLetter = word.charAt(0).toUpperCase();
    const hint = `${category.emoji} ${category.name} · Empieza con "${firstLetter}" · ${word.length} letras`;

    const updatedPlayers = state.players.map((player, index) => ({
      ...player,
      isImpostor: index === impostorIndex,
      word: index === impostorIndex ? '???' : word,
      votes: 0,
      hasVoted: false,
      eliminated: false,
    }));

    setState((prev) => ({
      ...prev,
      players: updatedPlayers,
      secretWord: word,
      impostorHint: hint,
      impostorId: updatedPlayers[impostorIndex].id,
      phase: 'roleReveal',
      currentRevealIndex: 0,
      winner: null,
    }));
  };

  const nextReveal = (): boolean => {
    const next = state.currentRevealIndex + 1;
    if (next >= state.players.length) {
      return false; // All revealed
    }
    setState((prev) => ({ ...prev, currentRevealIndex: next }));
    return true;
  };

  const castVote = (voterId: number, targetId: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id === voterId) return { ...p, hasVoted: true };
        if (p.id === targetId) return { ...p, votes: p.votes + 1 };
        return p;
      }),
    }));
  };

  const calculateResults = (): 'impostor' | 'crew' => {
    const maxVotes = Math.max(...state.players.map((p) => p.votes));
    const mostVoted = state.players.filter((p) => p.votes === maxVotes);

    // If the most-voted player is the impostor, crew wins
    const crewWins = mostVoted.some((p) => p.isImpostor);
    const winner = crewWins ? 'crew' : 'impostor';

    setState((prev) => ({ ...prev, winner, phase: 'results' }));
    return winner;
  };

  const resetGame = () => {
    setState(initialState);
  };

  const setPhase = (phase: GameState['phase']) => {
    setState((prev) => ({ ...prev, phase }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        addPlayer,
        removePlayer,
        setCategoryIndex,
        setDiscussionTime,
        startGame,
        nextReveal,
        castVote,
        calculateResults,
        resetGame,
        setPhase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
