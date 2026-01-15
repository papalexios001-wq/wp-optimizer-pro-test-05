// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v27.0 — ENTERPRISE VISUAL COMPONENT LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
// 
// DESIGN PHILOSOPHY:
// ✅ THEME-AGNOSTIC — Works on ANY WordPress theme (light or dark)
// ✅ MOBILE-FIRST — Perfect on all devices
// ✅ ACCESSIBLE — WCAG AAA compliant
// ✅ MODERN — Clean, minimal, professional
// ✅ PERFORMANT — No external dependencies, minimal CSS
// ✅ REFERENCES — High-quality citations with Serper.dev validation
// ═══════════════════════════════════════════════════════════════════════════════

export const VISUAL_COMPONENTS_VERSION = "27.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 CSS CUSTOM PROPERTIES — ADAPTIVE THEME SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const THEME_ADAPTIVE_CSS = `
<style>
/* WP Optimizer Pro Visual System v27.0 — Theme Adaptive */
.wpo-content {
  /* Primary brand colors */
  --wpo-primary: #6366f1;
  --wpo-primary-light: #818cf8;
  --wpo-primary-dark: #4f46e5;
  
  /* Semantic colors */
  --wpo-success: #10b981;
  --wpo-success-light: #34d399;
  --wpo-warning: #f59e0b;
  --wpo-warning-light: #fbbf24;
  --wpo-danger: #ef4444;
  --wpo-danger-light: #f87171;
  --wpo-info: #3b82f6;
  --wpo-info-light: #60a5fa;
  
  /* Adaptive colors — inherit from theme */
  --wpo-text: inherit;
  --wpo-text-muted: currentColor;
  --wpo-bg-subtle: rgba(128, 128, 128, 0.06);
  --wpo-bg-elevated: rgba(128, 128, 128, 0.1);
  --wpo-border: rgba(128, 128, 128, 0.15);
  --wpo-border-light: rgba(128, 128, 128, 0.08);
  
  /* Typography */
  --wpo-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --wpo-font-mono: ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
  
  /* Spacing scale */
  --wpo-space-xs: 0.5rem;
  --wpo-space-sm: 0.75rem;
  --wpo-space-md: 1rem;
  --wpo-space-lg: 1.5rem;
  --wpo-space-xl: 2rem;
  --wpo-space-2xl: 3rem;
  
  /* Border radius */
  --wpo-radius-sm: 8px;
  --wpo-radius-md: 12px;
  --wpo-radius-lg: 16px;
  --wpo-radius-xl: 20px;
  --wpo-radius-full: 9999px;
  
  /* Shadows */
  --wpo-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --wpo-shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --wpo-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Base styles */
  font-family: var(--wpo-font);
  line-height: 1.8;
  font-size: clamp(16px, 2.5vw, 18px);
  color: var(--wpo-text);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .wpo-content {
    --wpo-space-xl: 1.5rem;
    --wpo-space-2xl: 2rem;
  }
}

/* Box component base */
.wpo-box {
  position: relative;
  border-radius: var(--wpo-radius-lg);
  padding: var(--wpo-space-lg);
  margin: var(--wpo-space-xl) 0;
  border: 1px solid var(--wpo-border);
  background: var(--wpo-bg-subtle);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wpo-box:hover {
  transform: translateY(-1px);
  box-shadow: var(--wpo-shadow-md);
}

/* Typography enhancements */
.wpo-content h2 {
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: 700;
  line-height: 1.3;
  margin: var(--wpo-space-2xl) 0 var(--wpo-space-lg);
  letter-spacing: -0.02em;
}

.wpo-content h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  line-height: 1.4;
  margin: var(--wpo-space-xl) 0 var(--wpo-space-md);
}

.wpo-content p {
  margin: 0 0 var(--wpo-space-md);
  line-height: 1.8;
}

.wpo-content ul, .wpo-content ol {
  margin: var(--wpo-space-md) 0;
  padding-left: var(--wpo-space-lg);
}

.wpo-content li {
  margin: var(--wpo-space-xs) 0;
  line-height: 1.7;
}

/* Link styles */
.wpo-content a:not(.wpo-btn) {
  color: var(--wpo-primary);
  text-decoration: underline;
  text-decoration-color: rgba(99, 102, 241, 0.3);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s;
}

