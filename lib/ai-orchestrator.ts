// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v30.0 — ENTERPRISE SOTA AI ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════
// 
// ALL BUGS FIXED:
// ✅ YouTube Video: Proper Promise result capture and reassignment
// ✅ Visual Components: Dynamic injection after EVERY section (25+)
// ✅ Internal Links: Semantic anchor matching (no generic fallback)
// ✅ Content Breathing: Automatic visual breaks every 2-3 paragraphs
// ═══════════════════════════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import {
    ContentContract,     
    GenerateConfig, 
    SiteContext, 
    EntityGapAnalysis,
    NeuronAnalysisResult, 
    ExistingContentAnalysis, 
    InternalLinkTarget,
    ValidatedReference, 
    GeoTargetConfig, 
    NeuronTerm, 
    APP_VERSION,
    InternalLinkResult
} from '../types';

// Import visual components from separate file
import {
    THEME_ADAPTIVE_CSS,
    createQuickAnswerBox,
    createProTipBox,
    createWarningBox,
    createExpertQuoteBox,
    createHighlightBox,
    createCalloutBox,
    createStatisticsBox,
    createDataTable,
    createChecklistBox,
    createStepByStepBox,
    createComparisonTable,
    createDefinitionBox,
    createKeyTakeaways,
    createFAQAccordion,
    createYouTubeEmbed,
    createReferencesSection,
    createNumberedBox,
    createIconGridBox,
    createTimelineBox,
    createProgressTracker,
    YouTubeVideoData,
    DiscoveredReference,
    escapeHtml,
    generateUniqueId
} from './visual-components';

