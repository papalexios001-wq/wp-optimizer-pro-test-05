// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — ZUSTAND STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
    SitemapPage,
    NeuronTerm,
    Toast,
    GodModePhase,
    QAValidationResult,
    EntityGapAnalysis,
    ContentContract
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 STORE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface AutonomousConfig {
    targetScore: number;
    maxConcurrent: number;
    autoPublish: boolean;
    preserveSlug: boolean;
    preserveFeaturedImage: boolean;
}

export interface GlobalStats {
    totalProcessed: number;
    totalSuccess: number;
    totalFailed: number;
    avgScore: number;
    totalWords: number;
}

interface AppState {
    // Pages
    pages: SitemapPage[];
    setPages: (pages: SitemapPage[]) => void;
    updatePage: (id: string, updates: Partial<SitemapPage>) => void;
    addPage: (page: SitemapPage) => void;
    removePage: (id: string) => void;
    clearPages: () => void;

    // Selected Page
    selectedPageId: string | null;
    setSelectedPageId: (id: string | null) => void;

    // NeuronWriter Terms
    neuronTerms: NeuronTerm[];
    setNeuronTerms: (terms: NeuronTerm[]) => void;
    clearNeuronTerms: () => void;

    // God Mode Log
    godModeLog: string[];
    addGodLog: (msg: string) => void;
    clearGodLog: () => void;

    // Current Phase
    currentPhase: GodModePhase;
    setCurrentPhase: (phase: GodModePhase) => void;

    // Processing
    isProcessing: boolean;
    setIsProcessing: (value: boolean) => void;

    // Autonomous Config
    autonomousConfig: AutonomousConfig;
    setAutonomousConfig: (config: Partial<AutonomousConfig>) => void;

    // Global Stats
    globalStats: GlobalStats;
    updateGlobalStats: (stats: Partial<GlobalStats>) => void;

    // Toasts
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // QA Results
    qaResults: QAValidationResult[];
    setQAResults: (results: QAValidationResult[]) => void;
    clearQAResults: () => void;

    // Entity Gap
    entityGapData: EntityGapAnalysis | null;
    setEntityGapData: (data: EntityGapAnalysis | null) => void;

    // Generated Content
    generatedContent: ContentContract | null;
    setGeneratedContent: (content: ContentContract | null) => void;

    // Reset
    resetAll: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏪 ZUSTAND STORE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
    pages: [],
    selectedPageId: null,
    neuronTerms: [],
    godModeLog: [],
    currentPhase: 'idle' as GodModePhase,
    isProcessing: false,
    autonomousConfig: {
        targetScore: 85,
        maxConcurrent: 1,
        autoPublish: false,
        preserveSlug: true,
        preserveFeaturedImage: true,
    },
    globalStats: {
        totalProcessed: 0,
        totalSuccess: 0,
        totalFailed: 0,
        avgScore: 0,
        totalWords: 0,
    },
    toasts: [],
    qaResults: [],
    entityGapData: null,
    generatedContent: null,
};

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Pages
                setPages: (pages) => set({ pages }),
                updatePage: (id, updates) => set((state) => ({
                    pages: state.pages.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),
                addPage: (page) => set((state) => ({
                    pages: [...state.pages, page],
                })),
                removePage: (id) => set((state) => ({
                    pages: state.pages.filter((p) => p.id !== id),
                })),
                clearPages: () => set({ pages: [] }),

                // Selected Page
                setSelectedPageId: (id) => set({ selectedPageId: id }),

                // NeuronWriter Terms
                setNeuronTerms: (terms) => set({ neuronTerms: terms }),
                clearNeuronTerms: () => set({ neuronTerms: [] }),

                // God Mode Log
                addGodLog: (msg) => set((state) => ({
                    godModeLog: [...state.godModeLog.slice(-500), msg],
                })),
                clearGodLog: () => set({ godModeLog: [] }),

                // Current Phase
                setCurrentPhase: (phase) => set({ currentPhase: phase }),

                // Processing
                setIsProcessing: (value) => set({ isProcessing: value }),

                // Autonomous Config
                setAutonomousConfig: (config) => set((state) => ({
                    autonomousConfig: { ...state.autonomousConfig, ...config },
                })),

                // Global Stats
                updateGlobalStats: (stats) => set((state) => ({
                    globalStats: { ...state.globalStats, ...stats },
                })),

                // Toasts
                addToast: (toast) => {
                    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    set((state) => ({
                        toasts: [...state.toasts, { ...toast, id }],
                    }));
                    // Auto-remove after duration
                    setTimeout(() => {
                        get().removeToast(id);
                    }, toast.duration || 4000);
                },
                removeToast: (id) => set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                })),
                clearToasts: () => set({ toasts: [] }),

                // QA Results
                setQAResults: (results) => set({ qaResults: results }),
                clearQAResults: () => set({ qaResults: [] }),

                // Entity Gap
                setEntityGapData: (data) => set({ entityGapData: data }),

                // Generated Content
                setGeneratedContent: (content) => set({ generatedContent: content }),

                // Reset
                resetAll: () => set(initialState),
            }),
            {
                name: 'wpo-storage',
                partialize: (state) => ({
                    autonomousConfig: state.autonomousConfig,
                    neuronTerms: state.neuronTerms,
                }),
            }
        ),
        { name: 'WPO-Store' }
    )
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 HELPER HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export const useSelectedPage = () => {
    const pages = useAppStore((state) => state.pages);
    const selectedPageId = useAppStore((state) => state.selectedPageId);
    return pages.find((p) => p.id === selectedPageId) || null;
};

export const usePagesByStatus = (status: 'idle' | 'running' | 'completed' | 'failed') => {
    const pages = useAppStore((state) => state.pages);
    return pages.filter((p) => p.jobState?.status === status);
};

export const usePagesAtTarget = () => {
    const pages = useAppStore((state) => state.pages);
    const targetScore = useAppStore((state) => state.autonomousConfig.targetScore);
    return pages.filter((p) => (p.healthScore || 0) >= targetScore);
};

export default useAppStore;