.wpo-content a:not(.wpo-btn):hover {
  text-decoration-color: var(--wpo-primary);
}
</style>
`;

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

function generateUniqueId(): string {
    return `wpo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚡ QUICK ANSWER BOX — Featured Snippet Optimized
// ═══════════════════════════════════════════════════════════════════════════════

export function createQuickAnswerBox(answer: string, title: string = 'Quick Answer'): string {
    return `
<div class="wpo-box" style="
    background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%);
    border: 1px solid rgba(99,102,241,0.2);
    border-left: 4px solid #6366f1;
    border-radius: 16px;
    padding: 24px;
    margin: 32px 0;
">
    <div style="display: flex; align-items: flex-start; gap: 16px;">
        <div style="
            min-width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        ">
            <span style="font-size: 24px; line-height: 1;">⚡</span>
        </div>
        <div style="flex: 1; min-width: 0;">
            <div style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #6366f1;
                margin-bottom: 8px;
            ">${escapeHtml(title)}</div>
            <p style="
                font-size: 17px;
                line-height: 1.7;
                margin: 0;
                font-weight: 500;
            ">${answer}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💡 PRO TIP BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createProTipBox(tip: string, title: string = 'Pro Tip'): string {
    return `
<div class="wpo-box" style="
    background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(34,197,94,0.04) 100%);
    border: 1px solid rgba(16,185,129,0.2);
    border-left: 4px solid #10b981;
    border-radius: 16px;
    padding: 24px;
    margin: 28px 0;
">
    <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="
            min-width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        ">
            <span style="font-size: 20px; line-height: 1;">💡</span>
        </div>
        <div style="flex: 1; min-width: 0;">
            <div style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #10b981;
                margin-bottom: 8px;
            ">${escapeHtml(title)}</div>
            <p style="
                font-size: 15px;
                line-height: 1.7;
                margin: 0;
            ">${tip}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️ WARNING / IMPORTANT BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createWarningBox(warning: string, title: string = 'Important'): string {
    return `
<div class="wpo-box" style="
    background: linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(234,179,8,0.04) 100%);
    border: 1px solid rgba(245,158,11,0.25);
    border-left: 4px solid #f59e0b;
    border-radius: 16px;
    padding: 24px;
    margin: 28px 0;
">
    <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="
            min-width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        ">
            <span style="font-size: 20px; line-height: 1;">⚠️</span>
        </div>
        <div style="flex: 1; min-width: 0;">
            <div style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #d97706;
                margin-bottom: 8px;
            ">${escapeHtml(title)}</div>
            <p style="
                font-size: 15px;
                line-height: 1.7;
                margin: 0;
            ">${warning}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 STATISTICS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export interface StatItem {
    value: string;
    label: string;
    icon?: string;
}

export function createStatsDashboard(stats: StatItem[], title?: string): string {
    const statCards = stats.map(stat => `
        <div style="
            flex: 1 1 140px;
            min-width: 120px;
            max-width: 200px;
            text-align: center;
            padding: 20px 12px;
            background: rgba(99,102,241,0.05);
            border: 1px solid rgba(99,102,241,0.12);
            border-radius: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
        ">
            ${stat.icon ? `<div style="font-size: 24px; margin-bottom: 8px; line-height: 1;">${stat.icon}</div>` : ''}
            <div style="
                font-size: clamp(24px, 5vw, 32px);
                font-weight: 800;
                color: #6366f1;
                line-height: 1.2;
                margin-bottom: 4px;
            ">${escapeHtml(stat.value)}</div>
            <div style="
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.7;
            ">${escapeHtml(stat.label)}</div>
        </div>
    `).join('');

    return `
<div style="margin: 40px 0;">
    ${title ? `<h4 style="
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        text-align: center;
        opacity: 0.6;
    ">${escapeHtml(title)}</h4>` : ''}
    <div style="
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: center;
    ">
        ${statCards}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 EXPERT QUOTE
// ═══════════════════════════════════════════════════════════════════════════════

