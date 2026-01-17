// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — UNIFIED TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const APP_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 🔑 API KEY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface APIKeyConfig {
    google?: string;
    openrouter?: string;
    openrouterModel?: string;
    openai?: string;
    anthropic?: string;
    groq?: string;
    groqModel?: string;
    serper?: string;
}

export interface ApiKeys extends APIKeyConfig {}

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 CONTENT CONTRACT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentContract {
    title: string;
    metaDescription: string;
    slug: string;
    htmlContent: string;
    excerpt: string;
    wordCount: number;
    faqs?: FAQItem[];
    tableOfContents?: TOCItem[];
    schema?: SchemaMarkup;
    references?: ValidatedReference[];
    internalLinks?: InternalLinkResult[];
    youtubeVideo?: YouTubeVideoData;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export interface SchemaMarkup {
    article?: object;
    faq?: object;
    howTo?: object;
    video?: object;
    breadcrumb?: object;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚙️ GENERATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface GenerateConfig {
    topic: string;
    provider: 'google' | 'openrouter' | 'openai' | 'anthropic' | 'groq';
    model: string;
    apiKeys: APIKeyConfig;
    internalLinks?: InternalLinkTarget[];
    existingContent?: string;
    targetWordCount?: number;
    tone?: 'professional' | 'conversational' | 'technical' | 'casual';
    includeYouTube?: boolean;
    includeReferences?: boolean;
    includeFAQs?: boolean;
    neuronTerms?: NeuronTerm[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 INTERNAL LINKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface InternalLinkTarget {
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    relevanceScore?: number;
    keywords?: string[];
}

export interface InternalLinkResult {
    url: string;
    anchorText: string;
    relevanceScore: number;
    position: number;
    context?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🕷️ CRAWLED PAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CrawledPage {
    url: string;
    title: string;
    slug: string;
    excerpt?: string;
    categories?: string[];
    wordCount?: number;
    lastModified?: string;
    healthScore?: number | null;
    seoMetrics?: SeoMetrics;
    jobState?: JobState;
    opportunity?: OpportunityScore;
    id?: string;
}

export interface SitemapPage extends CrawledPage {
    id: string;
}

export interface JobState {
    status: 'idle' | 'running' | 'completed' | 'failed';
    phase?: GodModePhase;
    progress?: number;
    message?: string;
    startTime?: number;
    endTime?: number;
    error?: string;
}

export interface OpportunityScore {
    total: number;
    seo: number;
    content: number;
    technical: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 SEO METRICS
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
    h1Count?: number;
    h2Count?: number;
    h3Count?: number;
    imageCount?: number;
    imagesWithAlt?: number;
    externalLinks?: number;
    internalLinks?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ QA VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface QAValidationResult {
    agent: string;
    category: 'critical' | 'seo' | 'aeo' | 'geo' | 'enhancement';
    status: 'passed' | 'failed' | 'warning';
    score: number;
    feedback: string;
    fixSuggestion?: string;
    autoFixable?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 ENTITY GAP ANALYSIS
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
    knowledgeGraphData?: object;
    featuredSnippetOpportunity?: boolean;
    localPackPresent?: boolean;
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
    content?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 VALIDATED REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidatedReference {
    url: string;
    title: string;
    source: string;
    year?: string | number;
    snippet?: string;
    status?: number;
    isValid?: boolean;
    domain?: string;
    isAuthority?: boolean;
    authorityScore?: number;
    favicon?: string;
    author?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel: string;
    views: number;
    duration?: string;
    thumbnailUrl: string;
    embedUrl: string;
    publishedAt?: string;
    relevanceScore?: number;
    description?: string;
}

export interface YouTubeSearchResult {
    video: YouTubeVideoData | null;
    source: 'serper' | 'fallback';
    searchQuery: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NEURON NLP TERMS
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuronTerm {
    term: string;
    type: 'title' | 'header' | 'basic' | 'extended';
    recommended: number;
    importance?: number;
    category?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🤖 GOD MODE PHASES
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
    | 'failed';

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 BULK GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface BulkGenerationResult {
    url: string;
    status: 'success' | 'failed' | 'skipped';
    postId?: number;
    newUrl?: string;
    wordCount?: number;
    error?: string;
    duration?: number;
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
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    APP_VERSION
};
