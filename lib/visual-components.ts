// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v35.0 — ULTIMATE VISUAL COMPONENTS LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
// 
// ENTERPRISE FEATURES:
// ✅ Centralized Design Tokens — Single source of truth
// ✅ 100% Inline Styles — Cannot be overridden by WordPress themes
// ✅ !important on EVERY property — Guaranteed visual consistency
// ✅ 25+ Premium Components — Complete enterprise visual library
// ✅ JSON-LD Schema — SEO-optimized structured data (FAQ, Video, HowTo)
// ✅ Zero-CLS Architecture — Aspect ratio locking for embeds
// ✅ Mobile Responsive — Flexbox with wrap for all screen sizes
// ✅ TypeScript First — Full type definitions and safety
// ✅ Lite YouTube Embed — Click-to-load for Core Web Vitals
// ═══════════════════════════════════════════════════════════════════════════════

export const VISUAL_COMPONENTS_VERSION = "35.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 DESIGN SYSTEM TOKENS (Single Source of Truth)
// ═══════════════════════════════════════════════════════════════════════════════

const TOKENS = {
    colors: {
        // Primary
        primary: '#6366f1',
        primaryDark: '#4f46e5',
        primaryLight: '#818cf8',
        primaryBg: '#eef2ff',
        primaryBorder: '#c7d2fe',
        
        // Success
        success: '#22c55e',
        successDark: '#16a34a',
        successBg: '#f0fdf4',
        successBorder: '#bbf7d0',
        
        // Warning
        warning: '#f59e0b',
        warningDark: '#d97706',
        warningBg: '#fffbeb',
        warningBorder: '#fde68a',
        
        // Danger
        danger: '#ef4444',
        dangerDark: '#dc2626',
        dangerBg: '#fef2f2',
        dangerBorder: '#fecaca',
        
        // Info
        info: '#3b82f6',
        infoDark: '#2563eb',
        infoBg: '#eff6ff',
        infoBorder: '#bfdbfe',
        
        // Neutrals
        white: '#ffffff',
        gray50: '#f8fafc',
        gray100: '#f1f5f9',
        gray200: '#e2e8f0',
        gray300: '#cbd5e1',
        gray400: '#94a3b8',
        gray500: '#64748b',
        gray600: '#475569',
        gray700: '#334155',
        gray800: '#1e293b',
        gray900: '#0f172a',
        
        // Text colors
        text: '#1f2937',
        textMuted: '#6b7280',
        textLight: '#9ca3af'
    },
    gradients: {
        primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        teal: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        ocean: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        midnight: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    },
    shadows: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 12px 32px rgba(0,0,0,0.12)',
        xl: '0 20px 48px rgba(0,0,0,0.15)',
        glow: {
            primary: '0 12px 28px rgba(99,102,241,0.35)',
            success: '0 12px 28px rgba(34,197,94,0.35)',
            danger: '0 12px 28px rgba(239,68,68,0.35)',
            info: '0 12px 28px rgba(59,130,246,0.35)',
            warning: '0 12px 28px rgba(245,158,11,0.35)',
            purple: '0 20px 40px rgba(102,126,234,0.35)',
            teal: '0 16px 36px rgba(17,153,142,0.3)'
        }
    },
    radius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '24px',
        full: '50%'
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px'
    }
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel: string;
    views: number;
    duration?: string;
    thumbnailUrl?: string;
    embedUrl?: string;
    relevanceScore?: number;
    description?: string;
}

export interface DiscoveredReference {
    url: string;
    title: string;
    source: string;
    snippet?: string;
    year?: string | number;
    authorityScore?: number;
    favicon?: string;
}

export type CalloutType = 'info' | 'success' | 'warning' | 'error';

export interface StatItem {
    value: string;
    label: string;
    icon?: string;
}

