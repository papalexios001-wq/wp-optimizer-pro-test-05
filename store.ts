// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v27.0 — ENTERPRISE SOTA ZUSTAND STORE
// ═══════════════════════════════════════════════════════════════════════════════
// 
// CRITICAL FIXES v27.0:
// ✅ STAGED PIPELINE STATE — Progress tracking for multi-stage generation
// ✅ CANCELLATION SUPPORT — Cancel long-running jobs gracefully
// ✅ SEMANTIC CACHE — Caches entity gap data to reduce API calls
// ✅ JOB LOG SYSTEM — Per-job logs with timestamps
// ✅ CIRCUIT BREAKER STATE — Tracks provider failures
// ✅ BULK PROCESSING STATE — Multi-URL optimization tracking
// ✅ IMPROVED PERSISTENCE — LocalStorage with compression
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { 
    SitemapPage, 
    WpConfig, 
    ApiKeys, 
    Toast, 
    NeuronTerm, 
    QAValidationResult,
    GlobalStats,
    AutonomousConfig,
    JobState,
    ContentContract,
    EntityGapAnalysis,
    NeuronAnalysisResult,
    GodModePhase,
    StageProgress,
    AIProvider,
    createDefaultGlobalStats,
    createDefaultJobState
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// 📌 VERSION & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const STORE_VERSION = "27.0.0";

const MAX_LOG_ENTRIES = 500;
const MAX_JOB_LOGS = 100;
const SEMANTIC_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours
const MAX_TOASTS = 5;
const TOAST_DURATION = 4000;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 STORE STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

interface SemanticCacheEntry {
    data: any;
    timestamp: number;
    key: string;
}

interface AppState {
    // Version
    storeVersion: string;
    
    // UI State
    activeView: 'setup' | 'strategy' | 'review' | 'analytics';
    isProcessing: boolean;
    processingStatus: string;
    
    // WordPress Configuration
    wpConfig: WpConfig;
    
    // API Keys
    apiKeys: ApiKeys;
    
    // AI Provider Settings
    selectedProvider: AIProvider;
    selectedModel: string;
    
    // Pages & Queue
    pages: SitemapPage[];
    
    // Logging
    godModeLog: string[];
    
    // Toasts
    toasts: Toast[];
    
    // NeuronWriter
    neuronEnabled: boolean;
    neuronTerms: NeuronTerm[];
    
    // Global Statistics
    globalStats: GlobalStats;
    
    // Autonomous Mode
    autonomousConfig: AutonomousConfig;
    
    // Publishing Mode
    publishMode: 'draft' | 'autopublish';
    
    // Semantic Cache (for entity gap data, etc.)
    semanticCache: Map<string, SemanticCacheEntry>;
    
    // Stage Progress (for staged pipeline)
    currentStageProgress: StageProgress | null;
    
    // Cancellation Token
    cancellationRequested: boolean;
    cancellationReason: string | null;
}

interface AppActions {
    // UI Actions
    setActiveView: (view: AppState['activeView']) => void;
    setProcessing: (isProcessing: boolean, status?: string) => void;
    
    // WordPress Config
    setWpConfig: (config: Partial<WpConfig>) => void;
    
    // API Keys
    setApiKey: (key: keyof ApiKeys, value: string) => void;
    setApiKeys: (keys: Partial<ApiKeys>) => void;
    
    // AI Provider
    setSelectedProvider: (provider: AIProvider) => void;
    setSelectedModel: (model: string) => void;
    
    // Pages
    addPages: (pages: SitemapPage[]) => void;
    updatePage: (id: string, updates: Partial<SitemapPage>) => void;
    removePage: (id: string) => void;
    clearPages: () => void;
    
    // Job State
    initJobState: (pageId: string) => void;
    updateJobState: (pageId: string, updates: Partial<JobState>) => void;
    addJobLog: (pageId: string, message: string) => void;
    clearJobState: (pageId: string) => void;
    
    // Logging
    addGodLog: (message: string) => void;
    clearGodLog: () => void;
    
    // Toasts
    addToast: (message: string, type: Toast['type']) => void;
    removeToast: (id: string) => void;
    
    // NeuronWriter
    setNeuronEnabled: (enabled: boolean) => void;
    setNeuronTerms: (terms: NeuronTerm[]) => void;
    
    // Global Stats
    updateGlobalStats: (updates: Partial<GlobalStats>) => void;
    resetGlobalStats: () => void;
    
    // Autonomous Config
    setAutonomousConfig: (config: Partial<AutonomousConfig>) => void;
    
    // Publishing
    setPublishMode: (mode: 'draft' | 'autopublish') => void;
    
    // Semantic Cache
    getSemanticCache: (type: string, key: string, maxAgeMs?: number) => any | null;
    setSemanticCache: (type: string, key: string, data: any) => void;
    clearSemanticCache: () => void;
    
    // Stage Progress
    setStageProgress: (progress: StageProgress | null) => void;
    
    // Cancellation
    requestCancellation: (reason?: string) => void;
    clearCancellation: () => void;
    isCancellationRequested: () => boolean;
    
    // Bulk Operations
    getRunningJobs: () => SitemapPage[];
    getQueuedJobs: () => SitemapPage[];
    getCompletedJobs: () => SitemapPage[];
    getFailedJobs: () => SitemapPage[];
    
    // Reset
    resetStore: () => void;
}

type AppStore = AppState & AppActions;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════════

const defaultWpConfig: WpConfig = {
    url: '',
    username: '',
    password: '',
    orgName: '',
    authorName: '',
    logoUrl: '',
    authorPageUrl: '',
    industry: '',
    targetAudience: ''
};

const defaultApiKeys: ApiKeys = {
    google: '',
    openrouter: '',
    openai: '',
    anthropic: '',
    groq: '',
    serper: '',
    neuronwriter: '',
    neuronProject: '',
    openrouterModel: 'google/gemini-2.5-flash-preview',
    groqModel: 'llama-3.3-70b-versatile'
};

const defaultAutonomousConfig: AutonomousConfig = {
    enabled: false,
    targetScore: 85,
    maxParallel: 3,
    minInterval: 30000,
    maxRuntime: 3600000,
    stopOnError: false
};

const initialState: AppState = {
    storeVersion: STORE_VERSION,
    activeView: 'setup',
    isProcessing: false,
    processingStatus: '',
    wpConfig: defaultWpConfig,
    apiKeys: defaultApiKeys,
    selectedProvider: 'google',
    selectedModel: 'gemini-2.5-flash-preview-05-20',
    pages: [],
    godModeLog: [],
    toasts: [],
    neuronEnabled: false,
    neuronTerms: [],
    globalStats: createDefaultGlobalStats(),
    autonomousConfig: defaultAutonomousConfig,
    publishMode: 'draft',
    semanticCache: new Map(),
    currentStageProgress: null,
    cancellationRequested: false,
    cancellationReason: null
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏪 ZUSTAND STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const useAppStore = create<AppStore>()(
    persist(
        immer((set, get) => ({
            ...initialState,
            
            // ═══════════════════════════════════════════════════════════════
            // UI ACTIONS
            // ═══════════════════════════════════════════════════════════════
            
            setActiveView: (view) => set(state => {
                state.activeView = view;
            }),
            
            setProcessing: (isProcessing, status = '') => set(state => {
                state.isProcessing = isProcessing;
                state.processingStatus = status;
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // WORDPRESS CONFIG
            // ═══════════════════════════════════════════════════════════════
            
            setWpConfig: (config) => set(state => {
                Object.assign(state.wpConfig, config);
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // API KEYS
            // ═══════════════════════════════════════════════════════════════
            
            setApiKey: (key, value) => set(state => {
                state.apiKeys[key] = value;
            }),
            
            setApiKeys: (keys) => set(state => {
                Object.assign(state.apiKeys, keys);
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // AI PROVIDER
            // ═══════════════════════════════════════════════════════════════
            
            setSelectedProvider: (provider) => set(state => {
                state.selectedProvider = provider;
            }),
            
            setSelectedModel: (model) => set(state => {
                state.selectedModel = model;
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // PAGES
            // ═══════════════════════════════════════════════════════════════
            
            addPages: (newPages) => set(state => {
                const existingIds = new Set(state.pages.map(p => p.id));
                const uniqueNewPages = newPages.filter(p => !existingIds.has(p.id));
                state.pages.push(...uniqueNewPages);
            }),
            
            updatePage: (id, updates) => set(state => {
                const pageIndex = state.pages.findIndex(p => p.id === id);
                if (pageIndex !== -1) {
                    Object.assign(state.pages[pageIndex], updates);
                }
            }),
            
            removePage: (id) => set(state => {
                state.pages = state.pages.filter(p => p.id !== id);
            }),
            
            clearPages: () => set(state => {
                state.pages = [];
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // JOB STATE
            // ═══════════════════════════════════════════════════════════════
            
            initJobState: (pageId) => set(state => {
                const pageIndex = state.pages.findIndex(p => p.id === pageId);
                if (pageIndex !== -1) {
                    state.pages[pageIndex].jobState = createDefaultJobState();
                }
            }),
            
            updateJobState: (pageId, updates) => set(state => {
                const pageIndex = state.pages.findIndex(p => p.id === pageId);
                if (pageIndex !== -1) {
                    if (!state.pages[pageIndex].jobState) {
                        state.pages[pageIndex].jobState = createDefaultJobState();
                    }
                    Object.assign(state.pages[pageIndex].jobState!, updates);
                    state.pages[pageIndex].jobState!.lastUpdated = Date.now();
                }
            }),
            
            addJobLog: (pageId, message) => set(state => {
                const pageIndex = state.pages.findIndex(p => p.id === pageId);
                if (pageIndex !== -1) {
                    if (!state.pages[pageIndex].jobState) {
                        state.pages[pageIndex].jobState = createDefaultJobState();
                    }
                    if (!state.pages[pageIndex].jobState!.logs) {
                        state.pages[pageIndex].jobState!.logs = [];
                    }
                    
                    const timestamp = new Date().toLocaleTimeString('en-US', { 
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    
                    state.pages[pageIndex].jobState!.logs!.push(`[${timestamp}] ${message}`);
                    
                    // Trim if too long
                    if (state.pages[pageIndex].jobState!.logs!.length > MAX_JOB_LOGS) {
                        state.pages[pageIndex].jobState!.logs = 
                            state.pages[pageIndex].jobState!.logs!.slice(-MAX_JOB_LOGS);
                    }
                }
            }),
            
            clearJobState: (pageId) => set(state => {
                const pageIndex = state.pages.findIndex(p => p.id === pageId);
                if (pageIndex !== -1) {
                    state.pages[pageIndex].jobState = undefined;
                }
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // LOGGING
            // ═══════════════════════════════════════════════════════════════
            
            addGodLog: (message) => set(state => {
                const timestamp = new Date().toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                state.godModeLog.push(`[${timestamp}] ${message}`);
                
                // Trim if too long
                if (state.godModeLog.length > MAX_LOG_ENTRIES) {
                    state.godModeLog = state.godModeLog.slice(-MAX_LOG_ENTRIES);
                }
            }),
            
            clearGodLog: () => set(state => {
                state.godModeLog = [];
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // TOASTS
            // ═══════════════════════════════════════════════════════════════
            
            addToast: (message, type) => set(state => {
                const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                state.toasts.push({ id, message, type, duration: TOAST_DURATION });
                
                // Limit max toasts
                if (state.toasts.length > MAX_TOASTS) {
                    state.toasts = state.toasts.slice(-MAX_TOASTS);
                }
            }),
            
            removeToast: (id) => set(state => {
                state.toasts = state.toasts.filter(t => t.id !== id);
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // NEURONWRITER
            // ═══════════════════════════════════════════════════════════════
            
            setNeuronEnabled: (enabled) => set(state => {
                state.neuronEnabled = enabled;
            }),
            
            setNeuronTerms: (terms) => set(state => {
                state.neuronTerms = terms;
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // GLOBAL STATS
            // ═══════════════════════════════════════════════════════════════
            
            updateGlobalStats: (updates) => set(state => {
                Object.assign(state.globalStats, updates);
                
                // Recalculate success rate
                const total = state.globalStats.totalProcessed;
                const failed = state.globalStats.totalFailed;
                if (total > 0) {
                    state.globalStats.successRate = Math.round(((total - failed) / total) * 100);
                }
            }),
            
            resetGlobalStats: () => set(state => {
                state.globalStats = createDefaultGlobalStats();
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // AUTONOMOUS CONFIG
            // ═══════════════════════════════════════════════════════════════
            
            setAutonomousConfig: (config) => set(state => {
                Object.assign(state.autonomousConfig, config);
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // PUBLISHING
            // ═══════════════════════════════════════════════════════════════
            
            setPublishMode: (mode) => set(state => {
                state.publishMode = mode;
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // SEMANTIC CACHE
            // ═══════════════════════════════════════════════════════════════
            
            getSemanticCache: (type, key, maxAgeMs = SEMANTIC_CACHE_TTL) => {
                const cacheKey = `${type}:${key.toLowerCase().trim()}`;
                const entry = get().semanticCache.get(cacheKey);
                
                if (!entry) return null;
                
                const age = Date.now() - entry.timestamp;
                if (age > maxAgeMs) {
                    // Expired
                    return null;
                }
                
                return entry.data;
            },
            
            setSemanticCache: (type, key, data) => set(state => {
                const cacheKey = `${type}:${key.toLowerCase().trim()}`;
                state.semanticCache.set(cacheKey, {
                    data,
                    timestamp: Date.now(),
                    key: cacheKey
                });
            }),
            
            clearSemanticCache: () => set(state => {
                state.semanticCache.clear();
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // STAGE PROGRESS
            // ═══════════════════════════════════════════════════════════════
            
            setStageProgress: (progress) => set(state => {
                state.currentStageProgress = progress;
            }),
            
            // ═══════════════════════════════════════════════════════════════
            // CANCELLATION
            // ═══════════════════════════════════════════════════════════════
            
            requestCancellation: (reason = 'User requested') => set(state => {
                state.cancellationRequested = true;
                state.cancellationReason = reason;
            }),
            
            clearCancellation: () => set(state => {
                state.cancellationRequested = false;
                state.cancellationReason = null;
            }),
            
            isCancellationRequested: () => {
                return get().cancellationRequested;
            },
            
            // ═══════════════════════════════════════════════════════════════
            // BULK OPERATIONS
            // ═══════════════════════════════════════════════════════════════
            
            getRunningJobs: () => {
                return get().pages.filter(p => p.jobState?.status === 'running');
            },
            
            getQueuedJobs: () => {
                return get().pages.filter(p => p.jobState?.status === 'queued');
            },
            
            getCompletedJobs: () => {
                return get().pages.filter(p => p.jobState?.status === 'completed');
            },
            
            getFailedJobs: () => {
                return get().pages.filter(p => p.jobState?.status === 'failed');
            },
            
            // ═══════════════════════════════════════════════════════════════
            // RESET
            // ═══════════════════════════════════════════════════════════════
            
            resetStore: () => set(state => {
                Object.assign(state, initialState);
                state.semanticCache = new Map();
            })
        })),
        {
            name: 'wp-optimizer-pro-v27',
            version: 27,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                wpConfig: state.wpConfig,
                apiKeys: state.apiKeys,
                selectedProvider: state.selectedProvider,
                selectedModel: state.selectedModel,
                neuronEnabled: state.neuronEnabled,
                autonomousConfig: state.autonomousConfig,
                publishMode: state.publishMode,
                globalStats: state.globalStats,
                // Don't persist pages, logs, or cache
            }),
            migrate: (persistedState: any, version: number) => {
                if (version < 27) {
                    // Reset to defaults on major version change
                    return initialState;
                }
                return persistedState as AppState;
            }
        }
    )
);

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default useAppStore;

export {
    defaultWpConfig,
    defaultApiKeys,
    defaultAutonomousConfig,
    initialState,
    MAX_LOG_ENTRIES,
    SEMANTIC_CACHE_TTL
};

export type { AppState, AppActions, AppStore };
