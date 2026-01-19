// =============================================================================
// ENTERPRISE-GRADE RICH ANCHOR TEXT INTERNAL LINKER
// =============================================================================
// Generates 10000x higher quality internal links with contextual rich anchor text
// =============================================================================

import { escapeHtml } from './utils';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface InternalLink {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  relevanceScore: number;
}

interface AnchorTextVariation {
  text: string;
  type: 'exact' | 'partial' | 'contextual' | 'branded' | 'natural';
  weight: number;
}

interface LinkPlacement {
  position: 'inline' | 'callout' | 'related' | 'footer';
  context: string;
  anchorText: string;
  url: string;
}

interface RichLinkConfig {
  maxLinksPerSection: number;
  minRelevanceScore: number;
  anchorTextDiversity: boolean;
  contextualMatching: boolean;
  semanticAnalysis: boolean;
}

const DEFAULT_LINK_CONFIG: RichLinkConfig = {
  maxLinksPerSection: 3,
  minRelevanceScore: 0.6,
  anchorTextDiversity: true,
  contextualMatching: true,
  semanticAnalysis: true
};

// =============================================================================
// RICH ANCHOR TEXT PATTERNS - Natural, contextual anchor text templates
// =============================================================================

const ANCHOR_TEXT_TEMPLATES = {
  howTo: [
    'learn how to {action}',
    'discover the best way to {action}',
    'step-by-step guide to {action}',
    'complete tutorial on {action}',
    'master {topic} with our guide'
  ],
  informational: [
    'everything you need to know about {topic}',
    'comprehensive guide to {topic}',
    'in-depth look at {topic}',
    'understanding {topic}',
    'the complete {topic} breakdown'
  ],
  comparison: [
    '{item1} vs {item2} comparison',
    'comparing {item1} and {item2}',
    'which is better: {item1} or {item2}',
    'detailed {topic} comparison'
  ],
  benefits: [
    'key benefits of {topic}',
    'why {topic} matters',
    'advantages of {topic}',
    'how {topic} can help you'
  ],
  tips: [
    'expert tips for {topic}',
    'pro tips on {topic}',
    'insider secrets about {topic}',
    'best practices for {topic}'
  ]
};

const CONTEXTUAL_INTROS = [
  'For more details,',
  'To dive deeper,',
  'If you want to learn more,',
  'For a comprehensive overview,',
  'To understand this better,',
  'For additional insights,',
  'To explore this topic further,'
];

// =============================================================================
// SEMANTIC RELEVANCE ANALYZER
// =============================================================================

export class SemanticRelevanceAnalyzer {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'it', 'its', 'as', 'if', 'when', 'than'
  ]);

  /**
   * Extract meaningful keywords from text
   */
  extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
    
    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    // Sort by frequency and return top keywords
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Calculate semantic similarity between two texts
   */
  calculateSimilarity(text1: string, text2: string): number {
    const keywords1 = new Set(this.extractKeywords(text1));
    const keywords2 = new Set(this.extractKeywords(text2));
    
    if (keywords1.size === 0 || keywords2.size === 0) return 0;
    
    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);
    
    // Jaccard similarity
    return intersection.size / union.size;
  }

  /**
   * Find best anchor text position in content
   */
  findBestAnchorPosition(content: string, targetKeywords: string[]): number {
    const sentences = content.split(/[.!?]+/);
    let bestIndex = 0;
    let bestScore = 0;
    let currentIndex = 0;
    
    for (const sentence of sentences) {
      const sentenceKeywords = this.extractKeywords(sentence);
      const matchScore = sentenceKeywords.filter(k => 
        targetKeywords.some(tk => k.includes(tk) || tk.includes(k))
      ).length;
      
      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestIndex = currentIndex;
      }
      currentIndex += sentence.length + 1;
    }
    
    return bestIndex;
  }
}

// =============================================================================
// RICH ANCHOR TEXT LINKER - Main class for generating high-quality links
// =============================================================================