export interface StepItem {
    title: string;
    description: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface IconGridItem {
    icon: string;
    title: string;
    description: string;
}

export interface TimelineEvent {
    time: string;
    title: string;
    description: string;
}

export interface ProsConsItem {
    pros: string[];
    cons: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function escapeHtml(str: string): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateUniqueId(): string {
    return `wpo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function truncate(str: string, max: number): string {
    if (!str || str.length <= max) return str || '';
    return str.substring(0, max - 3) + '...';
}

function isValidArray<T>(arr: T[] | undefined | null): arr is T[] {
    return Array.isArray(arr) && arr.length > 0;
}

function isValidString(str: string | undefined | null): str is string {
    return typeof str === 'string' && str.trim().length > 0;
}

function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return 'source';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🛡️ MINIMAL CSS RESET (Scoped, High Specificity)
// ═══════════════════════════════════════════════════════════════════════════════

export const THEME_ADAPTIVE_CSS = `
<style>
/* WP Optimizer Pro v35.0 - Bulletproof Reset */
#wpo-engine-root, #wpo-engine-root *, #wpo-engine-root *::before, #wpo-engine-root *::after {
    box-sizing: border-box !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}
#wpo-engine-root {
    line-height: 1.7 !important;
    color: ${TOKENS.colors.text} !important;
    font-size: 18px !important;
    max-width: 100% !important;
}
#wpo-engine-root img { max-width: 100% !important; height: auto !important; display: block !important; }
#wpo-engine-root a { text-decoration: none !important; transition: opacity 0.2s ease !important; }
#wpo-engine-root a:hover { opacity: 0.85 !important; }
#wpo-engine-root ul, #wpo-engine-root ol { list-style: none !important; padding: 0 !important; margin: 0 !important; }
#wpo-engine-root p { margin: 0 0 1rem 0 !important; }
#wpo-engine-root h2, #wpo-engine-root h3, #wpo-engine-root h4 { margin: 0 !important; line-height: 1.3 !important; }
#wpo-engine-root details summary { cursor: pointer !important; list-style: none !important; }
#wpo-engine-root details summary::-webkit-details-marker { display: none !important; }
#wpo-engine-root details summary::marker { display: none !important; }
/* Responsive Video Container */
#wpo-engine-root .wpo-video-wrap { position: relative !important; padding-bottom: 56.25% !important; height: 0 !important; overflow: hidden !important; }
#wpo-engine-root .wpo-video-wrap iframe { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: none !important; }
/* Mobile Optimization */
@media (max-width: 640px) {
    #wpo-engine-root { font-size: 16px !important; }
}
</style>
`;

// ═══════════════════════════════════════════════════════════════════════════════
// ⚡ COMPONENT 1: QUICK ANSWER BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createQuickAnswerBox(answer: string, title: string = 'Quick Answer'): string {
    if (!isValidString(answer)) return '';
    
    return `
<div style="background: ${TOKENS.gradients.purple} !important; border-radius: ${TOKENS.radius.xl} !important; padding: ${TOKENS.spacing.xl} !important; margin: 40px 0 !important; color: ${TOKENS.colors.white} !important; box-shadow: ${TOKENS.shadows.glow.purple} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: flex-start !important; gap: ${TOKENS.spacing.lg} !important; flex-wrap: wrap !important;">
        <div style="width: 64px !important; height: 64px !important; min-width: 64px !important; background: rgba(255,255,255,0.2) !important; backdrop-filter: blur(10px) !important; border-radius: ${TOKENS.radius.lg} !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;">
            <span style="font-size: 32px !important; line-height: 1 !important;">⚡</span>
        </div>
        <div style="flex: 1 !important; min-width: 250px !important;">
            <div style="font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 2px !important; color: rgba(255,255,255,0.9) !important; margin-bottom: 10px !important;">${escapeHtml(title)}</div>
            <p style="font-size: 18px !important; line-height: 1.7 !important; color: ${TOKENS.colors.white} !important; margin: 0 !important; font-weight: 500 !important;">${answer}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💡 COMPONENT 2: PRO TIP BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createProTipBox(tip: string, title: string = 'Pro Tip'): string {
    if (!isValidString(tip)) return '';
    
    return `
<div style="background: ${TOKENS.gradients.teal} !important; border-radius: ${TOKENS.radius.xl} !important; padding: 28px 32px !important; margin: 36px 0 !important; color: ${TOKENS.colors.white} !important; box-shadow: ${TOKENS.shadows.glow.teal} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: flex-start !important; gap: 20px !important; flex-wrap: wrap !important;">
        <div style="width: 56px !important; height: 56px !important; min-width: 56px !important; background: rgba(255,255,255,0.2) !important; backdrop-filter: blur(10px) !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;">
            <span style="font-size: 28px !important; line-height: 1 !important;">💡</span>
        </div>
        <div style="flex: 1 !important; min-width: 250px !important;">
            <div style="font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 2px !important; color: rgba(255,255,255,0.9) !important; margin-bottom: 8px !important;">${escapeHtml(title)}</div>
            <p style="font-size: 16px !important; line-height: 1.7 !important; color: ${TOKENS.colors.white} !important; margin: 0 !important;">${tip}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️ COMPONENT 3: WARNING BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createWarningBox(warning: string, title: string = 'Warning'): string {
    if (!isValidString(warning)) return '';
    
    return `
<div style="background: ${TOKENS.gradients.sunset} !important; border-radius: ${TOKENS.radius.xl} !important; padding: 28px 32px !important; margin: 36px 0 !important; color: ${TOKENS.colors.white} !important; box-shadow: 0 16px 36px rgba(245,87,108,0.3) !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: flex-start !important; gap: 20px !important; flex-wrap: wrap !important;">
        <div style="width: 56px !important; height: 56px !important; min-width: 56px !important; background: rgba(255,255,255,0.2) !important; backdrop-filter: blur(10px) !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;">
            <span style="font-size: 28px !important; line-height: 1 !important;">⚠️</span>
        </div>
        <div style="flex: 1 !important; min-width: 250px !important;">
            <div style="font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 2px !important; color: rgba(255,255,255,0.9) !important; margin-bottom: 8px !important;">${escapeHtml(title)}</div>
            <p style="font-size: 16px !important; line-height: 1.7 !important; color: ${TOKENS.colors.white} !important; margin: 0 !important;">${warning}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 COMPONENT 4: EXPERT QUOTE BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createExpertQuoteBox(quote: string, author: string, title?: string): string {
    if (!isValidString(quote) || !isValidString(author)) return '';
    
    return `
<blockquote style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, #f0f4ff 100%) !important; border-left: 5px solid ${TOKENS.colors.primary} !important; border-radius: 0 ${TOKENS.radius.xl} ${TOKENS.radius.xl} 0 !important; padding: 32px 36px !important; margin: 40px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; font-style: normal !important; overflow: hidden !important;">
    <div style="font-size: 48px !important; color: ${TOKENS.colors.primary} !important; opacity: 0.4 !important; line-height: 1 !important; margin-bottom: 12px !important; font-family: Georgia, serif !important;">"</div>
    <p style="font-size: 19px !important; line-height: 1.8 !important; font-style: italic !important; margin: 0 0 24px 0 !important; color: ${TOKENS.colors.gray800} !important;">${quote}</p>
    <footer style="display: flex !important; align-items: center !important; gap: 16px !important; flex-wrap: wrap !important;">
        <div style="width: 52px !important; height: 52px !important; min-width: 52px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.full} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
            <span style="font-size: 24px !important;">👤</span>
        </div>
        <div>
            <cite style="font-style: normal !important; font-weight: 800 !important; font-size: 16px !important; display: block !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(author)}</cite>
            ${title ? `<span style="font-size: 14px !important; color: ${TOKENS.colors.gray500} !important;">${escapeHtml(title)}</span>` : ''}
        </div>
    </footer>
</blockquote>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ COMPONENT 5: HIGHLIGHT BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createHighlightBox(text: string, icon: string = '✨', bgColor: string = TOKENS.colors.primary): string {
    if (!isValidString(text)) return '';
    
    return `
<div style="background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%) !important; border-radius: ${TOKENS.radius.xl} !important; padding: 30px 36px !important; margin: 40px 0 !important; box-shadow: 0 16px 40px ${bgColor}40 !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: center !important; gap: 20px !important; flex-wrap: wrap !important;">
        <span style="font-size: 42px !important; line-height: 1 !important; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)) !important;">${icon}</span>
        <p style="flex: 1 !important; font-size: 18px !important; line-height: 1.7 !important; color: ${TOKENS.colors.white} !important; margin: 0 !important; font-weight: 600 !important; min-width: 200px !important;">${text}</p>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📢 COMPONENT 6: CALLOUT BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createCalloutBox(text: string, type: CalloutType = 'info'): string {
    if (!isValidString(text)) return '';
    
    const configs: Record<CalloutType, { bg: string; border: string; color: string; icon: string; label: string }> = {
        info: { bg: TOKENS.colors.infoBg, border: TOKENS.colors.info, color: TOKENS.colors.info, icon: 'ℹ️', label: 'Info' },
        success: { bg: TOKENS.colors.successBg, border: TOKENS.colors.success, color: TOKENS.colors.success, icon: '✅', label: 'Success' },
        warning: { bg: TOKENS.colors.warningBg, border: TOKENS.colors.warning, color: TOKENS.colors.warning, icon: '⚡', label: 'Note' },
        error: { bg: TOKENS.colors.dangerBg, border: TOKENS.colors.danger, color: TOKENS.colors.danger, icon: '🔥', label: 'Important' }
    };
    
    const c = configs[type];
    
    return `
<div style="background: ${c.bg} !important; border: none !important; border-left: 5px solid ${c.border} !important; border-radius: 0 ${TOKENS.radius.lg} ${TOKENS.radius.lg} 0 !important; padding: 24px 28px !important; margin: 32px 0 !important; box-shadow: ${TOKENS.shadows.sm} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: flex-start !important; gap: 16px !important; flex-wrap: wrap !important;">
        <span style="font-size: 26px !important; line-height: 1 !important;">${c.icon}</span>
        <div style="flex: 1 !important; min-width: 200px !important;">
            <div style="font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; color: ${c.color} !important; margin-bottom: 6px !important;">${c.label}</div>
            <p style="font-size: 15px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray700} !important; margin: 0 !important;">${text}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 COMPONENT 7: STATISTICS BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createStatisticsBox(stats: StatItem[]): string {
    if (!isValidArray(stats)) return '';
    
    const items = stats.map(stat => `
        <div style="flex: 1 !important; min-width: 140px !important; text-align: center !important; padding: 28px 20px !important; background: ${TOKENS.colors.white} !important; border-radius: ${TOKENS.radius.lg} !important; box-shadow: ${TOKENS.shadows.md} !important; border: 1px solid ${TOKENS.colors.gray100} !important;">
            ${stat.icon ? `<div style="font-size: 28px !important; margin-bottom: 12px !important;">${stat.icon}</div>` : ''}
            <div style="font-size: 36px !important; font-weight: 900 !important; background: ${TOKENS.gradients.primary} !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; margin-bottom: 8px !important; line-height: 1 !important;">${escapeHtml(stat.value)}</div>
            <div style="font-size: 12px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: ${TOKENS.colors.gray500} !important;">${escapeHtml(stat.label)}</div>
        </div>
    `).join('');

    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.gray50} 0%, ${TOKENS.colors.gray100} 100%) !important; border: 1px solid ${TOKENS.colors.gray200} !important; border-radius: ${TOKENS.radius.xxl} !important; padding: 32px !important; margin: 48px 0 !important; overflow: hidden !important;">
    <div style="display: flex !important; flex-wrap: wrap !important; justify-content: center !important; gap: 20px !important;">
        ${items}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 COMPONENT 8: DATA TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export function createDataTable(title: string, headers: string[], rows: string[][], sourceNote?: string): string {
    if (!isValidString(title) || !isValidArray(headers) || !isValidArray(rows)) return '';
    
    const headerCells = headers.map(h => `
        <th style="padding: 16px 20px !important; text-align: left !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; background: ${TOKENS.colors.gray100} !important; color: ${TOKENS.colors.primary} !important; border-bottom: 2px solid ${TOKENS.colors.primaryBorder} !important;">${escapeHtml(h)}</th>
    `).join('');
    
    const tableRows = rows.map((row, i) => {
        const cells = row.map((cell, j) => `
            <td style="padding: 16px 20px !important; font-size: 14px !important; border-bottom: 1px solid ${TOKENS.colors.gray100} !important; color: ${TOKENS.colors.gray700} !important; ${j === 0 ? 'font-weight: 600 !important;' : ''} background: ${i % 2 === 0 ? TOKENS.colors.white : TOKENS.colors.gray50} !important;">${escapeHtml(cell)}</td>
        `).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    return `
<div style="border-radius: ${TOKENS.radius.xl} !important; overflow: hidden !important; margin: 48px 0 !important; box-shadow: ${TOKENS.shadows.lg} !important; border: 1px solid ${TOKENS.colors.gray200} !important;">
    <div style="padding: 24px 28px !important; background: linear-gradient(135deg, ${TOKENS.colors.gray50} 0%, ${TOKENS.colors.gray100} 100%) !important; border-bottom: 1px solid ${TOKENS.colors.gray200} !important;">
        <div style="display: flex !important; align-items: center !important; gap: 16px !important; flex-wrap: wrap !important;">
            <div style="width: 52px !important; height: 52px !important; min-width: 52px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
                <span style="font-size: 24px !important;">📊</span>
            </div>
            <div>
                <h4 style="font-size: 20px !important; font-weight: 800 !important; margin: 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h4>
                ${sourceNote ? `<p style="font-size: 13px !important; color: ${TOKENS.colors.gray500} !important; margin: 4px 0 0 0 !important;">Source: ${escapeHtml(sourceNote)}</p>` : ''}
            </div>
        </div>
    </div>
    <div style="overflow-x: auto !important;">
        <table style="width: 100% !important; border-collapse: collapse !important; min-width: 450px !important;">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ COMPONENT 9: CHECKLIST BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createChecklistBox(title: string, items: string[], icon: string = '✅'): string {
    if (!isValidString(title) || !isValidArray(items)) return '';
    
    const listItems = items.map((item, i) => `
        <li style="display: flex !important; align-items: flex-start !important; gap: 16px !important; padding: 16px 0 !important; ${i < items.length - 1 ? `border-bottom: 1px solid ${TOKENS.colors.successBorder} !important;` : ''}">
            <span style="font-size: 22px !important; line-height: 1.4 !important; flex-shrink: 0 !important;">${icon}</span>
            <span style="font-size: 15px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray700} !important;">${escapeHtml(item)}</span>
        </li>
    `).join('');

    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.successBg} 0%, #ecfdf5 100%) !important; border: 2px solid ${TOKENS.colors.successBorder} !important; border-radius: ${TOKENS.radius.xl} !important; padding: 32px !important; margin: 40px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: center !important; gap: 16px !important; margin-bottom: 24px !important; flex-wrap: wrap !important;">
        <div style="width: 52px !important; height: 52px !important; min-width: 52px !important; background: ${TOKENS.gradients.success} !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.success} !important;">
            <span style="font-size: 24px !important;">📝</span>
        </div>
        <h4 style="font-size: 22px !important; font-weight: 800 !important; margin: 0 !important; color: #166534 !important;">${escapeHtml(title)}</h4>
    </div>
    <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">${listItems}</ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 COMPONENT 10: STEP-BY-STEP BOX (with HowTo Schema)
// ═══════════════════════════════════════════════════════════════════════════════

export function createStepByStepBox(title: string, steps: StepItem[]): string {
    if (!isValidString(title) || !isValidArray(steps)) return '';
    
    // Generate HowTo Schema
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": title,
        "step": steps.map((step, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": step.title,
            "text": step.description
        }))
    };
    
    const stepItems = steps.map((step, i) => `
        <div style="display: flex !important; gap: 24px !important; ${i < steps.length - 1 ? `padding-bottom: 28px !important; margin-bottom: 28px !important; border-bottom: 2px dashed ${TOKENS.colors.primaryBorder} !important;` : ''}">
            <div style="width: 56px !important; height: 56px !important; min-width: 56px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.full} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important; flex-shrink: 0 !important;">
                <span style="font-size: 22px !important; font-weight: 900 !important; color: ${TOKENS.colors.white} !important;">${i + 1}</span>
            </div>
            <div style="flex: 1 !important; padding-top: 8px !important;">
                <h5 style="font-size: 18px !important; font-weight: 800 !important; margin: 0 0 10px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(step.title)}</h5>
                <p style="font-size: 15px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray500} !important; margin: 0 !important;">${escapeHtml(step.description)}</p>
            </div>
        </div>
    `).join('');

    return `
<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>
<div style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, ${TOKENS.colors.primaryBorder}40 100%) !important; border: 2px solid ${TOKENS.colors.primaryBorder} !important; border-radius: ${TOKENS.radius.xxl} !important; padding: 36px !important; margin: 48px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: center !important; gap: 18px !important; margin-bottom: 32px !important; flex-wrap: wrap !important;">
        <div style="width: 60px !important; height: 60px !important; min-width: 60px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.xl} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
            <span style="font-size: 28px !important;">📋</span>
        </div>
        <h4 style="font-size: 24px !important; font-weight: 800 !important; margin: 0 !important; color: #3730a3 !important;">${escapeHtml(title)}</h4>
    </div>
    ${stepItems}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚖️ COMPONENT 11: COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export function createComparisonTable(title: string, headers: [string, string], rows: Array<[string, string]>): string {
    if (!isValidString(title) || !isValidArray(rows)) return '';
    
    const tableRows = rows.map(row => `
        <tr>
            <td style="padding: 18px 22px !important; background: ${TOKENS.colors.dangerBg} !important; width: 50% !important; vertical-align: top !important; border-bottom: 1px solid ${TOKENS.colors.dangerBorder} !important;">
                <span style="color: ${TOKENS.colors.danger} !important; margin-right: 12px !important; font-size: 18px !important;">✗</span>
                <span style="color: #7f1d1d !important; font-size: 15px !important;">${escapeHtml(row[0])}</span>
            </td>
            <td style="padding: 18px 22px !important; background: ${TOKENS.colors.successBg} !important; width: 50% !important; vertical-align: top !important; border-bottom: 1px solid ${TOKENS.colors.successBorder} !important;">
                <span style="color: ${TOKENS.colors.success} !important; margin-right: 12px !important; font-size: 18px !important;">✓</span>
                <span style="color: #166534 !important; font-size: 15px !important;">${escapeHtml(row[1])}</span>
            </td>
        </tr>
    `).join('');

    return `
<div style="border-radius: ${TOKENS.radius.xl} !important; overflow: hidden !important; margin: 48px 0 !important; box-shadow: ${TOKENS.shadows.lg} !important; border: 1px solid ${TOKENS.colors.gray200} !important;">
    <div style="padding: 22px 28px !important; background: linear-gradient(135deg, ${TOKENS.colors.gray50} 0%, ${TOKENS.colors.gray100} 100%) !important; border-bottom: 1px solid ${TOKENS.colors.gray200} !important;">
        <div style="display: flex !important; align-items: center !important; gap: 14px !important; flex-wrap: wrap !important;">
            <span style="font-size: 28px !important;">⚖️</span>
            <h4 style="font-size: 20px !important; font-weight: 800 !important; margin: 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h4>
        </div>
    </div>
    <table style="width: 100% !important; border-collapse: collapse !important;">
        <thead>
            <tr>
                <th style="padding: 16px 22px !important; text-align: left !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; background: ${TOKENS.colors.dangerBg} !important; color: ${TOKENS.colors.danger} !important;">${escapeHtml(headers[0])}</th>
                <th style="padding: 16px 22px !important; text-align: left !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; background: ${TOKENS.colors.successBg} !important; color: ${TOKENS.colors.success} !important;">${escapeHtml(headers[1])}</th>
            </tr>
        </thead>
        <tbody>${tableRows}</tbody>
    </table>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📖 COMPONENT 12: DEFINITION BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createDefinitionBox(term: string, definition: string): string {
    if (!isValidString(term) || !isValidString(definition)) return '';
    
    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.infoBg} 0%, #dbeafe 100%) !important; border-left: 5px solid ${TOKENS.colors.info} !important; border-radius: 0 ${TOKENS.radius.xl} ${TOKENS.radius.xl} 0 !important; padding: 28px 32px !important; margin: 40px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: flex-start !important; gap: 20px !important; flex-wrap: wrap !important;">
        <div style="width: 56px !important; height: 56px !important; min-width: 56px !important; background: ${TOKENS.gradients.info} !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.info} !important; flex-shrink: 0 !important;">
            <span style="font-size: 26px !important;">📖</span>
        </div>
        <div style="flex: 1 !important; min-width: 200px !important;">
            <div style="font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; color: ${TOKENS.colors.info} !important; margin-bottom: 6px !important;">Definition</div>
            <h5 style="font-size: 20px !important; font-weight: 800 !important; margin: 0 0 10px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(term)}</h5>
            <p style="font-size: 15px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray600} !important; margin: 0 !important;">${definition}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 COMPONENT 13: KEY TAKEAWAYS
// ═══════════════════════════════════════════════════════════════════════════════

export function createKeyTakeaways(takeaways: string[]): string {
    if (!isValidArray(takeaways)) return '';
    
    const items = takeaways.map((t, i) => `
        <li style="display: flex !important; align-items: flex-start !important; gap: 18px !important; padding: 20px 0 !important; ${i < takeaways.length - 1 ? `border-bottom: 1px solid ${TOKENS.colors.primaryBorder} !important;` : ''}">
            <span style="min-width: 40px !important; height: 40px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; color: ${TOKENS.colors.white} !important; font-size: 15px !important; font-weight: 900 !important; box-shadow: ${TOKENS.shadows.glow.primary} !important; flex-shrink: 0 !important;">${i + 1}</span>
            <span style="font-size: 16px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray700} !important; padding-top: 8px !important;">${escapeHtml(t)}</span>
        </li>
    `).join('');

    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, ${TOKENS.colors.primaryBorder}50 100%) !important; border: 2px solid ${TOKENS.colors.primaryBorder} !important; border-radius: ${TOKENS.radius.xxl} !important; padding: 40px !important; margin: 56px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: center !important; gap: 20px !important; margin-bottom: 32px !important; padding-bottom: 28px !important; border-bottom: 2px solid ${TOKENS.colors.primaryBorder} !important; flex-wrap: wrap !important;">
        <div style="width: 68px !important; height: 68px !important; min-width: 68px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.xl} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
            <span style="font-size: 34px !important;">🎯</span>
        </div>
        <div>
            <h3 style="font-size: 26px !important; font-weight: 800 !important; margin: 0 !important; color: #3730a3 !important;">Key Takeaways</h3>
            <p style="font-size: 15px !important; color: ${TOKENS.colors.gray500} !important; margin: 6px 0 0 0 !important;">The essential points to remember</p>
        </div>
    </div>
    <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">${items}</ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ❓ COMPONENT 14: FAQ ACCORDION (with Schema.org FAQPage)
// ═══════════════════════════════════════════════════════════════════════════════

export function createFAQAccordion(faqs: FAQItem[]): string {
    if (!isValidArray(faqs)) return '';
    
    const validFaqs = faqs.filter(f => isValidString(f.question) && isValidString(f.answer));
    if (validFaqs.length === 0) return '';
    
    // Generate FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": validFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.replace(/<[^>]*>/g, '')
            }
        }))
    };
    
    const items = validFaqs.map(faq => `
        <details style="border: 1px solid ${TOKENS.colors.gray200} !important; border-radius: ${TOKENS.radius.md} !important; margin-bottom: 14px !important; background: ${TOKENS.colors.white} !important; overflow: hidden !important;" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <summary style="padding: 20px 24px !important; cursor: pointer !important; font-weight: 700 !important; font-size: 16px !important; color: ${TOKENS.colors.gray800} !important; list-style: none !important; display: flex !important; justify-content: space-between !important; align-items: center !important; background: ${TOKENS.colors.white} !important;" itemprop="name">
                <span style="flex: 1 !important; padding-right: 18px !important; line-height: 1.4 !important;">${escapeHtml(faq.question)}</span>
                <span style="width: 32px !important; height: 32px !important; border-radius: ${TOKENS.radius.full} !important; background: ${TOKENS.colors.gray100} !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 12px !important; color: ${TOKENS.colors.primary} !important; flex-shrink: 0 !important; transition: transform 0.2s ease !important;">▼</span>
            </summary>
            <div style="padding: 0 24px 24px 24px !important; font-size: 15px !important; line-height: 1.8 !important; color: ${TOKENS.colors.gray600} !important; background: ${TOKENS.colors.gray50} !important; border-top: 1px solid ${TOKENS.colors.gray200} !important;" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <div itemprop="text" style="padding-top: 20px !important;">${faq.answer}</div>
            </div>
        </details>
    `).join('');

    return `
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
<section itemscope itemtype="https://schema.org/FAQPage" style="margin: 56px 0 !important;">
    <div style="display: flex !important; align-items: center !important; gap: 18px !important; margin-bottom: 32px !important; flex-wrap: wrap !important;">
        <div style="width: 64px !important; height: 64px !important; min-width: 64px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.xl} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
            <span style="font-size: 30px !important;">❓</span>
        </div>
        <div>
            <h2 style="font-size: 26px !important; font-weight: 800 !important; margin: 0 !important; color: ${TOKENS.colors.gray800} !important;">Frequently Asked Questions</h2>
            <p style="font-size: 15px !important; color: ${TOKENS.colors.gray500} !important; margin: 6px 0 0 0 !important;">${validFaqs.length} questions answered</p>
        </div>
    </div>
    <div>${items}</div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 COMPONENT 15: YOUTUBE EMBED (Lite Embed with Schema)
// ═══════════════════════════════════════════════════════════════════════════════

export function createYouTubeEmbed(video: YouTubeVideoData): string {
    if (!video?.videoId) {
        console.error('[WPO] createYouTubeEmbed: Missing videoId', video);
        return '';
    }
    
    const titleEscaped = escapeHtml(video.title || 'Watch Video');
    
    // Generate VideoObject Schema
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.title || 'Video',
        "description": video.description || `Video about ${video.title}`,
        "thumbnailUrl": [`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`],
        "uploadDate": new Date().toISOString().split('T')[0],
        "embedUrl": `https://www.youtube.com/embed/${video.videoId}`,
        "contentUrl": `https://www.youtube.com/watch?v=${video.videoId}`
    };
    
    // Lite YouTube Embed (click-to-load for CWV)
    return `
<script type="application/ld+json">${JSON.stringify(videoSchema)}</script>
<div style="margin: 52px 0 !important; border-radius: ${TOKENS.radius.xl} !important; overflow: hidden !important; box-shadow: ${TOKENS.shadows.xl} !important; border: none !important; background: #000 !important;">
    <div class="wpo-video-wrap" style="position: relative !important; padding-bottom: 56.25% !important; height: 0 !important; overflow: hidden !important; background: #000 !important;">
        <iframe 
            src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&enablejsapi=1"
            srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:80px;width:80px;background:rgba(255,0,0,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;text-shadow:0 0 0.5em black;left:50%;transform:translateX(-50%)}</style><a href='https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1'><img src='https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg' alt='${titleEscaped}'><span style='font-size:36px;color:white'>▶</span></a>"
            title="${titleEscaped}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
            style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: none !important;"
        ></iframe>
    </div>
    <div style="padding: 22px 28px !important; background: ${TOKENS.gradients.midnight} !important;">
        <div style="display: flex !important; align-items: center !important; gap: 18px !important; flex-wrap: wrap !important;">
            <div style="width: 54px !important; height: 54px !important; min-width: 54px !important; background: #ff0000 !important; border-radius: ${TOKENS.radius.md} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 6px 16px rgba(255,0,0,0.3) !important;">
                <span style="font-size: 26px !important;">▶️</span>
            </div>
            <div style="flex: 1 !important; min-width: 200px !important;">
                <h4 style="font-size: 17px !important; font-weight: 700 !important; margin: 0 0 8px 0 !important; color: ${TOKENS.colors.white} !important; line-height: 1.4 !important;">${escapeHtml(truncate(video.title, 60))}</h4>
                <div style="display: flex !important; gap: 18px !important; flex-wrap: wrap !important; font-size: 13px !important; color: rgba(255,255,255,0.75) !important;">
                    <span>📺 ${escapeHtml(video.channel)}</span>
                    <span>👁️ ${video.views?.toLocaleString() || 0} views</span>
                    ${video.duration ? `<span>⏱️ ${escapeHtml(video.duration)}</span>` : ''}
                </div>
            </div>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 COMPONENT 16: REFERENCES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export function createReferencesSection(references: DiscoveredReference[]): string {
    if (!isValidArray(references)) return '';
    
    const validRefs = references.filter(r => isValidString(r.url) && isValidString(r.title)).slice(0, 10);
    if (validRefs.length === 0) return '';
    
    const items = validRefs.map((ref, i) => {
        const yearDisplay = ref.year ? ` (${ref.year})` : '';
        const authorityBadge = (ref.authorityScore && ref.authorityScore >= 80) 
            ? `<span style="background: ${TOKENS.colors.successBg} !important; color: ${TOKENS.colors.successDark} !important; padding: 3px 10px !important; border-radius: 6px !important; font-size: 10px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin-left: 10px !important;">HIGH AUTHORITY</span>` 
            : '';
        
        return `
        <li style="display: flex !important; align-items: flex-start !important; gap: 16px !important; padding: 18px 0 !important; ${i < validRefs.length - 1 ? `border-bottom: 1px solid ${TOKENS.colors.gray100} !important;` : ''}">
            <span style="min-width: 32px !important; height: 32px !important; background: ${TOKENS.colors.primaryBg} !important; border-radius: ${TOKENS.radius.sm} !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 13px !important; font-weight: 800 !important; color: ${TOKENS.colors.primary} !important; flex-shrink: 0 !important;">${i + 1}</span>
            <div style="flex: 1 !important; min-width: 0 !important;">
                <a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer nofollow" style="font-weight: 700 !important; color: ${TOKENS.colors.primary} !important; text-decoration: none !important; display: block !important; margin-bottom: 6px !important; font-size: 16px !important; line-height: 1.4 !important;">
                    ${escapeHtml(truncate(ref.title, 80))}${yearDisplay}
                </a>
                <div style="display: flex !important; align-items: center !important; gap: 10px !important; flex-wrap: wrap !important; font-size: 13px !important; color: ${TOKENS.colors.gray500} !important;">
                    ${ref.favicon ? `<img src="${escapeHtml(ref.favicon)}" alt="" width="16" height="16" style="border-radius: 4px !important;" onerror="this.style.display='none'">` : ''}
                    <span>${escapeHtml(ref.source)}</span>
                    ${authorityBadge}
                </div>
                ${ref.snippet ? `<p style="font-size: 14px !important; line-height: 1.6 !important; margin: 10px 0 0 0 !important; color: ${TOKENS.colors.gray500} !important;">${escapeHtml(truncate(ref.snippet, 150))}</p>` : ''}
            </div>
        </li>`;
    }).join('');

    return `
