// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — ULTRA-FAST SITEMAP CRAWLER
// ═══════════════════════════════════════════════════════════════════════════════

import { CrawledPage, InternalLinkTarget } from '../types';

export const SITEMAP_CRAWLER_VERSION = "39.0.0";

const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
];

type LogFunction = (msg: string, progress?: number) => void;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeUrl(url: string): string {
    try {
        const u = new URL(url);
        return (u.origin + u.pathname.replace(/\/$/, '')).toLowerCase();
    } catch {
        return url.toLowerCase().replace(/\/$/, '');
    }
}

function extractSlugFromUrl(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const parts = pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || '';
    } catch {
        return url.split('/').filter(Boolean).pop() || '';
    }
}

function extractTitleFromSlug(slug: string): string {
    return slug
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🌐 FETCH WITH CORS PROXY FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchWithCorsProxy(
    url: string,
    log: LogFunction,
    timeoutMs: number = 15000
): Promise<string> {
    // Try direct fetch first
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/xml, text/xml, */*',
                'User-Agent': 'WP-Optimizer-Pro/39.0'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const text = await response.text();
            if (text.includes('<urlset') || text.includes('<sitemapindex') || text.includes('<url>')) {
                log(`   ✅ Direct fetch succeeded`);
                return text;
            }
        }
    } catch (e: any) {
        log(`   ⚠️ Direct fetch failed: ${e.message}`);
    }
    
    // Try CORS proxies
    for (const proxy of CORS_PROXIES) {
        try {
            log(`   🔄 Trying proxy: ${proxy.substring(0, 30)}...`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            
            const proxyUrl = proxy + encodeURIComponent(url);
            const response = await fetch(proxyUrl, { signal: controller.signal });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const text = await response.text();
                if (text.includes('<urlset') || text.includes('<sitemapindex') || text.includes('<url>') || text.includes('<loc>')) {
                    log(`   ✅ Proxy fetch succeeded`);
                    return text;
                }
            }
        } catch (e: any) {
            log(`   ⚠️ Proxy failed: ${e.message}`);
        }
    }
    
    throw new Error('All fetch methods failed');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 PARSE SITEMAP XML
// ═══════════════════════════════════════════════════════════════════════════════

function parseUrlsFromXml(xmlText: string): string[] {
    const urls: string[] = [];
    
    // Extract <loc> tags
    const locRegex = /<loc>([^<]+)<\/loc>/gi;
    let match;
    
    while ((match = locRegex.exec(xmlText)) !== null) {
        const url = match[1].trim();
        if (url && url.startsWith('http')) {
            urls.push(url);
        }
    }
    
    return urls;
}

function isSitemapIndex(xmlText: string): boolean {
    return xmlText.includes('<sitemapindex') || 
           (xmlText.includes('<sitemap>') && !xmlText.includes('<url>'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🕷️ MAIN CRAWL FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export async function crawlSitemap(
    sitemapUrl: string,
    log: LogFunction,
    onProgress?: (current: number, total: number) => void,
    options: {
        maxUrls?: number;
        maxDepth?: number;
        filterPosts?: boolean;
        excludePatterns?: string[];
    } = {}
): Promise<CrawledPage[]> {
    const {
        maxUrls = 500,
        maxDepth = 2,
        filterPosts = true,
        excludePatterns = ['/tag/', '/category/', '/author/', '/page/', '/feed/', '/wp-json/', '/wp-admin/', '/cart/', '/checkout/', '/my-account/']
    } = options;
    
    log(`🕷️ SITEMAP CRAWLER v${SITEMAP_CRAWLER_VERSION}`);
    log(`   → URL: ${sitemapUrl}`);
    log(`   → Max URLs: ${maxUrls}`);
    
    const allUrls = new Set<string>();
    const sitemapsToProcess: Array<{ url: string; depth: number }> = [{ url: sitemapUrl, depth: 0 }];
    const processedSitemaps = new Set<string>();
    
    // Process sitemaps (handle sitemap index)
    while (sitemapsToProcess.length > 0 && allUrls.size < maxUrls) {
        const { url: currentUrl, depth } = sitemapsToProcess.shift()!;
        
        if (processedSitemaps.has(currentUrl) || depth > maxDepth) continue;
        processedSitemaps.add(currentUrl);
        
        log(`   📄 Processing: ${currentUrl}`);
        
        try {
            const xmlText = await fetchWithCorsProxy(currentUrl, log);
            const urls = parseUrlsFromXml(xmlText);
            
            log(`      → Found ${urls.length} URLs`);
            
            if (isSitemapIndex(xmlText)) {
                // This is a sitemap index - queue child sitemaps
                for (const childUrl of urls) {
                    if (childUrl.includes('sitemap') && childUrl.endsWith('.xml')) {
                        sitemapsToProcess.push({ url: childUrl, depth: depth + 1 });
                    }
                }
                log(`      → Queued ${urls.length} child sitemaps`);
            } else {
                // Regular sitemap - add URLs
                for (const pageUrl of urls) {
                    if (allUrls.size >= maxUrls) break;
                    
                    // Filter excluded patterns
                    const urlLower = pageUrl.toLowerCase();
                    const isExcluded = excludePatterns.some(p => urlLower.includes(p.toLowerCase()));
                    
                    if (!isExcluded) {
                        allUrls.add(pageUrl);
                    }
                }
            }
            
            onProgress?.(allUrls.size, maxUrls);
            
        } catch (e: any) {
            log(`   ❌ Failed to process ${currentUrl}: ${e.message}`);
        }
        
        // Small delay to avoid rate limiting
        await sleep(100);
    }
    
    log(`   📊 Total URLs collected: ${allUrls.size}`);
    
    // Convert to CrawledPage objects
    const pages: CrawledPage[] = [];
    let idx = 0;
    
    for (const url of allUrls) {
        const slug = extractSlugFromUrl(url);
        const title = extractTitleFromSlug(slug);
        
        pages.push({
            id: `page-${idx++}-${Date.now()}`,
            url,
            title: title || url,
            slug,
            healthScore: null,
            wordCount: 0,
            seoMetrics: undefined,
            jobState: { status: 'idle' }
        });
    }
    
    log(`✅ Crawl complete: ${pages.length} pages ready`);
    
    return pages;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 CONVERT TO INTERNAL LINK TARGETS
// ═══════════════════════════════════════════════════════════════════════════════

export function convertToInternalLinkTargets(pages: CrawledPage[]): InternalLinkTarget[] {
    return pages
        .filter(p => p.url && p.title && p.title.length >= 10)
        .map(p => ({
            url: p.url,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            categories: p.categories,
            keywords: p.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 3)
                .slice(0, 10)
        }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    SITEMAP_CRAWLER_VERSION,
    crawlSitemap,
    convertToInternalLinkTargets
};