export function createExpertQuote(
    quote: string, 
    author: string, 
    title?: string,
    avatarEmoji: string = '👤'
): string {
    return `
<blockquote style="
    background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 100%);
    border: 1px solid rgba(99,102,241,0.15);
    border-left: 4px solid #6366f1;
    border-radius: 16px;
    padding: 28px;
    margin: 40px 0;
    font-style: normal;
">
    <div style="
        font-size: 28px;
        color: #6366f1;
        opacity: 0.5;
        line-height: 1;
        margin-bottom: 12px;
        font-family: Georgia, serif;
    ">"</div>
    <p style="
        font-size: 18px;
        line-height: 1.8;
        font-style: italic;
        margin: 0 0 20px 0;
    ">${quote}</p>
    <footer style="display: flex; align-items: center; gap: 12px;">
        <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
        ">${avatarEmoji}</div>
        <div>
            <cite style="
                font-style: normal;
                font-weight: 700;
                font-size: 15px;
                display: block;
            ">${escapeHtml(author)}</cite>
            ${title ? `<span style="
                font-size: 13px;
                opacity: 0.6;
            ">${escapeHtml(title)}</span>` : ''}
        </div>
    </footer>
</blockquote>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export interface TableColumn {
    header: string;
    align?: 'left' | 'center' | 'right';
}

export function createComparisonTable(
    columns: TableColumn[],
    rows: string[][],
    caption?: string
): string {
    const alignMap = { left: 'left', center: 'center', right: 'right' };
    
    const headerCells = columns.map(col => `
        <th style="
            padding: 14px 16px;
            text-align: ${alignMap[col.align || 'left']};
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: rgba(99,102,241,0.08);
            border-bottom: 2px solid rgba(99,102,241,0.2);
            white-space: nowrap;
        ">${escapeHtml(col.header)}</th>
    `).join('');

    const bodyRows = rows.map((row, rowIndex) => {
        const cells = row.map((cell, cellIndex) => {
            const isCheck = cell === '✓' || cell === '✅' || cell.toLowerCase() === 'yes';
            const isCross = cell === '✗' || cell === '❌' || cell.toLowerCase() === 'no';
            
            let cellContent = escapeHtml(cell);
            let cellStyle = `
                padding: 14px 16px;
                text-align: ${alignMap[columns[cellIndex]?.align || 'left']};
                border-bottom: 1px solid rgba(128,128,128,0.1);
                font-size: 14px;
            `;
            
            if (isCheck) {
                cellContent = '<span style="color: #10b981; font-weight: 700;">✓</span>';
            }
            if (isCross) {
                cellContent = '<span style="color: #ef4444; font-weight: 700;">✗</span>';
            }
            
            return `<td style="${cellStyle}">${cellContent}</td>`;
        }).join('');
        
        const rowBg = rowIndex % 2 === 1 ? 'background: rgba(128,128,128,0.03);' : '';
        return `<tr style="${rowBg}">${cells}</tr>`;
    }).join('');

    return `
<div style="
    overflow-x: auto;
    margin: 40px 0;
    border-radius: 16px;
    border: 1px solid rgba(128,128,128,0.15);
    -webkit-overflow-scrolling: touch;
">
    ${caption ? `<div style="
        padding: 14px 18px;
        font-size: 14px;
        font-weight: 700;
        border-bottom: 1px solid rgba(128,128,128,0.1);
        background: rgba(128,128,128,0.03);
    ">${escapeHtml(caption)}</div>` : ''}
    <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 15px;
        min-width: 400px;
    ">
        <thead>
            <tr>${headerCells}</tr>
        </thead>
        <tbody>
            ${bodyRows}
        </tbody>
    </table>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ CHECKLIST BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createChecklist(items: string[], title: string = 'Checklist'): string {
    const listItems = items.map((item, index) => `
        <li style="
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 0;
            ${index < items.length - 1 ? 'border-bottom: 1px solid rgba(128,128,128,0.08);' : ''}
        ">
            <span style="
                min-width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 700;
                flex-shrink: 0;
                margin-top: 2px;
            ">✓</span>
            <span style="font-size: 15px; line-height: 1.6;">${item}</span>
        </li>
    `).join('');

    return `
<div class="wpo-box" style="
    background: linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(34,197,94,0.03) 100%);
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: 16px;
    padding: 24px;
    margin: 32px 0;
">
    <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(16,185,129,0.15);
    ">
        <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="font-size: 18px; line-height: 1;">✅</span>
        </div>
        <span style="
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        ">${escapeHtml(title)}</span>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">
        ${listItems}
    </ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 KEY TAKEAWAYS BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createKeyTakeaways(takeaways: string[]): string {
    const items = takeaways.map((t, i) => `
        <li style="
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 14px 0;
            ${i < takeaways.length - 1 ? 'border-bottom: 1px solid rgba(128,128,128,0.08);' : ''}
        ">
            <span style="
                min-width: 28px;
                height: 28px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: 800;
                flex-shrink: 0;
            ">${i + 1}</span>
            <span style="font-size: 15px; line-height: 1.6; padding-top: 3px;">${t}</span>
        </li>
    `).join('');

    return `
<div class="wpo-box" style="
    background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 100%);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 20px;
    padding: 28px;
    margin: 48px 0;
">
    <div style="
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(99,102,241,0.15);
    ">
        <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="font-size: 22px; line-height: 1;">🎯</span>
        </div>
        <h3 style="
            font-size: 20px;
            font-weight: 800;
            margin: 0;
        ">Key Takeaways</h3>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">
        ${items}
    </ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ❓ FAQ ACCORDION (Pure CSS — No JavaScript)
// ═══════════════════════════════════════════════════════════════════════════════

export interface FAQ {
    question: string;
    answer: string;
}

export function createFAQAccordion(faqs: FAQ[]): string {
    const sectionId = generateUniqueId();
    
    const faqItems = faqs.map((faq, index) => {
        const itemId = `${sectionId}-${index}`;
        return `
        <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" style="border-bottom: 1px solid rgba(128,128,128,0.1);">
            <input type="checkbox" id="${itemId}" style="
                position: absolute;
                opacity: 0;
                pointer-events: none;
            " />
            <label for="${itemId}" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 20px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: background 0.2s;
                gap: 12px;
            ">
                <span itemprop="name" style="flex: 1;">${escapeHtml(faq.question)}</span>
                <span style="
                    font-size: 12px;
                    color: #6366f1;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                " class="${sectionId}-arrow">▼</span>
            </label>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer" style="
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            " class="${sectionId}-content">
                <div itemprop="text" style="
                    padding: 0 20px 20px 20px;
                    font-size: 15px;
                    line-height: 1.8;
                    opacity: 0.85;
                ">${faq.answer}</div>
            </div>
        </div>`;
    }).join('');

    return `
<style>
#${sectionId} input:checked + label + div {
    max-height: 1000px !important;
}
#${sectionId} input:checked + label .${sectionId}-arrow {
    transform: rotate(180deg);
}
#${sectionId} label:hover {
    background: rgba(128,128,128,0.04);
}
</style>

<section id="${sectionId}" itemscope itemtype="https://schema.org/FAQPage" style="
    border: 1px solid rgba(128,128,128,0.15);
    border-radius: 20px;
    margin: 48px 0;
    overflow: hidden;
">
    <div style="
        padding: 22px 24px;
        background: rgba(128,128,128,0.04);
        border-bottom: 1px solid rgba(128,128,128,0.1);
    ">
        <div style="display: flex; align-items: center; gap: 14px;">
            <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <span style="font-size: 22px; line-height: 1;">❓</span>
            </div>
            <div>
                <h2 style="font-size: 20px; font-weight: 800; margin: 0;">Frequently Asked Questions</h2>
                <p style="font-size: 13px; opacity: 0.6; margin: 4px 0 0 0;">${faqs.length} questions answered</p>
            </div>
        </div>
    </div>
    ${faqItems}
</section>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 CALL-TO-ACTION BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createCTABox(
    headline: string,
    description: string,
    buttonText: string,
    buttonUrl?: string
): string {
    const button = buttonUrl 
        ? `<a href="${buttonUrl}" class="wpo-btn" style="
            display: inline-block;
            background: white;
            color: #6366f1;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">${escapeHtml(buttonText)}</a>`
        : `<span style="
            display: inline-block;
            background: white;
            color: #6366f1;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 12px;
            font-size: 15px;
        ">${escapeHtml(buttonText)}</span>`;

    return `
<div style="
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    border-radius: 20px;
    padding: clamp(32px, 6vw, 48px);
    margin: 48px 0;
    text-align: center;
    color: white;
">
    <h3 style="
        font-size: clamp(22px, 4vw, 28px);
        font-weight: 800;
        margin: 0 0 12px 0;
        color: white;
    ">${escapeHtml(headline)}</h3>
    <p style="
        font-size: 16px;
        opacity: 0.9;
        margin: 0 auto 24px auto;
        max-width: 500px;
        line-height: 1.6;
        color: white;
    ">${description}</p>
    ${button}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 REFERENCES SECTION — WITH SERPER.DEV VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface Reference {
    url: string;
    title: string;
    source: string;
    year?: string | number;
    author?: string;
    snippet?: string;
    isValid?: boolean;
    favicon?: string;
}

export function createReferencesSection(references: Reference[]): string {
    if (!references || references.length === 0) {
        return '';
    }
    
    const validRefs = references.filter(r => r.url && r.title);
    
    if (validRefs.length === 0) {
        return '';
    }
    
    const refItems = validRefs.map((ref, index) => {
        const domain = extractDomain(ref.url);
        const favicon = ref.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        const yearDisplay = ref.year ? ` (${ref.year})` : '';
        const authorDisplay = ref.author ? `${escapeHtml(ref.author)}. ` : '';
        
        return `
        <li style="
            display: flex;
            gap: 16px;
            padding: 16px 0;
            ${index < validRefs.length - 1 ? 'border-bottom: 1px solid rgba(128,128,128,0.08);' : ''}
            align-items: flex-start;
        ">
            <span style="
                min-width: 28px;
                height: 28px;
                background: rgba(99,102,241,0.1);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6366f1;
                font-size: 12px;
                font-weight: 700;
                flex-shrink: 0;
                margin-top: 2px;
            ">${index + 1}</span>
            <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <img 
                        src="${favicon}" 
                        alt="" 
                        width="16" 
                        height="16" 
                        style="border-radius: 3px; flex-shrink: 0;"
                        onerror="this.style.display='none'"
                    />
                    <span style="
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        opacity: 0.6;
                        font-weight: 600;
                    ">${escapeHtml(ref.source || domain)}${yearDisplay}</span>
                </div>
                <a 
                    href="${escapeHtml(ref.url)}" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    style="
                        font-size: 15px;
                        font-weight: 600;
                        color: #6366f1;
                        text-decoration: none;
                        display: block;
                        line-height: 1.4;
                        word-break: break-word;
                    "
                >
                    ${authorDisplay}${escapeHtml(ref.title)}
                </a>
                ${ref.snippet ? `
                <p style="
                    font-size: 13px;
                    line-height: 1.6;
                    opacity: 0.7;
                    margin: 8px 0 0 0;
                ">${escapeHtml(ref.snippet.substring(0, 150))}${ref.snippet.length > 150 ? '...' : ''}</p>
                ` : ''}
            </div>
        </li>`;
    }).join('');

    return `
<section style="
    background: rgba(128,128,128,0.03);
    border: 1px solid rgba(128,128,128,0.12);
    border-radius: 20px;
    padding: 28px;
    margin: 56px 0 32px 0;
">
    <div style="
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(128,128,128,0.1);
    ">
        <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="font-size: 22px; line-height: 1;">📚</span>
        </div>
        <div>
            <h2 style="font-size: 20px; font-weight: 800; margin: 0;">References & Sources</h2>
            <p style="font-size: 13px; opacity: 0.6; margin: 4px 0 0 0;">${validRefs.length} authoritative sources cited</p>
        </div>
    </div>
    <ol style="list-style: none; padding: 0; margin: 0;">
        ${refItems}
    </ol>
</section>`;
}

function extractDomain(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace('www.', '');
    } catch {
        return url.split('/')[2]?.replace('www.', '') || 'source';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 YOUTUBE VIDEO EMBED
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel?: string;
    views?: number;
}

export function createYouTubeEmbed(video: YouTubeVideoData): string {
    return `
<div style="margin: 40px 0;">
    <div style="
        border: 1px solid rgba(128,128,128,0.15);
        border-radius: 16px;
        overflow: hidden;
    ">
        <div style="
            padding: 14px 18px;
            background: rgba(128,128,128,0.04);
            border-bottom: 1px solid rgba(128,128,128,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
        ">
            <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <span style="color: white; font-size: 16px; line-height: 1;">▶</span>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(video.title)}</div>
                ${video.channel ? `<div style="font-size: 12px; opacity: 0.6;">${escapeHtml(video.channel)}${video.views ? ` • ${video.views.toLocaleString()} views` : ''}</div>` : ''}
            </div>
        </div>
        <div style="position: relative; padding-bottom: 56.25%; height: 0; background: #000;">
            <iframe 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                src="https://www.youtube.com/embed/${escapeHtml(video.videoId)}?rel=0"
                title="${escapeHtml(video.title)}"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 STEP-BY-STEP GUIDE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Step {
    title: string;
    description: string;
}

export function createStepByStepGuide(steps: Step[], title?: string): string {
    const stepItems = steps.map((step, index) => `
        <div style="
            display: flex;
            gap: 18px;
            padding: 18px 0;
            ${index < steps.length - 1 ? 'border-bottom: 1px solid rgba(128,128,128,0.08);' : ''}
        ">
            <div style="
                min-width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                font-weight: 800;
                flex-shrink: 0;
            ">${index + 1}</div>
            <div style="flex: 1; padding-top: 4px;">
                <h4 style="
                    font-size: 17px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                ">${escapeHtml(step.title)}</h4>
                <p style="
                    font-size: 15px;
                    line-height: 1.7;
                    margin: 0;
                    opacity: 0.85;
                ">${step.description}</p>
            </div>
        </div>
    `).join('');

    return `
<div class="wpo-box" style="
    border: 1px solid rgba(128,128,128,0.15);
    border-radius: 20px;
    padding: 28px;
    margin: 40px 0;
">
    ${title ? `
    <div style="
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(128,128,128,0.1);
    ">
        <div style="
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <span style="font-size: 20px; line-height: 1;">📋</span>
        </div>
        <h3 style="font-size: 18px; font-weight: 700; margin: 0;">${escapeHtml(title)}</h3>
    </div>
    ` : ''}
    ${stepItems}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 👍👎 PROS/CONS TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export function createProsConsTable(pros: string[], cons: string[], title?: string): string {
    const prosItems = pros.map(p => `
        <li style="
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 0;
        ">
            <span style="color: #10b981; font-weight: 700; font-size: 14px; margin-top: 1px;">✓</span>
            <span style="font-size: 14px; line-height: 1.5;">${escapeHtml(p)}</span>
        </li>
    `).join('');

    const consItems = cons.map(c => `
        <li style="
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 0;
        ">
            <span style="color: #ef4444; font-weight: 700; font-size: 14px; margin-top: 1px;">✗</span>
            <span style="font-size: 14px; line-height: 1.5;">${escapeHtml(c)}</span>
        </li>
    `).join('');

    return `
<div style="
    border: 1px solid rgba(128,128,128,0.15);
    border-radius: 16px;
    margin: 40px 0;
    overflow: hidden;
">
    ${title ? `
    <div style="
        padding: 14px 18px;
        background: rgba(128,128,128,0.04);
        border-bottom: 1px solid rgba(128,128,128,0.1);
        font-size: 16px;
        font-weight: 700;
    ">${escapeHtml(title)}</div>
    ` : ''}
    <div style="display: grid; grid-template-columns: 1fr 1fr;">
        <div style="
            padding: 18px;
            border-right: 1px solid rgba(128,128,128,0.1);
        ">
            <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                color: #10b981;
                margin-bottom: 12px;
            ">
                <span>👍</span> Pros
            </div>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${prosItems}
            </ul>
        </div>
        <div style="padding: 18px;">
            <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                color: #ef4444;
                margin-bottom: 12px;
            ">
                <span>👎</span> Cons
            </div>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${consItems}
            </ul>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    VISUAL_COMPONENTS_VERSION,
    THEME_ADAPTIVE_CSS,
    escapeHtml,
    createQuickAnswerBox,
    createProTipBox,
    createWarningBox,
    createStatsDashboard,
    createExpertQuote,
    createComparisonTable,
    createChecklist,
    createKeyTakeaways,
    createFAQAccordion,
    createCTABox,
    createReferencesSection,
    createYouTubeEmbed,
    createStepByStepGuide,
    createProsConsTable
};
