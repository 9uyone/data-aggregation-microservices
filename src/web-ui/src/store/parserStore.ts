import { create } from 'zustand';

export interface Parser {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  isActive: boolean;
  lastRunAt?: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ParserRun {
  id: string;
  parserId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  itemsCollected: number;
  errorMessage?: string;
}

interface ParserState {
  // State
  parsers: Parser[];
  selectedParser: Parser | null;
  parserRuns: ParserRun[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setParsers: (parsers: Parser[]) => void;
  addParser: (parser: Parser) => void;
  updateParser: (id: string, updates: Partial<Parser>) => void;
  removeParser: (id: string) => void;
  setSelectedParser: (parser: Parser | null) => void;
  setParserRuns: (runs: ParserRun[]) => void;
  addParserRun: (run: ParserRun) => void;
  updateParserRun: (id: string, updates: Partial<ParserRun>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useParserStore = create<ParserState>()((set) => ({
  // Initial state
  parsers: [],
  selectedParser: null,
  parserRuns: [],
  isLoading: false,
  error: null,

  // Actions
  setParsers: (parsers) =>
    set({
      parsers,
    }),

  addParser: (parser) =>
    set((state) => ({
      parsers: [...state.parsers, parser],
    })),

  updateParser: (id, updates) =>
    set((state) => ({
      parsers: state.parsers.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  removeParser: (id) =>
    set((state) => ({
      parsers: state.parsers.filter((p) => p.id !== id),
    })),

  setSelectedParser: (parser) =>
    set({
      selectedParser: parser,
    }),

  setParserRuns: (runs) =>
    set({
      parserRuns: runs,
    }),

  addParserRun: (run) =>
    set((state) => ({
      parserRuns: [run, ...state.parserRuns],
    })),

  updateParserRun: (id, updates) =>
    set((state) => ({
      parserRuns: state.parserRuns.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearError: () =>
    set({
      error: null,
    }),
}));