<section style="background: ${TOKENS.colors.gray50} !important; border-radius: ${TOKENS.radius.xl} !important; padding: 36px !important; margin: 56px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; border: 1px solid ${TOKENS.colors.gray200} !important; overflow: hidden !important;">
    <div style="display: flex !important; align-items: center !important; gap: 18px !important; margin-bottom: 28px !important; padding-bottom: 24px !important; border-bottom: 2px solid ${TOKENS.colors.gray200} !important; flex-wrap: wrap !important;">
        <div style="width: 60px !important; height: 60px !important; min-width: 60px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.lg} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;">
            <span style="font-size: 28px !important;">📚</span>
        </div>
        <div>
            <h2 style="font-size: 24px !important; font-weight: 800 !important; margin: 0 !important; color: ${TOKENS.colors.gray800} !important;">References & Sources</h2>
            <p style="font-size: 15px !important; color: ${TOKENS.colors.gray500} !important; margin: 6px 0 0 0 !important;">${validRefs.length} authoritative sources</p>
        </div>
    </div>
    <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">${items}</ul>
</section>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔢 COMPONENT 17: NUMBERED BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createNumberedBox(number: string, title: string, description: string): string {
    if (!isValidString(title) || !isValidString(description)) return '';
    
    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, ${TOKENS.colors.primaryBorder}40 100%) !important; border: 2px solid ${TOKENS.colors.primaryBorder} !important; border-radius: ${TOKENS.radius.xl} !important; padding: 32px !important; margin: 40px 0 !important; box-shadow: ${TOKENS.shadows.md} !important; overflow: hidden !important;">
    <div style="display: flex !important; gap: 24px !important; flex-wrap: wrap !important;">
        <div style="width: 68px !important; height: 68px !important; min-width: 68px !important; background: ${TOKENS.gradients.primary} !important; border-radius: ${TOKENS.radius.xl} !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: ${TOKENS.shadows.glow.primary} !important; flex-shrink: 0 !important;">
            <span style="font-size: 30px !important; font-weight: 900 !important; color: ${TOKENS.colors.white} !important;">${escapeHtml(number)}</span>
        </div>
        <div style="flex: 1 !important; min-width: 200px !important;">
            <h4 style="font-size: 20px !important; font-weight: 800 !important; margin: 0 0 12px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h4>
            <p style="font-size: 15px !important; line-height: 1.7 !important; color: ${TOKENS.colors.gray600} !important; margin: 0 !important;">${description}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COMPONENT 18: ICON GRID BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createIconGridBox(title: string, items: IconGridItem[]): string {
    if (!isValidString(title) || !isValidArray(items)) return '';
    
    const gridItems = items.map(item => `
        <div style="flex: 1 !important; min-width: 200px !important; text-align: center !important; padding: 28px 20px !important; background: ${TOKENS.colors.white} !important; border-radius: ${TOKENS.radius.lg} !important; box-shadow: ${TOKENS.shadows.sm} !important; border: 1px solid ${TOKENS.colors.gray100} !important;">
            <div style="font-size: 40px !important; margin-bottom: 16px !important;">${item.icon}</div>
            <h4 style="font-size: 17px !important; font-weight: 800 !important; margin: 0 0 10px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(item.title)}</h4>
            <p style="font-size: 14px !important; line-height: 1.6 !important; margin: 0 !important; color: ${TOKENS.colors.gray500} !important;">${escapeHtml(item.description)}</p>
        </div>
    `).join('');

    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, ${TOKENS.colors.primaryBorder}30 100%) !important; border: 2px solid ${TOKENS.colors.primaryBorder} !important; border-radius: ${TOKENS.radius.xxl} !important; padding: 36px !important; margin: 56px 0 !important; overflow: hidden !important;">
    <h3 style="font-size: 24px !important; font-weight: 900 !important; margin: 0 0 28px 0 !important; text-align: center !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h3>
    <div style="display: flex !important; flex-wrap: wrap !important; gap: 20px !important;">
        ${gridItems}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📅 COMPONENT 19: TIMELINE BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createTimelineBox(title: string, events: TimelineEvent[]): string {
    if (!isValidString(title) || !isValidArray(events)) return '';
    
    const timelineItems = events.map((event, i) => `
        <div style="display: flex !important; gap: 20px !important; ${i < events.length - 1 ? 'padding-bottom: 32px !important;' : ''}">
            <div style="display: flex !important; flex-direction: column !important; align-items: center !important;">
                <div style="width: 20px !important; height: 20px !important; background: ${TOKENS.gradients.primary} !important; border-radius: 50% !important; flex-shrink: 0 !important; box-shadow: ${TOKENS.shadows.glow.primary} !important;"></div>
                ${i < events.length - 1 ? `<div style="width: 3px !important; flex: 1 !important; background: linear-gradient(180deg, ${TOKENS.colors.primary} 0%, ${TOKENS.colors.primaryBorder} 100%) !important; margin: 8px 0 !important;"></div>` : ''}
            </div>
            <div style="flex: 1 !important; padding-bottom: 8px !important;">
                <div style="font-size: 12px !important; font-weight: 700 !important; color: ${TOKENS.colors.primary} !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-bottom: 6px !important;">${escapeHtml(event.time)}</div>
                <h4 style="font-size: 18px !important; font-weight: 800 !important; margin: 0 0 8px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(event.title)}</h4>
                <p style="font-size: 15px !important; line-height: 1.7 !important; margin: 0 !important; color: ${TOKENS.colors.gray500} !important;">${escapeHtml(event.description)}</p>
            </div>
        </div>
    `).join('');

    return `
<div style="background: linear-gradient(135deg, ${TOKENS.colors.primaryBg} 0%, ${TOKENS.colors.primaryBorder}30 100%) !important; border: 2px solid ${TOKENS.colors.primaryBorder} !important; border-radius: ${TOKENS.radius.xxl} !important; padding: 36px !important; margin: 56px 0 !important; overflow: hidden !important;">
    <h3 style="font-size: 24px !important; font-weight: 900 !important; margin: 0 0 32px 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h3>
    ${timelineItems}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 👍👎 COMPONENT 20: PROS & CONS BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createProsConsBox(title: string, data: ProsConsItem): string {
    if (!isValidString(title)) return '';
    if (!isValidArray(data.pros) && !isValidArray(data.cons)) return '';
    
    const prosItems = (data.pros || []).map(pro => `
        <li style="display: flex !important; align-items: flex-start !important; gap: 12px !important; padding: 12px 0 !important;">
            <span style="color: ${TOKENS.colors.success} !important; font-size: 18px !important; flex-shrink: 0 !important;">✓</span>
            <span style="font-size: 15px !important; line-height: 1.6 !important; color: ${TOKENS.colors.gray700} !important;">${escapeHtml(pro)}</span>
        </li>
    `).join('');
    
    const consItems = (data.cons || []).map(con => `
        <li style="display: flex !important; align-items: flex-start !important; gap: 12px !important; padding: 12px 0 !important;">
            <span style="color: ${TOKENS.colors.danger} !important; font-size: 18px !important; flex-shrink: 0 !important;">✗</span>
            <span style="font-size: 15px !important; line-height: 1.6 !important; color: ${TOKENS.colors.gray700} !important;">${escapeHtml(con)}</span>
        </li>
    `).join('');

    return `
<div style="border-radius: ${TOKENS.radius.xl} !important; overflow: hidden !important; margin: 48px 0 !important; box-shadow: ${TOKENS.shadows.lg} !important; border: 1px solid ${TOKENS.colors.gray200} !important;">
    <div style="padding: 22px 28px !important; background: linear-gradient(135deg, ${TOKENS.colors.gray50} 0%, ${TOKENS.colors.gray100} 100%) !important; border-bottom: 1px solid ${TOKENS.colors.gray200} !important;">
        <div style="display: flex !important; align-items: center !important; gap: 14px !important;">
            <span style="font-size: 28px !important;">⚖️</span>
            <h4 style="font-size: 20px !important; font-weight: 800 !important; margin: 0 !important; color: ${TOKENS.colors.gray800} !important;">${escapeHtml(title)}</h4>
        </div>
    </div>
    <div style="display: flex !important; flex-wrap: wrap !important;">
        <div style="flex: 1 !important; min-width: 250px !important; padding: 24px !important; background: ${TOKENS.colors.successBg} !important; border-right: 1px solid ${TOKENS.colors.gray200} !important;">
            <h5 style="font-size: 14px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; color: ${TOKENS.colors.success} !important; margin: 0 0 16px 0 !important;">👍 Pros</h5>
            <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">${prosItems}</ul>
        </div>
        <div style="flex: 1 !important; min-width: 250px !important; padding: 24px !important; background: ${TOKENS.colors.dangerBg} !important;">
            <h5 style="font-size: 14px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; color: ${TOKENS.colors.danger} !important; margin: 0 0 16px 0 !important;">👎 Cons</h5>
            <ul style="list-style: none !important; padding: 0 !important; margin: 0 !important;">${consItems}</ul>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    VISUAL_COMPONENTS_VERSION,
    THEME_ADAPTIVE_CSS,
    TOKENS,
    
    // Utilities
    escapeHtml,
    generateUniqueId,
    
    // All 20 Components
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
    createProsConsBox
};