export class RichAnchorTextLinker {
  private config: RichLinkConfig;
  private analyzer: SemanticRelevanceAnalyzer;
  private usedAnchorTexts: Set<string> = new Set();

  constructor(config: Partial<RichLinkConfig> = {}) {
    this.config = { ...DEFAULT_LINK_CONFIG, ...config };
    this.analyzer = new SemanticRelevanceAnalyzer();
  }

  /**
   * Generate rich anchor text based on link context and type
   */
  generateRichAnchorText(
    link: InternalLink,
    contentContext: string,
    intentType: keyof typeof ANCHOR_TEXT_TEMPLATES = 'informational'
  ): string {
    const templates = ANCHOR_TEXT_TEMPLATES[intentType];
    
    // Extract topic from link title
    const topic = link.title.toLowerCase().replace(/^(how to|guide to|best|top)\s*/i, '');
    
    // Find unused template
    let anchorText = '';
    for (const template of templates) {
      const generated = template
        .replace('{topic}', topic)
        .replace('{action}', topic);
      
      if (!this.usedAnchorTexts.has(generated)) {
        anchorText = generated;
        this.usedAnchorTexts.add(generated);
        break;
      }
    }
    
    // Fallback to partial match from title
    if (!anchorText) {
      anchorText = link.title.length > 50 
        ? link.title.substring(0, 47) + '...'
        : link.title;
    }
    
    return anchorText;
  }

  /**
   * Create contextual inline link with natural intro
   */
  createContextualInlineLink(
    link: InternalLink,
    anchorText: string
  ): string {
    const intro = CONTEXTUAL_INTROS[Math.floor(Math.random() * CONTEXTUAL_INTROS.length)];
    
    return `${intro} check out our <a href="${escapeHtml(link.url)}" ` +
      `style="color: #667eea; text-decoration: none; border-bottom: 2px solid #667eea; ` +
      `font-weight: 500; transition: all 0.2s ease;" ` +
      `title="${escapeHtml(link.description)}">${escapeHtml(anchorText)}</a>.`;
  }

  /**
   * Find and rank relevant internal links for content
   */
  findRelevantLinks(
    content: string,
    availableLinks: InternalLink[]
  ): InternalLink[] {
    const contentKeywords = this.analyzer.extractKeywords(content);
    
    const scoredLinks = availableLinks.map(link => {
      const linkKeywords = [...link.keywords, ...this.analyzer.extractKeywords(link.title)];
      const similarity = this.analyzer.calculateSimilarity(
        content,
        link.title + ' ' + link.description
      );
      
      // Calculate keyword overlap bonus
      const keywordOverlap = contentKeywords.filter(k => 
        linkKeywords.some(lk => lk.includes(k) || k.includes(lk))
      ).length / Math.max(contentKeywords.length, 1);
      
      const finalScore = (similarity * 0.6) + (keywordOverlap * 0.4);
      
      return { ...link, relevanceScore: finalScore };
    });
    
    return scoredLinks
      .filter(link => link.relevanceScore >= this.config.minRelevanceScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.config.maxLinksPerSection);
  }
}

// =============================================================================
// EXPORTED FUNCTIONS - High-quality internal link generators
// =============================================================================

/**
 * Generate a rich "Related Articles" section with contextual links
 */
