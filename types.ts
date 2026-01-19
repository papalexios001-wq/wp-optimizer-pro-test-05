// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v40.0 — ENTERPRISE SOTA TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 v40.0 ENHANCEMENTS:
// • Custom AI model input support for OpenRouter & Groq
// • Enhanced provider configuration types
// • Model validation types
// • Performance monitoring types
// • Request queue management types
// ═══════════════════════════════════════════════════════════════════════════════

export const APP_VERSION = "40.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 🤖 AI PROVIDER & MODEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProvider = 'google' | 'openrouter' | 'openai' | 'anthropic' | 'groq';

export interface AIModelConfig {
    id: string;
    name: string;
    provider: AIProvider;
    contextWindow: number;
    maxOutputTokens: number;
    costPer1kInput?: number;
    costPer1kOutput?: number;
    supportsVision?: boolean;
    supportsStreaming?: boolean;
    description?: string;
}

// Pre-configured models for each provider
export const OPENROUTER_MODELS: AIModelConfig[] = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter', contextWindow: 200000, maxOutputTokens: 8192 },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'openrouter', contextWindow: 200000, maxOutputTokens: 4096 },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openrouter', contextWindow: 128000, maxOutputTokens: 4096 },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openrouter', contextWindow: 128000, maxOutputTokens: 4096 },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'openrouter', contextWindow: 1000000, maxOutputTokens: 8192 },
    { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', provider: 'openrouter', contextWindow: 131072, maxOutputTokens: 4096 },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'openrouter', contextWindow: 131072, maxOutputTokens: 4096 },
    { id: 'mistralai/mixtral-8x22b-instruct', name: 'Mixtral 8x22B', provider: 'openrouter', contextWindow: 65536, maxOutputTokens: 4096 },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'openrouter', contextWindow: 128000, maxOutputTokens: 4096 },
    { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'openrouter', contextWindow: 131072, maxOutputTokens: 8192 },
];