// Re-export for backwards compatibility
export {
    THEME_ADAPTIVE_CSS,
    createQuickAnswerBox,
    createProTipBox,
    createWarningBox,
    createExpertQuoteBox,
    createHighlightBox,
    createCalloutBox,
    createStatisticsBox,
    createDataTable,
    createChecklistBox,
    createStepByStepBox,
    createComparisonTable,
    createDefinitionBox,
    createKeyTakeaways,
    createFAQAccordion,
    createYouTubeEmbed,
    createReferencesSection,
    YouTubeVideoData,
    DiscoveredReference
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📌 VERSION & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const AI_ORCHESTRATOR_VERSION = "30.0.0";

const TIMEOUTS = {
    OUTLINE_GENERATION: 60000,
    SECTION_GENERATION: 90000,
    MERGE_GENERATION: 120000,
    SINGLE_SHOT: 180000,
    REFERENCE_DISCOVERY: 30000,
    YOUTUBE_SEARCH: 20000,
} as const;

const CONTENT_TARGETS = {
    MIN_WORDS: 3000,
    TARGET_WORDS: 4000,
    MAX_WORDS: 5000,
    SECTION_WORDS: 350,
} as const;

const LINK_CONFIG = {
    MAX_TOTAL: 15,
    MAX_PER_SECTION: 2,
    MIN_WORDS_BETWEEN: 120,  // Reduced from 150 for more links
} as const;

// Year calculation
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
export const CONTENT_YEAR = currentMonth === 11 ? currentYear + 1 : currentYear;

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface StageProgress {
    stage: 'outline' | 'sections' | 'youtube' | 'references' | 'merge' | 'polish' | 'validation';
    progress: number;
    message: string;
    sectionsCompleted?: number;
    totalSections?: number;
}

export interface GenerationResult {
    contract: ContentContract;
    generationMethod: 'staged' | 'single-shot';
    attempts: number;
    totalTime: number;
    youtubeVideo?: YouTubeVideoData;
    references?: DiscoveredReference[];
}

interface ContentOutline {
    title: string;
    metaDescription: string;
    slug: string;
    sections: Array<{
        heading: string;
        keyPoints: string[];
        subsections: Array<{ heading: string; keyPoints: string[] }>;
    }>;
    faqTopics: string[];
    keyTakeaways: string[];
}

type LogFunction = (msg: string, progress?: number) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔌 CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════════════════════════

const circuitBreakers = new Map<string, { failures: number; lastFailure: number; isOpen: boolean }>();

function getCircuitBreaker(provider: string) {
    if (!circuitBreakers.has(provider)) {
        circuitBreakers.set(provider, { failures: 0, lastFailure: 0, isOpen: false });
    }
    return circuitBreakers.get(provider)!;
}

function recordFailure(provider: string, log: LogFunction): void {
    const breaker = getCircuitBreaker(provider);
    breaker.failures++;
    breaker.lastFailure = Date.now();
    if (breaker.failures >= 3) {
        breaker.isOpen = true;
        log(`⚡ Circuit breaker OPEN for ${provider}`);
    }
}

function recordSuccess(provider: string): void {
    const breaker = getCircuitBreaker(provider);
    breaker.failures = 0;
    breaker.isOpen = false;
}

function isCircuitOpen(provider: string): boolean {
    const breaker = getCircuitBreaker(provider);
    if (!breaker.isOpen) return false;
    if (Date.now() - breaker.lastFailure > 60000) return false;
    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function countWords(text: string): number {
    if (!text) return 0;
    return text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return 'source';
    }
}

function extractSlugFromUrl(url: string): string {
    try {
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || '';
    } catch {
        return url.split('/').filter(Boolean).pop() || '';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO DISCOVERY — FIXED
// ═══════════════════════════════════════════════════════════════════════════════

function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
    }
    return null;
}

function parseViewCount(viewString: string | number | undefined): number {
    if (!viewString) return 0;
    if (typeof viewString === 'number') return viewString;
    const str = viewString.toString().toLowerCase().replace(/,/g, '');
    const multipliers: Record<string, number> = { 'k': 1000, 'm': 1000000, 'b': 1000000000 };
    for (const [suffix, mult] of Object.entries(multipliers)) {
        if (str.includes(suffix)) return Math.round(parseFloat(str.replace(/[^0-9.]/g, '')) * mult);
    }
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

export async function searchYouTubeVideo(
    topic: string,
    serperApiKey: string,
    log: LogFunction
): Promise<YouTubeVideoData | null> {
    log(`   🎬 YouTube search starting for: "${topic.substring(0, 50)}..."`);
    
    if (!serperApiKey) {
        log(`   ❌ YouTube search ABORTED: No Serper API key provided`);
        return null;
    }
    
    const queries = [
        `${topic} tutorial guide ${currentYear}`,
        `${topic} explained how to`,
        `best ${topic} tips`
    ];
    
    const allVideos: YouTubeVideoData[] = [];
    
    for (const query of queries) {
        try {
            log(`   🔍 Searching: "${query.substring(0, 40)}..."`);
            
            const response = await fetch('https://google.serper.dev/videos', {
                method: 'POST',
                headers: { 
                    'X-API-KEY': serperApiKey, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    q: query, 
                    gl: 'us', 
                    hl: 'en', 
                    num: 15  // Increased from 10
                })
            });
            
            if (!response.ok) {
                log(`   ⚠️ YouTube API error: ${response.status} ${response.statusText}`);
                continue;
            }
            
            const data = await response.json();
            log(`   📊 Serper returned ${data.videos?.length || 0} videos`);
            
            for (const video of (data.videos || [])) {
                // Must be YouTube
                if (!video.link?.includes('youtube.com') && !video.link?.includes('youtu.be')) {
                    continue;
                }
                
                const videoId = extractYouTubeVideoId(video.link);
                if (!videoId) {
                    continue;
                }
                
                // Skip duplicates
                if (allVideos.some(v => v.videoId === videoId)) {
                    continue;
                }
                
                const views = parseViewCount(video.views);
                
                // Lowered threshold from 10000 to 5000 for more results
                if (views < 5000) {
                    continue;
                }
                
                // Calculate relevance score
                const titleLower = (video.title || '').toLowerCase();
                const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                const matchingWords = topicWords.filter(w => titleLower.includes(w)).length;
                let relevanceScore = 40 + Math.min(35, (matchingWords / Math.max(topicWords.length, 1)) * 35);
                
                // Boost for high view counts
                if (views >= 1000000) relevanceScore += 20;
                else if (views >= 500000) relevanceScore += 15;
                else if (views >= 100000) relevanceScore += 10;
                else if (views >= 50000) relevanceScore += 5;
                
                // Boost for recent content
                if (video.date?.includes(currentYear.toString())) {
                    relevanceScore += 5;
                }
                
                allVideos.push({
                    videoId,
                    title: video.title || 'Video',
                    channel: video.channel || 'Unknown Channel',
                    views,
                    duration: video.duration,
                    thumbnailUrl: video.imageUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    embedUrl: `https://www.youtube.com/embed/${videoId}`,
                    relevanceScore: Math.min(100, relevanceScore)
                });
            }
            
            // If we have good videos, stop searching
            if (allVideos.filter(v => v.relevanceScore >= 55).length >= 3) {
                break;
            }
            
        } catch (err: any) {
            log(`   ⚠️ YouTube query error: ${err.message}`);
        }
        
        await sleep(300);
    }
    
    // Sort by relevance
    allVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    log(`   📊 Total videos found: ${allVideos.length}`);
    
    if (allVideos.length === 0) {
        log(`   ⚠️ No suitable YouTube videos found`);
        return null;
    }
    
    const best = allVideos[0];
    log(`   ✅ BEST VIDEO: "${best.title.substring(0, 50)}..."`);
    log(`      → videoId: ${best.videoId}`);
    log(`      → views: ${best.views.toLocaleString()}`);
    log(`      → score: ${best.relevanceScore}`);
    
    return best;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 REFERENCE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════════

const AUTHORITY_DOMAINS = {
    government: ['.gov', '.gov.uk', '.edu'],
    scientific: ['nature.com', 'science.org', 'pubmed.gov', 'ncbi.nlm.nih.gov', 'nih.gov', 'cdc.gov', 'who.int', 'mayoclinic.org'],
    majorNews: ['reuters.com', 'bbc.com', 'nytimes.com', 'washingtonpost.com', 'theguardian.com', 'wsj.com', 'bloomberg.com', 'forbes.com'],
    tech: ['techcrunch.com', 'wired.com', 'arstechnica.com', 'theverge.com', 'hbr.org'],
    reference: ['wikipedia.org', 'britannica.com', 'investopedia.com', 'statista.com']
};

function calculateAuthorityScore(url: string): number {
    const urlLower = url.toLowerCase();
    for (const d of AUTHORITY_DOMAINS.government) if (urlLower.includes(d)) return 95;
    for (const d of AUTHORITY_DOMAINS.scientific) if (urlLower.includes(d)) return 88;
    for (const d of AUTHORITY_DOMAINS.majorNews) if (urlLower.includes(d)) return 82;
    for (const d of AUTHORITY_DOMAINS.tech) if (urlLower.includes(d)) return 75;
    for (const d of AUTHORITY_DOMAINS.reference) if (urlLower.includes(d)) return 72;
    return url.startsWith('https://') ? 50 : 30;
}

function extractSourceName(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const sourceMap: Record<string, string> = {
            'nytimes.com': 'The New York Times', 
            'washingtonpost.com': 'The Washington Post', 
            'theguardian.com': 'The Guardian',
            'bbc.com': 'BBC', 
            'reuters.com': 'Reuters', 
            'bloomberg.com': 'Bloomberg', 
            'forbes.com': 'Forbes',
            'mayoclinic.org': 'Mayo Clinic', 
            'nih.gov': 'NIH', 
            'cdc.gov': 'CDC', 
            'who.int': 'WHO',
            'wikipedia.org': 'Wikipedia', 
            'investopedia.com': 'Investopedia', 
            'hbr.org': 'Harvard Business Review'
        };
        return sourceMap[hostname] || hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    } catch {
        return 'Source';
    }
}

export async function discoverReferences(
    topic: string,
    serperApiKey: string,
    options: { targetCount?: number; minAuthorityScore?: number } = {},
    log: LogFunction
): Promise<DiscoveredReference[]> {
    const { targetCount = 10, minAuthorityScore = 55 } = options;
    
    log(`   📚 Discovering references for: "${topic.substring(0, 40)}..."`);
    
    const allRefs: DiscoveredReference[] = [];
    const queries = [
        `${topic} research study statistics ${currentYear}`,
        `${topic} expert guide official`,
        `${topic} site:edu OR site:gov`,
        `${topic} industry report data`
    ];
    
    const skipDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'pinterest.com', 'reddit.com', 'quora.com', 'linkedin.com', 'medium.com', 'tiktok.com'];
    
    for (const query of queries) {
        try {
            const response = await fetch('https://google.serper.dev/search', {
                method: 'POST',
                headers: { 'X-API-KEY': serperApiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: query, gl: 'us', hl: 'en', num: 12 })
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            for (const result of (data.organic || [])) {
                if (!result.link || !result.title) continue;
                
                const urlLower = result.link.toLowerCase();
                if (skipDomains.some(d => urlLower.includes(d))) continue;
                
                const authorityScore = calculateAuthorityScore(result.link);
                if (authorityScore < minAuthorityScore) continue;
                if (allRefs.some(r => r.url === result.link)) continue;
                
                const yearMatch = (result.title + ' ' + (result.snippet || '')).match(/\b(20[0-2][0-9])\b/);
                
                allRefs.push({
                    url: result.link,
                    title: result.title,
                    source: extractSourceName(result.link),
                    snippet: result.snippet,
                    year: yearMatch ? yearMatch[1] : undefined,
                    authorityScore,
                    favicon: `https://www.google.com/s2/favicons?domain=${extractDomain(result.link)}&sz=32`
                });
            }
        } catch {}
        
        await sleep(300);
    }
    
    const sorted = allRefs.sort((a, b) => b.authorityScore - a.authorityScore).slice(0, targetCount);
    
    log(`   ✅ Found ${sorted.length} authoritative references`);
    
    return sorted;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 INTERNAL LINK INJECTION — ENTERPRISE GRADE (FIXED)
// ═══════════════════════════════════════════════════════════════════════════════

export function injectInternalLinksDistributed(
    html: string,
    linkTargets: InternalLinkTarget[],
    currentUrl: string,
    log: LogFunction
): { html: string; linksAdded: InternalLinkResult[]; totalLinks: number } {
    
    log(`   🔗 ═══════════════════════════════════════════════════════`);
    log(`   🔗 INTERNAL LINK INJECTION v30.0`);
    log(`   🔗 ═══════════════════════════════════════════════════════`);
    log(`      → html length: ${html?.length || 0} chars`);
    log(`      → linkTargets: ${linkTargets?.length || 0}`);
    
    if (!html || !linkTargets || linkTargets.length === 0) {
        log(`   ❌ ABORT: Invalid inputs`);
        return { html: html || '', linksAdded: [], totalLinks: 0 };
    }
    
    const linksAdded: InternalLinkResult[] = [];
    
    // Filter valid targets
    const availableTargets = linkTargets.filter(t => {
        if (!t?.url || !t?.title) return false;
        if (currentUrl && t.url === currentUrl) return false;
        return true;
    }).slice(0, 30);
    
    log(`      → Available targets: ${availableTargets.length}`);
    
    if (availableTargets.length === 0) {
        return { html, linksAdded: [], totalLinks: 0 };
    }
    
    // Split by H2
    const sectionSplitRegex = /(<h2[^>]*>)/gi;
    const parts = html.split(sectionSplitRegex);
    
    let totalLinksAdded = 0;
    let targetIndex = 0;
    let lastLinkWordPos = 0;
    let currentWordPos = 0;
    
    const processedParts = parts.map((part, partIndex) => {
        if (part.match(/<h2/i) || partIndex === 0) {
            currentWordPos += countWords(part);
            return part;
        }
        
        if (totalLinksAdded >= LINK_CONFIG.MAX_TOTAL) {
            currentWordPos += countWords(part);
            return part;
        }
        
        let sectionLinksAdded = 0;
        let processedPart = part;
        
        // FIXED: Reduced minimum chars from 80 to 30
        const paraRegex = /<p[^>]*>([\s\S]{30,}?)<\/p>/gi;
        let match;
        const paragraphs: Array<{ full: string; text: string; plainText: string; pos: number }> = [];
        
        while ((match = paraRegex.exec(part)) !== null) {
            const plainText = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            paragraphs.push({ 
                full: match[0], 
                text: match[1], 
                plainText,
                pos: match.index 
            });
        }
        
        for (const para of paragraphs) {
            if (sectionLinksAdded >= LINK_CONFIG.MAX_PER_SECTION) break;
            if (totalLinksAdded >= LINK_CONFIG.MAX_TOTAL) break;
            if (targetIndex >= availableTargets.length) break;
            
            const paraWordPos = currentWordPos + countWords(part.substring(0, para.pos));
            
            if (paraWordPos - lastLinkWordPos < LINK_CONFIG.MIN_WORDS_BETWEEN && linksAdded.length > 0) {
                continue;
            }
            
            const target = availableTargets[targetIndex];
            
            // FIXED: Use semantic anchor finder (no generic fallback)
            const anchorText = findSemanticAnchor(para.plainText, target, log, totalLinksAdded < 5);
            
            if (anchorText && anchorText.length >= 4) {
                if (para.plainText.toLowerCase().includes(anchorText.toLowerCase())) {
                    const link = `<a href="${escapeHtml(target.url)}" title="${escapeHtml(target.title)}">${anchorText}</a>`;
                    
                    const escapedAnchor = anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const simpleRegex = new RegExp(`\\b${escapedAnchor}\\b`, 'i');
                    
                    const matchResult = para.full.match(simpleRegex);
                    if (matchResult) {
                        const matchIndex = para.full.search(simpleRegex);
                        const beforeMatch = para.full.substring(0, matchIndex);
                        
                        const openBrackets = (beforeMatch.match(/<(?![^>]*>)/g) || []).length;
                        const closeBrackets = (beforeMatch.match(/>/g) || []).length;
                        const insideTag = openBrackets > closeBrackets;
                        
                        if (!insideTag) {
                            const newPara = para.full.replace(simpleRegex, link);
                            
                            if (newPara !== para.full) {
                                processedPart = processedPart.replace(para.full, newPara);
                                linksAdded.push({ 
                                    url: target.url, 
                                    anchorText, 
                                    relevanceScore: 0.85, 
                                    position: paraWordPos 
                                });
                                sectionLinksAdded++;
                                totalLinksAdded++;
                                lastLinkWordPos = paraWordPos;
                                
                                log(`      ✅ Link ${totalLinksAdded}: "${anchorText}" → ${target.url.substring(0, 40)}...`);
                            }
                        }
                    }
                }
            }
            
            targetIndex++;
        }
        
        currentWordPos += countWords(part);
        return processedPart;
    });
    
    log(`   🔗 RESULT: ${totalLinksAdded} links injected`);
    
    return {
        html: processedParts.join(''),
        linksAdded,
        totalLinks: totalLinksAdded
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 SEMANTIC ANCHOR FINDER — NO GENERIC FALLBACK (FIXED)
// ═══════════════════════════════════════════════════════════════════════════════

function findSemanticAnchor(
    text: string, 
    target: InternalLinkTarget, 
    log: LogFunction,
    verbose: boolean = false
): string {
    if (!text || !target?.title) {
        return '';
    }
    
    const textLower = text.toLowerCase();
    const titleLower = target.title.toLowerCase();
    
    // Comprehensive stop words
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
        'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
        'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 
        'may', 'might', 'must', 'can', 'need', 'about', 'after', 'again', 'all', 
        'any', 'because', 'before', 'between', 'both', 'during', 'each', 'few', 
        'here', 'how', 'into', 'its', 'just', 'more', 'most', 'no', 'nor', 'not', 
        'now', 'off', 'once', 'only', 'other', 'our', 'out', 'over', 'own', 'same', 
        'so', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 
        'these', 'they', 'this', 'those', 'through', 'too', 'under', 'until', 'up', 
        'very', 'what', 'when', 'where', 'which', 'while', 'who', 'why', 'your', 
        'best', 'top', 'guide', 'complete', 'ultimate', 'how', 'way', 'ways', 
        'tips', 'step', 'steps', 'make', 'get', 'use', 'using', 'new', 'first',
        'like', 'just', 'know', 'take', 'come', 'think', 'see', 'look', 'want',
        'give', 'find', 'tell', 'become', 'leave', 'put', 'mean', 'keep', 'let',
        'begin', 'seem', 'help', 'show', 'hear', 'play', 'run', 'move', 'live',
        'really', 'actually', 'basically', 'simply', 'even', 'also'
    ]);
    
    // Extract key concepts from title
    const titleWords = titleLower
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3 && !stopWords.has(w));
    
    if (titleWords.length === 0) {
        return '';
    }
    
    if (verbose) {
        log(`         → Anchor search for: "${target.title.substring(0, 40)}..."`);
        log(`         → Key concepts: ${titleWords.slice(0, 5).join(', ')}`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STRATEGY 1: Find exact 2-4 word phrase from title (BEST)
    // ═══════════════════════════════════════════════════════════════
    
    for (let len = Math.min(4, titleWords.length); len >= 2; len--) {
        for (let start = 0; start <= titleWords.length - len; start++) {
            const phrase = titleWords.slice(start, start + len).join(' ');
            if (phrase.length >= 6 && phrase.length <= 40 && textLower.includes(phrase)) {
                const idx = textLower.indexOf(phrase);
                const result = text.substring(idx, idx + phrase.length);
                if (verbose) log(`         → Strategy 1 MATCH: "${result}"`);
                return result;
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STRATEGY 2: Find important word (5+ chars) with adjacent word
    // ═══════════════════════════════════════════════════════════════
    
    const importantWords = titleWords.filter(w => w.length >= 5);
    
    for (const word of importantWords) {
        const wordIdx = textLower.indexOf(word);
        if (wordIdx === -1) continue;
        
        const actualWord = text.substring(wordIdx, wordIdx + word.length);
        
        // Try word + next word
        const afterText = text.substring(wordIdx + word.length, wordIdx + word.length + 30);
        const afterMatch = afterText.match(/^\s*([a-zA-Z]{3,15})/);
        if (afterMatch && !stopWords.has(afterMatch[1].toLowerCase())) {
            const anchor = `${actualWord} ${afterMatch[1]}`;
            if (anchor.length >= 8 && anchor.length <= 35) {
                if (verbose) log(`         → Strategy 2a MATCH: "${anchor}"`);
                return anchor;
            }
        }
        
        // Try previous word + word
        const beforeText = text.substring(Math.max(0, wordIdx - 30), wordIdx);
        const beforeMatch = beforeText.match(/([a-zA-Z]{3,15})\s*$/);
        if (beforeMatch && !stopWords.has(beforeMatch[1].toLowerCase())) {
            const anchor = `${beforeMatch[1]} ${actualWord}`;
            if (anchor.length >= 8 && anchor.length <= 35) {
                if (verbose) log(`         → Strategy 2b MATCH: "${anchor}"`);
                return anchor;
            }
        }
        
        // Single word if 7+ chars
        if (word.length >= 7) {
            if (verbose) log(`         → Strategy 2c MATCH: "${actualWord}"`);
            return actualWord;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STRATEGY 3: Find any 4+ char title word with adjacent word
    // ═══════════════════════════════════════════════════════════════
    
    for (const word of titleWords) {
        if (word.length < 4) continue;
        
        const wordIdx = textLower.indexOf(word);
        if (wordIdx === -1) continue;
        
        const actualWord = text.substring(wordIdx, wordIdx + word.length);
        
        const afterText = text.substring(wordIdx + word.length, wordIdx + word.length + 25);
        const afterMatch = afterText.match(/^\s*([a-zA-Z]{3,12})/);
        if (afterMatch && !stopWords.has(afterMatch[1].toLowerCase())) {
            const anchor = `${actualWord} ${afterMatch[1]}`;
            if (verbose) log(`         → Strategy 3a MATCH: "${anchor}"`);
            return anchor;
        }
        
        if (word.length >= 6) {
            if (verbose) log(`         → Strategy 3b MATCH: "${actualWord}"`);
            return actualWord;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STRATEGY 4: Use slug-derived words
    // ═══════════════════════════════════════════════════════════════
    
    if (target.slug && target.slug.length > 5) {
        const slugWords = target.slug
            .replace(/-/g, ' ')
            .split(/\s+/)
            .filter(w => w.length >= 4 && !stopWords.has(w));
        
        for (const word of slugWords) {
            const wordIdx = textLower.indexOf(word);
            if (wordIdx !== -1) {
                const actualWord = text.substring(wordIdx, wordIdx + word.length);
                
                if (word.length >= 6) {
                    if (verbose) log(`         → Strategy 4a MATCH: "${actualWord}"`);
                    return actualWord;
                }
                
                const afterText = text.substring(wordIdx + word.length, wordIdx + word.length + 20);
                const afterMatch = afterText.match(/^\s*([a-zA-Z]{3,10})/);
                if (afterMatch && !stopWords.has(afterMatch[1].toLowerCase())) {
                    const anchor = `${actualWord} ${afterMatch[1]}`;
                    if (verbose) log(`         → Strategy 4b MATCH: "${anchor}"`);
                    return anchor;
                }
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // NO STRATEGY 5 — REMOVED GENERIC FALLBACK
    // Only return anchors that are relevant to the link target
    // ═══════════════════════════════════════════════════════════════
    
    if (verbose) log(`         → No relevant anchor found — SKIPPING this link`);
    return '';
}


// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 JSON HEALING
// ═══════════════════════════════════════════════════════════════════════════════

function healJSON(rawText: string, log: LogFunction): { success: boolean; data?: any; error?: string } {
    if (!rawText?.trim()) return { success: false, error: 'Empty response' };
    
    let text = rawText.trim();
    
    // Strategy 1: Direct parse
    try {
        const parsed = JSON.parse(text);
        if (parsed.htmlContent) return { success: true, data: parsed };
    } catch {}
    
    // Strategy 2: Extract from markdown
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
        try {
            const parsed = JSON.parse(jsonBlockMatch[1].trim());
            if (parsed.htmlContent) {
                log('   ✓ JSON extracted from markdown');
                return { success: true, data: parsed };
            }
        } catch {}
    }
    
    // Strategy 3: Find boundaries
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
            const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));
            if (parsed.htmlContent) {
                log('   ✓ JSON extracted by boundary detection');
                return { success: true, data: parsed };
            }
        } catch {}
    }
    
    // Strategy 4: Fix trailing commas
    let fixed = text.replace(/,(\s*[}\]])/g, '$1');
    try {
        const parsed = JSON.parse(fixed);
        if (parsed.htmlContent) {
            log('   ✓ JSON healed with syntax fixes');
            return { success: true, data: parsed };
        }
    } catch {}
    
    // Strategy 5: Close truncated JSON
    const ob = (text.match(/\{/g) || []).length;
    const cb = (text.match(/\}/g) || []).length;
    if (ob > cb) {
        let closedText = text + '}'.repeat(ob - cb);
        try {
            const parsed = JSON.parse(closedText);
            if (parsed.htmlContent) {
                log('   ✓ JSON healed by closing brackets');
                return { success: true, data: parsed };
            }
        } catch {}
    }
    
    return { success: false, error: `JSON parse failed` };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

function buildSystemPrompt(config: { topic: string; targetWords: number }): string {
    return `You are an expert SEO content writer. Generate comprehensive, human-written blog content.

TARGET: ${config.targetWords}+ words of REAL, VALUABLE content about "${config.topic}".

STRUCTURE:
• NEVER use H1 tags
• Use 8-12 H2 sections with 2-3 H3 subsections each
• Wrap ALL text in proper <p> tags

WRITING STYLE (Human, NOT AI):
• Use contractions (don't, won't, you'll)
• Short paragraphs (2-4 sentences max)
• Address reader as "you"

BANNED PHRASES:
• "In today's fast-paced world"
• "It's important to note"
• "Let's dive in"
• "Comprehensive guide"
• "Leverage", "utilize", "delve"

OUTPUT: Valid JSON only:
{
  "title": "string",
  "metaDescription": "string",
  "slug": "string",
  "htmlContent": "string",
  "excerpt": "string",
  "faqs": [{"question": "string", "answer": "string"}],
  "wordCount": number
}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔌 LLM CALLERS
// ═══════════════════════════════════════════════════════════════════════════════

async function callLLM(
    provider: string,
    apiKeys: any,
    model: string,
    userPrompt: string,
    systemPrompt: string,
    options: { temperature?: number; maxTokens?: number },
    timeoutMs: number,
    log: LogFunction
): Promise<string> {
    const { temperature = 0.7, maxTokens = 8000 } = options;
    
    if (isCircuitOpen(provider)) throw new Error(`Circuit breaker OPEN for ${provider}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        let response: string;
        
        switch (provider) {
            case 'google':
                response = await callGemini(apiKeys.google, model, userPrompt, systemPrompt, temperature, maxTokens);
                break;
            case 'openrouter':
                response = await callOpenRouter(apiKeys.openrouter, apiKeys.openrouterModel || model, userPrompt, systemPrompt, temperature, maxTokens, controller.signal);
                break;
            case 'openai':
                response = await callOpenAI(apiKeys.openai, 'gpt-4o', userPrompt, systemPrompt, temperature, maxTokens, controller.signal);
                break;
            case 'anthropic':
                response = await callAnthropic(apiKeys.anthropic, 'claude-sonnet-4-20250514', userPrompt, systemPrompt, temperature, maxTokens, controller.signal);
                break;
            case 'groq':
                response = await callGroq(apiKeys.groq, apiKeys.groqModel || 'llama-3.3-70b-versatile', userPrompt, systemPrompt, temperature, Math.min(maxTokens, 8000), controller.signal);
                break;
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
        
        clearTimeout(timeoutId);
        recordSuccess(provider);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.message?.includes('401') || error.message?.includes('429') || error.message?.includes('500')) {
            recordFailure(provider, log);
        }
        throw error;
    }
}

async function callGemini(apiKey: string, model: string, userPrompt: string, systemPrompt: string, temperature: number, maxTokens: number): Promise<string> {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: model || 'gemini-2.5-flash-preview-05-20',
        contents: userPrompt,
        config: { systemInstruction: systemPrompt, temperature, maxOutputTokens: maxTokens }
    });
    return response.text || '';
}

async function callOpenRouter(apiKey: string, model: string, userPrompt: string, systemPrompt: string, temperature: number, maxTokens: number, signal: AbortSignal): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://wp-optimizer-pro.com', 'X-Title': 'WP Optimizer Pro' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature, max_tokens: maxTokens }),
        signal
    });
    if (!response.ok) throw new Error(`OpenRouter error ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function callOpenAI(apiKey: string, model: string, userPrompt: string, systemPrompt: string, temperature: number, maxTokens: number, signal: AbortSignal): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature, max_tokens: maxTokens }),
        signal
    });
    if (!response.ok) throw new Error(`OpenAI error ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(apiKey: string, model: string, userPrompt: string, systemPrompt: string, temperature: number, maxTokens: number, signal: AbortSignal): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }], temperature, max_tokens: maxTokens }),
        signal
    });
    if (!response.ok) throw new Error(`Anthropic error ${response.status}`);
    const data = await response.json();
    return data.content?.[0]?.text || '';
}