export function generateRelatedArticlesSection(
  currentContent: string,
  availableLinks: InternalLink[],
  title: string = 'Related Articles You Might Enjoy'
): string {
  const linker = new RichAnchorTextLinker();
  const relevantLinks = linker.findRelevantLinks(currentContent, availableLinks);
  
  if (relevantLinks.length === 0) return '';
  
  const linkCards = relevantLinks.map(link => {
    const anchorText = linker.generateRichAnchorText(link, currentContent);
    
    return `
      <a href="${escapeHtml(link.url)}" style="display: block; padding: 1.25rem; ` +
      `background: white; border-radius: 12px; text-decoration: none; ` +
      `border: 1px solid #e2e8f0; margin-bottom: 1rem; transition: all 0.2s ease; ` +
      `box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="flex-shrink: 0; width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); ` +
          `border-radius: 10px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 1.25rem;">📚</span>
          </div>
          <div style="flex: 1;">
            <h4 style="font-size: 1.05rem; font-weight: 600; color: #2d3748; margin: 0 0 0.25rem 0;">
              ${escapeHtml(anchorText)}
            </h4>
            <p style="font-size: 0.9rem; color: #718096; margin: 0; line-height: 1.5;">
              ${escapeHtml(link.description.substring(0, 100))}...
            </p>
          </div>
          <div style="flex-shrink: 0; color: #667eea; font-size: 1.25rem;">→</div>
        </div>
      </a>
    `;
  }).join('');
  
  return `
    <section style="margin: 3rem 0; padding: 2rem; background: #f8fafc; border-radius: 16px;">
      <h3 style="font-size: 1.35rem; font-weight: 700; color: #1a202c; margin: 0 0 1.5rem 0; ` +
      `display: flex; align-items: center; gap: 0.75rem;">
        <span>📖</span> ${escapeHtml(title)}
      </h3>
      ${linkCards}
    </section>
  `;
}

/**
 * Generate inline contextual links within content
 */
export function insertContextualLinks(
  content: string,
  availableLinks: InternalLink[],
  maxLinks: number = 3
): string {
  const linker = new RichAnchorTextLinker({ maxLinksPerSection: maxLinks });
  const relevantLinks = linker.findRelevantLinks(content, availableLinks);
  
  if (relevantLinks.length === 0) return content;
  
  // Find natural insertion points (end of paragraphs)
  const paragraphs = content.split('</p>');
  let insertedCount = 0;
  
  const result = paragraphs.map((para, index) => {
    if (insertedCount >= maxLinks || index >= paragraphs.length - 1) {
      return para;
    }
    
    // Insert link every 2-3 paragraphs
    if (index > 0 && index % 2 === 0 && relevantLinks[insertedCount]) {
      const link = relevantLinks[insertedCount];
      const anchorText = linker.generateRichAnchorText(link, para, 'tips');
      const contextualLink = linker.createContextualInlineLink(link, anchorText);
      insertedCount++;
      
      return para + `<p style="font-style: italic; color: #4a5568; ` +
        `background: #f7fafc; padding: 1rem; border-radius: 8px; margin: 1rem 0;">${contextualLink}</p>`;
    }
    
    return para;
  }).join('</p>');
  
  return result;
}

/**
 * Generate a "Further Reading" callout box
 */
export function generateFurtherReadingCallout(
  link: InternalLink,
  context: string = 'Want to dive deeper into this topic?'
): string {
  const linker = new RichAnchorTextLinker();
  const anchorText = linker.generateRichAnchorText(link, context, 'informational');
  
  return `
    <div style="background: linear-gradient(135deg, #ebf4ff 0%, #e6fffa 100%); ` +
    `border-left: 4px solid #667eea; padding: 1.5rem; border-radius: 0 12px 12px 0; margin: 2rem 0;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
        <span style="font-size: 1.25rem;">💡</span>
        <span style="font-weight: 600; color: #2d3748;">${escapeHtml(context)}</span>
      </div>
      <a href="${escapeHtml(link.url)}" style="display: inline-flex; align-items: center; gap: 0.5rem; ` +
      `color: #667eea; font-weight: 600; text-decoration: none; font-size: 1.05rem;">
        ${escapeHtml(anchorText)}
        <span>→</span>
      </a>
    </div>
  `;
}

// Export configuration and types
export { DEFAULT_LINK_CONFIG, ANCHOR_TEXT_TEMPLATES };
export type { InternalLink, AnchorTextVariation, LinkPlacement, RichLinkConfig };