export const GROQ_MODELS: AIModelConfig[] = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', provider: 'groq', contextWindow: 128000, maxOutputTokens: 32768 },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B Versatile', provider: 'groq', contextWindow: 131072, maxOutputTokens: 8192 },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', provider: 'groq', contextWindow: 131072, maxOutputTokens: 8192 },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', contextWindow: 32768, maxOutputTokens: 4096 },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'groq', contextWindow: 8192, maxOutputTokens: 4096 },
    { id: 'llama3-groq-70b-8192-tool-use-preview', name: 'Llama 3 70B Tool Use', provider: 'groq', contextWindow: 8192, maxOutputTokens: 4096 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentContract {
    title: string;
    metaDescription: string;
    slug: string;
    htmlContent: string;
    excerpt?: string;
    wordCount: number;
    faqs?: Array<{ question: string; answer: string }>;
    schema?: string;
    references?: ValidatedReference[];
}

export interface GenerateConfig {
    topic: string;
    provider: AIProvider;
    model: string;
    apiKeys: APIKeyConfig;
    internalLinks?: InternalLinkTarget[];
    neuronTerms?: NeuronTerm[];
    existingContent?: string;
    targetWordCount?: number;
    writingStyle?: string;
}

export interface APIKeyConfig {
    google?: string;
    openrouter?: string;
    openrouterModel?: string;
    openrouterCustomModel?: string;  // 🔥 NEW: User-defined custom model for OpenRouter
    openai?: string;
    anthropic?: string;
    groq?: string;
    groqModel?: string;
    groqCustomModel?: string;  // 🔥 NEW: User-defined custom model for Groq
    serper?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 PAGE & CRAWLING TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CrawledPage {
    id: string;
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    healthScore: number | null;
    wordCount: number;
    seoMetrics?: SeoMetrics;
    jobState?: JobState;
    opportunity?: OpportunityScore;
}

export interface SitemapPage extends CrawledPage {
    lastmod?: string;
    priority?: number;
    changefreq?: string;
}

export interface JobState {
    status: 'idle' | 'running' | 'completed' | 'failed';
    phase?: GodModePhase;
    progress?: number;
    startTime?: number;
    endTime?: number;
    error?: string;
}

export interface OpportunityScore {
    total: number;
    wordCountGap: number;
    competitorGap: number;
    seoScore: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 INTERNAL LINKING TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface InternalLinkTarget {
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    keywords?: string[];
    relevanceScore?: number;
}

export interface InternalLinkResult {
    url: string;
    anchorText: string;
    relevanceScore: number;
    position: number;
    context?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 SEO METRICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SeoMetrics {
    wordCount: number;
    contentDepth: number;
    readability: number;
    headingStructure: number;
    aeoScore: number;
    geoScore: number;
    eeatSignals: number;
    internalLinkScore: number;
    schemaDetected: boolean;
    schemaTypes?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 NLP & NEURON TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuronTerm {
    term: string;
    type: 'critical' | 'title' | 'header' | 'body';
    importance: number;
    recommended: number;
    current?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ QA VALIDATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface QAValidationResult {
    agent: string;
    category: 'critical' | 'seo' | 'aeo' | 'geo' | 'enhancement';
    status: 'passed' | 'failed' | 'warning';
    score: number;
    feedback: string;
    fixSuggestion?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 ENTITY GAP ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface EntityGapAnalysis {
    competitorEntities: string[];
    missingEntities: string[];
    topKeywords: string[];
    paaQuestions: string[];
    contentGaps: string[];
    avgWordCount: number;
    serpFeatures: SerpFeature[];
    competitorUrls: string[];
    competitors: CompetitorAnalysis[];
    recommendedWordCount: number;
    topicClusters: string[];
    semanticTerms: string[];
    validatedReferences: ValidatedReference[];
    knowledgeGraphData?: any;
    featuredSnippetOpportunity: boolean;
    localPackPresent: boolean;
}

export interface CompetitorAnalysis {
    url: string;
    title: string;
    wordCount: number;
    headings: string[];
    entities: string[];
    snippet?: string;
    position: number;
    domain?: string;
    hasSchema?: boolean;
    hasFAQ?: boolean;
}

export interface SerpFeature {
    type: string;
    present: boolean;
    targetable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 REFERENCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidatedReference {
    url: string;
    title: string;
    source: string;
    year?: string | number;
    status?: number;
    isValid?: boolean;
    domain?: string;
    isAuthority?: boolean;
    snippet?: string;
    author?: string;
    authorityScore?: number;
    favicon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel: string;
    channelUrl?: string;
    views: number;
    duration?: string;
    thumbnailUrl: string;
    embedUrl: string;
    publishedAt?: string;
    description?: string;
    relevanceScore: number;
}

export interface YouTubeSearchResult {
    video: YouTubeVideoData | null;
    source: string;
    alternates?: YouTubeVideoData[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 GOD MODE PHASES
// ═══════════════════════════════════════════════════════════════════════════════

export type GodModePhase =
    | 'idle'
    | 'initializing'
    | 'crawling'
    | 'resolving_post'
    | 'analyzing_existing'
    | 'collect_intel'
    | 'strategic_intel'
    | 'entity_gap_analysis'
    | 'reference_discovery'
    | 'reference_validation'
    | 'neuron_analysis'
    | 'competitor_deep_dive'
    | 'outline_generation'
    | 'section_drafts'
    | 'link_plan'
    | 'section_finalize'
    | 'merge_content'
    | 'prompt_assembly'
    | 'content_synthesis'
    | 'qa_validation'
    | 'auto_fix_loop'
    | 'self_improvement'
    | 'internal_linking'
    | 'schema_generation'
    | 'final_polish'
    | 'publishing'
    | 'completed'
    | 'failed'
    | 'youtube_integration';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 FAQ TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FAQItem {
    question: string;
    answer: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 BULK GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface BulkGenerationResult {
    url: string;
    success: boolean;
    postId?: number;
    error?: string;
    wordCount?: number;
    processingTime?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 API KEYS TYPE — ENHANCED WITH CUSTOM MODEL SUPPORT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiKeys {
    google?: string;
    openrouter?: string;
    openrouterModel?: string;
    openrouterCustomModel?: string;  // 🔥 NEW: Custom model ID (e.g., "anthropic/claude-3.5-sonnet-20241022")
    openai?: string;
    anthropic?: string;
    groq?: string;
    groqModel?: string;
    groqCustomModel?: string;  // 🔥 NEW: Custom model ID (e.g., "llama-3.3-70b-specdec")
    serper?: string;
    wordpress?: {
        siteUrl: string;
        username: string;
        applicationPassword: string;
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 GLOBAL STATS
// ═══════════════════════════════════════════════════════════════════════════════

export interface GlobalStats {
    totalPages: number;
    pagesOptimized: number;
    averageScore: number;
    totalWords: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎛️ AUTONOMOUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export interface AutonomousConfig {
    targetScore: number;
    maxConcurrent: number;
    autoPublish: boolean;
    publishStatus: 'draft' | 'publish';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 PERFORMANCE MONITORING TYPES (NEW)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PerformanceMetric {
    id: string;
    operation: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    success: boolean;
    error?: string;
    metadata?: Record<string, any>;
}

export interface PerformanceReport {
    totalOperations: number;
    successRate: number;
    averageDuration: number;
    p95Duration: number;
    p99Duration: number;
    errorsByType: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 REQUEST QUEUE TYPES (NEW)
// ═══════════════════════════════════════════════════════════════════════════════

export type RequestPriority = 'critical' | 'high' | 'medium' | 'low';

export interface QueuedRequest {
    id: string;
    operation: string;
    priority: RequestPriority;
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    retryCount: number;
    maxRetries: number;
    error?: string;
}

export interface RequestQueueStats {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    averageWaitTime: number;
    averageProcessTime: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧪 MODEL VALIDATION TYPES (NEW)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ModelValidationResult {
    isValid: boolean;
    modelId: string;
    provider: AIProvider;
    error?: string;
    suggestions?: string[];
}

export interface ModelTestResult {
    success: boolean;
    modelId: string;
    responseTime: number;
    error?: string;
    sampleOutput?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS FOR MODEL RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Resolves the actual model ID to use for OpenRouter
 * Priority: customModel > selectedModel > default
 */
export function resolveOpenRouterModel(apiKeys: ApiKeys): string {
    const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';
    
    // Custom model takes highest priority
    if (apiKeys.openrouterCustomModel?.trim()) {
        return apiKeys.openrouterCustomModel.trim();
    }
    
    // Then selected model from dropdown
    if (apiKeys.openrouterModel?.trim()) {
        return apiKeys.openrouterModel.trim();
    }
    
    return DEFAULT_MODEL;
}

/**
 * Resolves the actual model ID to use for Groq
 * Priority: customModel > selectedModel > default
 */
export function resolveGroqModel(apiKeys: ApiKeys): string {
    const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
    
    // Custom model takes highest priority
    if (apiKeys.groqCustomModel?.trim()) {
        return apiKeys.groqCustomModel.trim();
    }
    
    // Then selected model from dropdown
    if (apiKeys.groqModel?.trim()) {
        return apiKeys.groqModel.trim();
    }
    
    return DEFAULT_MODEL;
}

/**
 * Validates a custom model ID format
 */
export function validateCustomModelId(modelId: string, provider: AIProvider): ModelValidationResult {
    const trimmed = modelId.trim();
    
    if (!trimmed) {
        return { isValid: false, modelId: trimmed, provider, error: 'Model ID cannot be empty' };
    }
    
    if (provider === 'openrouter') {
        // OpenRouter models should contain a slash (provider/model)
        if (!trimmed.includes('/')) {
            return {
                isValid: false,
                modelId: trimmed,
                provider,
                error: 'OpenRouter model IDs should be in format: provider/model-name',
                suggestions: OPENROUTER_MODELS.map(m => m.id)
            };
        }
    }
    
    if (provider === 'groq') {
        // Groq models are typically alphanumeric with hyphens
        if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
            return {
                isValid: false,
                modelId: trimmed,
                provider,
                error: 'Groq model IDs should only contain letters, numbers, and hyphens',
                suggestions: GROQ_MODELS.map(m => m.id)
            };
        }
    }
    
    return { isValid: true, modelId: trimmed, provider };
}