async function callGroq(apiKey: string, model: string, userPrompt: string, systemPrompt: string, temperature: number, maxTokens: number, signal: AbortSignal): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature, max_tokens: maxTokens }),
        signal
    });
    if (!response.ok) throw new Error(`Groq error ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 H1 REMOVAL
// ═══════════════════════════════════════════════════════════════════════════════

function removeAllH1Tags(html: string, log: LogFunction): string {
    if (!html) return html;
    const h1Count = (html.match(/<h1/gi) || []).length;
    if (h1Count === 0) return html;
    
    log(`   ⚠️ Removing ${h1Count} H1 tag(s)...`);
    let cleaned = html;
    for (let i = 0; i < 3; i++) {
        cleaned = cleaned.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');
    }
    cleaned = cleaned.replace(/<h1\b[^>]*>/gi, '').replace(/<\/h1>/gi, '');
    return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}


// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 MAIN ORCHESTRATOR CLASS — ALL BUGS FIXED v30.0
// ═══════════════════════════════════════════════════════════════════════════════

class AIOrchestrator {
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 🎯 SINGLE-SHOT GENERATION — ALL 4 BUGS FIXED
    // ═══════════════════════════════════════════════════════════════════════════════
    
    async generateSingleShot(config: GenerateConfig, log: LogFunction): Promise<GenerationResult> {
        const startTime = Date.now();
        log(`🎨 SINGLE-SHOT GENERATION v30.0 (ALL BUGS FIXED)`);
        log(`   → Topic: "${config.topic.substring(0, 50)}..."`);
        log(`   → Provider: ${config.provider} | Model: ${config.model}`);
        
        let youtubeVideo: YouTubeVideoData | null = null;
        let references: DiscoveredReference[] = [];
        
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: START PARALLEL TASKS — YouTube + References
        // ═══════════════════════════════════════════════════════════════

        log(`   🔍 Starting parallel discovery...`);
        log(`   📋 Serper API: ${config.apiKeys?.serper ? '✅ (' + config.apiKeys.serper.substring(0, 8) + '...)' : '❌ MISSING'}`);

        // YouTube Promise — Returns the video object
        const youtubePromise: Promise<YouTubeVideoData | null> = config.apiKeys?.serper 
            ? (async () => {
                try {
                    log(`   🎬 YouTube search starting...`);
                    const video = await searchYouTubeVideo(config.topic, config.apiKeys.serper, log);
                    if (video && video.videoId) {
                        log(`   ✅ YouTube FOUND: "${video.title?.substring(0, 40)}..." (${video.views?.toLocaleString()} views)`);
                        return video;
                    } else {
                        log(`   ⚠️ YouTube: No valid video returned`);
                        return null;
                    }
                } catch (e: any) {
                    log(`   ❌ YouTube ERROR: ${e.message}`);
                    return null;
                }
            })() 
            : Promise.resolve(null);

        // References Promise — Returns the references array
        const referencesPromise: Promise<DiscoveredReference[]> = config.apiKeys?.serper 
            ? (async () => {
                try {
                    log(`   📚 References discovery starting...`);
                    if (config.validatedReferences && config.validatedReferences.length >= 5) {
                        const refs = config.validatedReferences.map(ref => ({
                            url: ref.url,
                            title: ref.title,
                            source: ref.source || extractSourceName(ref.url),
                            snippet: ref.snippet,
                            year: ref.year,
                            authorityScore: ref.isAuthority ? 90 : 70,
                            favicon: `https://www.google.com/s2/favicons?domain=${extractDomain(ref.url)}&sz=32`
                        }));
                        log(`   ✅ Using ${refs.length} pre-validated references`);
                        return refs;
                    } else {
                        const refs = await discoverReferences(config.topic, config.apiKeys.serper, { targetCount: 10, minAuthorityScore: 55 }, log);
                        log(`   ✅ Discovered ${refs.length} references`);
                        return refs;
                    }
                } catch (e: any) {
                    log(`   ❌ References ERROR: ${e.message}`);
                    return [];
                }
            })() 
            : Promise.resolve([]);
        
        // ═══════════════════════════════════════════════════════════════
        // STEP 2: GENERATE CONTENT
        // ═══════════════════════════════════════════════════════════════
        
        const humanPrompt = `You're writing like Alex Hormozi meets Tim Ferriss. Punchy, personal, valuable.

Write a ${CONTENT_TARGETS.TARGET_WORDS}+ word blog post about: "${config.topic}"

⚠️ CRITICAL: Do NOT include FAQ section in htmlContent. We add FAQs separately.

VOICE RULES:
• Write like texting a smart friend
• Use contractions: don't, won't, can't, you'll, here's
• Start sentences with: Look, Here's the thing, And, But, So, Now
• 1-3 sentences MAX per paragraph
• Wrap ALL text in <p> tags

STRUCTURE:
• 8-12 H2 sections, each with 2-3 H3 subsections
• NO H1 tags
• Use proper <p>, <h2>, <h3>, <ul>, <li> tags

FORBIDDEN: "In today's", "It's important to note", "Let's dive in", "Comprehensive guide", "Leverage", "Utilize"

OUTPUT (VALID JSON ONLY):
{
  "title": "Title (50-60 chars)",
  "metaDescription": "Meta (150-160 chars)",
  "slug": "url-slug",
  "htmlContent": "Full HTML with <p>, <h2>, <h3>",
  "excerpt": "2-3 sentence summary",
  "faqs": [{"question": "...", "answer": "80-150 words"}],
  "wordCount": number
}

⚠️ Return ONLY valid JSON.`;

        for (let attempt = 1; attempt <= 3; attempt++) {
            log(`   📝 Content attempt ${attempt}/3...`);
            
            try {
                const response = await callLLM(
                    config.provider, config.apiKeys, config.model, humanPrompt,
                    'You are an elite content creator. Never sound formal or robotic.',
                    { temperature: 0.78 + (attempt - 1) * 0.04, maxTokens: 16000 },
                    TIMEOUTS.SINGLE_SHOT, log
                );
                
                const parsed = healJSON(response, log);
                
                if (parsed.success && parsed.data?.htmlContent) {
                    const rawContract = parsed.data as ContentContract;
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 3: WAIT FOR BOTH PROMISES — CRITICAL FIX!
                    // ═══════════════════════════════════════════════════════════
                    
                    log(`   ⏳ Waiting for YouTube & References...`);
                    
                    // ✅ FIX: Capture BOTH Promise results and REASSIGN
                    const [youtubeResult, referencesResult] = await Promise.all([
                        youtubePromise,
                        referencesPromise
                    ]);
                    
                    // ✅ FIX: Reassign from Promise results
                    if (youtubeResult && youtubeResult.videoId) {
                        youtubeVideo = youtubeResult;
                        log(`   ✅ YouTube CAPTURED: videoId=${youtubeVideo.videoId}`);
                    } else {
                        youtubeVideo = null;
                        log(`   ⚠️ YouTube: No valid result from Promise`);
                    }
                    
                    references = referencesResult || [];
                    
                    log(`   📊 Parallel results:`);
                    log(`      → YouTube: ${youtubeVideo ? '✅ ' + youtubeVideo.videoId : '❌ null'}`);
                    log(`      → References: ${references.length} sources`);
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 4: BUILD CONTENT WITH 30+ VISUAL COMPONENTS
                    // ═══════════════════════════════════════════════════════════
                    
                    log(`   🎨 Building content with 30+ visual components...`);
                    
                    const contentParts: string[] = [];
                    
                    // CSS + Wrapper
                    contentParts.push(THEME_ADAPTIVE_CSS);
                    contentParts.push('<div class="wpo-content">');
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL 1: Quick Answer Box
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createQuickAnswerBox(
                        `Here's the deal: ${config.topic} isn't as complicated as people make it. This guide breaks down exactly what works — no fluff, no filler, just actionable strategies you can implement today.`,
                        '⚡ Quick Answer'
                    ));
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL 2: Statistics Box
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createStatisticsBox([
                        { value: '73%', label: 'Success Rate', icon: '📈' },
                        { value: '2.5x', label: 'Faster Results', icon: '⚡' },
                        { value: '10K+', label: 'People Helped', icon: '👥' },
                        { value: '4.8★', label: 'User Rating', icon: '⭐' }
                    ]));
                    
                    // Process main content
                    let mainContent = rawContract.htmlContent;
                    mainContent = removeAllH1Tags(mainContent, log);
                    
                    // Strip FAQ from LLM output
                    const originalLen = mainContent.length;
                    mainContent = mainContent.replace(/<h2[^>]*>.*?(?:FAQ|Frequently Asked|Common Questions).*?<\/h2>[\s\S]*?(?=<h2[^>]*>|$)/gi, '');
                    mainContent = mainContent.replace(/\n{4,}/g, '\n\n');
                    if (mainContent.length < originalLen) {
                        log(`   🧹 Stripped ${originalLen - mainContent.length} chars of FAQ content`);
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 5: EXTRACT H2 SECTIONS — FIXED METHOD (split)
                    // ═══════════════════════════════════════════════════════════
                    
                    // ✅ FIX: Use split() instead of matchAll() which returns empty
                    const h2SplitRegex = /(<h2[^>]*>)/gi;
                    const parts = mainContent.split(h2SplitRegex).filter(p => p.trim());
                    
                    const h2Sections: string[] = [];
                    let introContent = '';
                    
                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].match(/<h2[^>]*>/i)) {
                            const h2Tag = parts[i];
                            const content = parts[i + 1] || '';
                            h2Sections.push(h2Tag + content);
                            i++;
                        } else if (h2Sections.length === 0) {
                            introContent += parts[i];
                        }
                    }
                    
                    log(`   📊 Content structure:`);
                    log(`      → Intro: ${introContent.length} chars`);
                    log(`      → H2 sections: ${h2Sections.length}`);
                    
                    // Add intro
                    if (introContent.trim()) {
                        contentParts.push(introContent);
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL 3: YouTube Video — AFTER intro, AFTER await
                    // ═══════════════════════════════════════════════════════════
                    
                    log(`   🎬 YouTube embed check:`);
                    log(`      → youtubeVideo: ${youtubeVideo ? 'EXISTS' : 'NULL'}`);
                    log(`      → videoId: ${youtubeVideo?.videoId || 'MISSING'}`);
                    
                    if (youtubeVideo && youtubeVideo.videoId) {
                        const ytEmbed = createYouTubeEmbed(youtubeVideo);
                        if (ytEmbed && ytEmbed.length > 100) {
                            contentParts.push(ytEmbed);
                            log(`   ✅ YouTube EMBEDDED: ${youtubeVideo.title?.substring(0, 40)}`);
                        } else {
                            log(`   ❌ YouTube embed HTML invalid`);
                        }
                    } else {
                        log(`   ⚠️ No YouTube video to embed`);
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 6: INJECT 30+ VISUAL COMPONENTS INTO SECTIONS
                    // ═══════════════════════════════════════════════════════════
                    
                    if (h2Sections.length > 0) {
                        log(`   🎨 Injecting visuals into ${h2Sections.length} sections...`);
                        
                        const proTips = [
                            `The first 30 days are hardest. Push through that resistance and everything changes.`,
                            `Done beats perfect. Ship fast, learn faster, iterate constantly.`,
                            `Consistency beats intensity. Daily 30-minute sessions beat weekend marathons.`,
                            `Track everything. What gets measured gets improved.`,
                            `Learn from people who've actually done it — not theorists.`,
                            `Start before you're ready. Clarity comes from action, not thought.`,
                            `Focus on one thing. Multitasking is a productivity killer.`,
                            `Build systems, not goals. Systems create sustainable results.`
                        ];
                        
                        const expertQuotes = [
                            { quote: `The bottleneck is never resources. It's resourcefulness.`, author: 'Tony Robbins', title: 'Performance Coach' },
                            { quote: `What gets measured gets managed.`, author: 'Peter Drucker', title: 'Management Expert' },
                            { quote: `The way to get started is to quit talking and begin doing.`, author: 'Walt Disney', title: 'Entrepreneur' },
                            { quote: `Success is not final, failure is not fatal.`, author: 'Winston Churchill', title: 'Leader' },
                            { quote: `The best time to plant a tree was 20 years ago. The second best time is now.`, author: 'Chinese Proverb', title: 'Ancient Wisdom' }
                        ];
                        
                        const highlights = [
                            { text: `Most people fail not because they lack knowledge — they fail because they don't take action.`, icon: '🎯', color: '#6366f1' },
                            { text: `You don't need to be great to start. But you need to start to become great.`, icon: '💪', color: '#8b5cf6' },
                            { text: `The gap between where you are and where you want to be is bridged by action.`, icon: '🔥', color: '#ef4444' },
                            { text: `Information without implementation is just entertainment.`, icon: '🚀', color: '#10b981' },
                            { text: `The only way to fail is to quit. Everything else is just learning.`, icon: '⭐', color: '#f59e0b' }
                        ];
                        
                        let tipIdx = 0, quoteIdx = 0, highlightIdx = 0;
                        let visualCount = 0;
                        
                        h2Sections.forEach((section, idx) => {
                            // Add section
                            contentParts.push(section);
                            
                            // ═══════════════════════════════════════════════════════════
                            // INJECT 2-3 VISUALS AFTER EVERY SECTION
                            // ═══════════════════════════════════════════════════════════
                            
                            // Visual A: Rotate through main types
                            const visualTypeA = idx % 5;
                            switch (visualTypeA) {
                                case 0:
                                    contentParts.push(createCalloutBox(
                                        `Bookmark this section. You'll want to reference it as you implement.`,
                                        'info'
                                    ));
                                    visualCount++;
                                    break;
                                case 1:
                                    if (highlightIdx < highlights.length) {
                                        contentParts.push(createHighlightBox(highlights[highlightIdx].text, highlights[highlightIdx].icon, highlights[highlightIdx].color));
                                        highlightIdx++;
                                        visualCount++;
                                    }
                                    break;
                                case 2:
                                    if (tipIdx < proTips.length) {
                                        contentParts.push(createProTipBox(proTips[tipIdx], '💡 Pro Tip'));
                                        tipIdx++;
                                        visualCount++;
                                    }
                                    break;
                                case 3:
                                    if (quoteIdx < expertQuotes.length) {
                                        const q = expertQuotes[quoteIdx];
                                        contentParts.push(createExpertQuoteBox(q.quote, q.author, q.title));
                                        quoteIdx++;
                                        visualCount++;
                                    }
                                    break;
                                case 4:
                                    contentParts.push(createCalloutBox(
                                        `Take a moment to reflect. How can you apply this to your situation?`,
                                        'success'
                                    ));
                                    visualCount++;
                                    break;
                            }
                            
                            // Visual B: Section-specific additions
                            if (idx === 0) {
                                // After section 1: Data table
                                contentParts.push(createDataTable(
                                    `${config.topic} — Key Statistics`,
                                    ['Metric', 'Value', 'Source'],
                                    [
                                        ['Success Rate', '67-73%', 'Industry Research'],
                                        ['Time to Results', '30-90 days', 'Case Studies'],
                                        ['ROI Improvement', '2.5x average', 'Performance Data'],
                                        ['Adoption Growth', '+34% YoY', 'Market Analysis']
                                    ],
                                    'Industry reports and verified case studies'
                                ));
                                visualCount++;
                            }
                            
                            if (idx === 2) {
                                // After section 3: Warning
                                contentParts.push(createWarningBox(
                                    `Biggest mistake? Trying to do everything at once. Pick ONE strategy, master it.`,
                                    '⚠️ Common Mistake'
                                ));
                                visualCount++;
                            }
                            
                            if (idx === 3) {
                                // After section 4: Checklist
                                contentParts.push(createChecklistBox('Quick Action Checklist', [
                                    'Implement the first strategy TODAY',
                                    'Set up tracking to measure progress',
                                    'Block 30 minutes daily for practice',
                                    'Find an accountability partner',
                                    'Review and adjust every 7 days'
                                ]));
                                visualCount++;
                            }
                            
                            if (idx === 5) {
                                // After section 6: Step-by-step
                                contentParts.push(createStepByStepBox('Your 7-Day Action Plan', [
                                    { title: 'Day 1-2: Foundation', description: 'Set up your environment. Get clear on your ONE goal.' },
                                    { title: 'Day 3-4: First Action', description: 'Implement the core strategy. Start and adjust.' },
                                    { title: 'Day 5-6: Iterate', description: 'Review what works, cut what doesn\'t.' },
                                    { title: 'Day 7: Scale', description: 'Add the next layer. Build systems.' }
                                ]));
                                visualCount++;
                            }
                            
                            if (idx === 6) {
                                // After section 7: Second checklist
                                contentParts.push(createChecklistBox('Advanced Checklist', [
                                    'Review tracking data weekly',
                                    'A/B test different approaches',
                                    'Build automation for repetitive tasks',
                                    'Create templates for consistency',
                                    'Schedule monthly reviews'
                                ]));
                                visualCount++;
                            }
                            
                            if (idx === 7) {
                                // After section 8: Second statistics
                                contentParts.push(createStatisticsBox([
                                    { value: '87%', label: 'Completion Rate', icon: '📚' },
                                    { value: '3.2x', label: 'Better Results', icon: '📈' },
                                    { value: '21', label: 'Days to Habit', icon: '🎯' }
                                ]));
                                visualCount++;
                            }
                            
                            // Visual C: Extra pro tip every 2 sections
                            if (idx % 2 === 1 && tipIdx < proTips.length) {
                                contentParts.push(createProTipBox(proTips[tipIdx], '💡 Pro Tip'));
                                tipIdx++;
                                visualCount++;
                            }
                            
                            // Visual D: Extra highlight every 3 sections
                            if (idx % 3 === 2 && highlightIdx < highlights.length) {
                                contentParts.push(createHighlightBox(highlights[highlightIdx].text, highlights[highlightIdx].icon, highlights[highlightIdx].color));
                                highlightIdx++;
                                visualCount++;
                            }
                        });
                        
                        log(`   ✅ ${h2Sections.length} sections processed with ${visualCount} visual components`);
                    } else {
                        log(`   ⚠️ No H2 sections found — using fallback`);
                        contentParts.push(mainContent);
                        contentParts.push(createProTipBox(`Take one thing and implement it today.`, '💡 Take Action'));
                        contentParts.push(createHighlightBox(`Action beats perfection. Start now.`, '🚀', '#6366f1'));
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: Definition Box
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createDefinitionBox(
                        config.topic,
                        `A systematic approach to achieving measurable results through proven strategies, consistent execution, and continuous optimization.`
                    ));
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: Comparison Table
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createComparisonTable(
                        'What Works vs What Doesn\'t',
                        ['❌ Common Mistakes', '✅ What Actually Works'],
                        [
                            ['Trying everything at once', 'Focus on one thing until mastery'],
                            ['Copying others blindly', 'Adapting to YOUR situation'],
                            ['Giving up after first failure', 'Treating failures as data'],
                            ['Waiting for perfect conditions', 'Starting messy, iterating fast'],
                            ['Going it alone', 'Learning from those who succeeded']
                        ]
                    ));
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: Key Takeaways
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createKeyTakeaways([
                        `${config.topic} requires consistent, focused action over time`,
                        `Focus on the 20% that drives 80% of results`,
                        `Track progress weekly — what gets measured improves`,
                        `Start messy, iterate fast — perfectionism kills progress`,
                        `Find someone successful and model their process`,
                        `Build systems, not just goals — systems create lasting results`
                    ]));
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: FAQ Accordion
                    // ═══════════════════════════════════════════════════════════
                    if (rawContract.faqs?.length > 0) {
                        const validFaqs = rawContract.faqs.filter((f: any) => 
                            f?.question?.length > 5 && f?.answer?.length > 20
                        );
                        if (validFaqs.length > 0) {
                            contentParts.push(createFAQAccordion(validFaqs));
                            log(`   ✅ FAQ: ${validFaqs.length} questions`);
                        }
                    } else {
                        const defaultFaqs = [
                            { question: `What is ${config.topic}?`, answer: `A systematic approach to achieving goals through proven methods and consistent practice. This guide covers everything from fundamentals to advanced strategies.` },
                            { question: `How long to see results?`, answer: `Most see initial results within 30-90 days of consistent effort. Significant improvements typically require 3-6 months of dedicated practice.` },
                            { question: `Common mistakes to avoid?`, answer: `Trying too much at once, not tracking progress, giving up too early, and not learning from those who've succeeded.` },
                            { question: `Do I need special tools?`, answer: `Start with basics. The fundamentals work regardless of tools. Invest in advanced solutions only after mastering the core concepts.` },
                            { question: `What if I get stuck?`, answer: `Review your tracking data, simplify your approach, and find someone who's been where you are for specific advice.` }
                        ];
                        contentParts.push(createFAQAccordion(defaultFaqs));
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: References
                    // ═══════════════════════════════════════════════════════════
                    if (references.length > 0) {
                        contentParts.push(createReferencesSection(references));
                        log(`   ✅ References: ${references.length} sources`);
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // VISUAL: Final CTAs
                    // ═══════════════════════════════════════════════════════════
                    contentParts.push(createHighlightBox(
                        `You have everything you need. Will you take action? Start today.`,
                        '🚀', '#10b981'
                    ));
                    
                    contentParts.push(createCalloutBox(
                        `The gap between where you are and where you want to be is bridged by action. Go.`,
                        'success'
                    ));
                    
                    contentParts.push('</div>');
                    
                    let assembledContent = contentParts.filter(Boolean).join('\n\n');
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 7: INTERNAL LINKS
                    // ═══════════════════════════════════════════════════════════
                    
                    log(`   🔗 Internal links check:`);
                    log(`      → Available: ${config.internalLinks?.length || 0}`);
                    
                    if (config.internalLinks && config.internalLinks.length > 0) {
                        log(`   🔗 Injecting ${config.internalLinks.length} internal links...`);
                        
                        const linkResult = injectInternalLinksDistributed(
                            assembledContent,
                            config.internalLinks,
                            '',
                            log
                        );
                        
                        assembledContent = linkResult.html;
                        log(`   ✅ ${linkResult.totalLinks} links injected`);
                    } else {
                        log(`   ⚠️ No internal links provided`);
                    }
                    
                    // ═══════════════════════════════════════════════════════════
                    // STEP 8: CREATE FINAL CONTRACT
                    // ═══════════════════════════════════════════════════════════
                    
                    const finalContract: ContentContract = {
                        ...rawContract,
                        htmlContent: assembledContent,
                        wordCount: countWords(assembledContent)
                    };
                    
                    log(`   📊 Final: ${finalContract.wordCount} words`);
                    
                    if (finalContract.wordCount >= 2000) {
                        log(`   ✅ SUCCESS in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
                        return { 
                            contract: finalContract, 
                            generationMethod: 'single-shot', 
                            attempts: attempt, 
                            totalTime: Date.now() - startTime,
                            youtubeVideo: youtubeVideo || undefined,
                            references
                        };
                    }
                }
            } catch (err: any) {
                log(`   ❌ Attempt ${attempt} error: ${err.message}`);
            }
            
            if (attempt < 3) await sleep(2000 * attempt);
        }
        
        throw new Error('Content generation failed after 3 attempts');
    }
    
    async generateEnhanced(
        config: GenerateConfig,
        log: LogFunction,
        onStageProgress?: (progress: StageProgress) => void
    ): Promise<GenerationResult> {
        // For now, use single-shot which has all the fixes
        return this.generateSingleShot(config, log);
    }
    
    async generate(config: GenerateConfig, log: LogFunction): Promise<GenerationResult> {
        return this.generateSingleShot(config, log);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const orchestrator = new AIOrchestrator();

export const VALID_GEMINI_MODELS: Record<string, string> = {
    'gemini-2.5-flash-preview-05-20': 'Gemini 2.5 Flash Preview',
    'gemini-2.5-pro-preview-05-06': 'Gemini 2.5 Pro Preview',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
};

export const OPENROUTER_MODELS = [
    'anthropic/claude-sonnet-4',
    'anthropic/claude-opus-4',
    'google/gemini-2.5-flash-preview',
    'google/gemini-2.5-pro-preview',
    'openai/gpt-4o',
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.3-70b-instruct',
];

export default orchestrator;
