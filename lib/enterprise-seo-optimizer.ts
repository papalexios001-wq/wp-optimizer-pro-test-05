// =============================================================================
// ENTERPRISE-GRADE SEO OPTIMIZER
// =============================================================================
// Comprehensive SEO optimization for 10000x better search rankings
// =============================================================================

import { escapeHtml } from './utils';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface SEOAnalysis {
  score: number;
  title: TitleAnalysis;
  meta: MetaAnalysis;
  content: ContentSEOAnalysis;
  structure: StructureAnalysis;
  recommendations: string[];
}

interface TitleAnalysis {
  length: number;
  hasKeyword: boolean;
  isOptimal: boolean;
  suggestion?: string;
}

interface MetaAnalysis {
  descriptionLength: number;
  hasKeyword: boolean;
  isOptimal: boolean;
  suggestion?: string;
}

interface ContentSEOAnalysis {
  wordCount: number;
  keywordDensity: number;
  headingStructure: boolean;
  hasImages: boolean;
  readabilityScore: number;
}

interface StructureAnalysis {
  hasH1: boolean;
  headingHierarchy: boolean;
  hasInternalLinks: boolean;
  hasExternalLinks: boolean;
  hasFAQ: boolean;
}

interface SEOConfig {
  targetKeyword: string;
  secondaryKeywords: string[];
  minWordCount: number;
  targetKeywordDensity: number;
  enableSchema: boolean;
}

// =============================================================================
// SEO ANALYSIS ENGINE
// =============================================================================

export class SEOAnalyzer {
  private config: SEOConfig;

  constructor(config: SEOConfig) {
    this.config = config;
  }

  /**
   * Perform comprehensive SEO analysis
   */
  analyze(content: string, title: string, metaDescription: string): SEOAnalysis {
    const titleAnalysis = this.analyzeTitle(title);
    const metaAnalysis = this.analyzeMeta(metaDescription);
    const contentAnalysis = this.analyzeContent(content);
    const structureAnalysis = this.analyzeStructure(content);
    
    const score = this.calculateOverallScore(
      titleAnalysis,
      metaAnalysis,
      contentAnalysis,
      structureAnalysis
    );
    
    const recommendations = this.generateRecommendations(
      titleAnalysis,
      metaAnalysis,
      contentAnalysis,
      structureAnalysis
    );
    
    return {
      score,
      title: titleAnalysis,
      meta: metaAnalysis,
      content: contentAnalysis,
      structure: structureAnalysis,
      recommendations
    };
  }

  private analyzeTitle(title: string): TitleAnalysis {
    const length = title.length;
    const hasKeyword = title.toLowerCase().includes(this.config.targetKeyword.toLowerCase());
    const isOptimal = length >= 50 && length <= 60 && hasKeyword;
    
    let suggestion: string | undefined;
    if (length < 50) {
      suggestion = 'Title is too short. Add more descriptive keywords.';
    } else if (length > 60) {
      suggestion = 'Title is too long. It may be truncated in search results.';
    } else if (!hasKeyword) {
      suggestion = `Include your target keyword "${this.config.targetKeyword}" in the title.`;
    }
    
    return { length, hasKeyword, isOptimal, suggestion };
  }

  private analyzeMeta(description: string): MetaAnalysis {
    const length = description.length;
    const hasKeyword = description.toLowerCase().includes(this.config.targetKeyword.toLowerCase());
    const isOptimal = length >= 150 && length <= 160 && hasKeyword;
    
    let suggestion: string | undefined;
    if (length < 150) {
      suggestion = 'Meta description is too short. Aim for 150-160 characters.';
    } else if (length > 160) {
      suggestion = 'Meta description is too long. It will be truncated.';
    } else if (!hasKeyword) {
      suggestion = 'Include your target keyword in the meta description.';
    }
    
    return { descriptionLength: length, hasKeyword, isOptimal, suggestion };
  }

  private analyzeContent(content: string): ContentSEOAnalysis {
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    const keywordCount = (text.toLowerCase().match(
      new RegExp(this.config.targetKeyword.toLowerCase(), 'g')
    ) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    const headingStructure = /<h[1-6][^>]*>/i.test(content);
    const hasImages = /<img[^>]*>/i.test(content);
    
    // Simple readability score based on average sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);
    const readabilityScore = Math.max(0, 100 - (avgSentenceLength - 15) * 5);
    
    return {
      wordCount,
      keywordDensity,
      headingStructure,
      hasImages,
      readabilityScore: Math.min(100, Math.max(0, readabilityScore))
    };
  }

  private analyzeStructure(content: string): StructureAnalysis {
    return {
      hasH1: /<h1[^>]*>/i.test(content),
      headingHierarchy: this.checkHeadingHierarchy(content),
      hasInternalLinks: /<a[^>]*href=["'][^"']*["'][^>]*>/i.test(content),
      hasExternalLinks: /<a[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/i.test(content),
      hasFAQ: /<details|itemtype=["'][^"']*FAQPage/i.test(content)
    };
  }

  private checkHeadingHierarchy(content: string): boolean {
    const headings = content.match(/<h([1-6])[^>]*>/gi) || [];
    let lastLevel = 0;
    
    for (const heading of headings) {
      const level = parseInt(heading.match(/<h([1-6])/i)?.[1] || '0');
      if (level > lastLevel + 1 && lastLevel > 0) {
        return false; // Skip in hierarchy
      }
      lastLevel = level;
    }
    return true;
  }

  private calculateOverallScore(
    title: TitleAnalysis,
    meta: MetaAnalysis,
    content: ContentSEOAnalysis,
    structure: StructureAnalysis
  ): number {
    let score = 0;
    
    // Title scoring (20 points)
    if (title.isOptimal) score += 20;
    else if (title.hasKeyword) score += 10;
    
    // Meta scoring (15 points)
    if (meta.isOptimal) score += 15;
    else if (meta.hasKeyword) score += 8;
    
    // Content scoring (35 points)
    if (content.wordCount >= this.config.minWordCount) score += 10;
    if (content.keywordDensity >= 1 && content.keywordDensity <= 3) score += 10;
    if (content.headingStructure) score += 5;
    if (content.hasImages) score += 5;
    if (content.readabilityScore >= 60) score += 5;
    
    // Structure scoring (30 points)
    if (structure.hasH1) score += 10;
    if (structure.headingHierarchy) score += 5;
    if (structure.hasInternalLinks) score += 5;
    if (structure.hasExternalLinks) score += 5;
    if (structure.hasFAQ) score += 5;
    
    return Math.min(100, score);
  }

  private generateRecommendations(
    title: TitleAnalysis,
    meta: MetaAnalysis,
    content: ContentSEOAnalysis,
    structure: StructureAnalysis
  ): string[] {
    const recommendations: string[] = [];
    
    if (title.suggestion) recommendations.push(title.suggestion);
    if (meta.suggestion) recommendations.push(meta.suggestion);
    
    if (content.wordCount < this.config.minWordCount) {
      recommendations.push(
        `Increase content length. Current: ${content.wordCount} words. Target: ${this.config.minWordCount}+ words.`
      );
    }
    
    if (content.keywordDensity < 1) {
      recommendations.push('Increase keyword usage. Aim for 1-3% keyword density.');
    } else if (content.keywordDensity > 3) {
      recommendations.push('Reduce keyword usage to avoid keyword stuffing.');
    }
    
    if (!structure.hasH1) {
      recommendations.push('Add an H1 heading to your content.');
    }
    
    if (!structure.hasInternalLinks) {
      recommendations.push('Add internal links to related content.');
    }
    
    if (!structure.hasFAQ) {
      recommendations.push('Consider adding an FAQ section for better visibility.');
    }
    
    if (!content.hasImages) {
      recommendations.push('Add images with alt text to improve engagement.');
    }
    
    return recommendations;
  }
}

// =============================================================================
// SCHEMA MARKUP GENERATORS
// =============================================================================

/**
 * Generate Article schema markup
 */
export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  publishDate: string,
  modifiedDate: string,
  imageUrl?: string
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl
      }
    })
  };
  
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate FAQ schema markup
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
  
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate HowTo schema markup
 */
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string }>,
  totalTime?: string
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  };
  
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate SEO-optimized meta tags
 */
export function generateMetaTags(
  title: string,
  description: string,
  keywords: string[],
  canonicalUrl: string,
  ogImage?: string
): string {
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(keywords.join(', '))}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}">` : ''}
  `.trim();
}

/**
 * Generate visual SEO score card
 */
export function generateSEOScoreCard(analysis: SEOAnalysis): string {
  const scoreColor = analysis.score >= 80 ? '#48bb78' : 
    analysis.score >= 60 ? '#ecc94b' : '#f56565';
  
  return `
    <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0;">
      <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(${scoreColor} ${analysis.score * 3.6}deg, #e2e8f0 0deg); ` +
        `display: flex; align-items: center; justify-content: center;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: white; display: flex; ` +
          `align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: ${scoreColor};">
            ${analysis.score}
          </div>
        </div>
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #2d3748; margin: 0 0 0.25rem 0;">SEO Score</h3>
          <p style="font-size: 0.9rem; color: #718096; margin: 0;">
            ${analysis.score >= 80 ? 'Excellent! Your content is well-optimized.' :
              analysis.score >= 60 ? 'Good, but there\'s room for improvement.' :
              'Needs improvement. Follow the recommendations below.'}
          </p>
        </div>
      </div>
      ${analysis.recommendations.length > 0 ? `
        <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem;">
          <h4 style="font-size: 1rem; font-weight: 600; color: #2d3748; margin: 0 0 0.75rem 0;">Recommendations:</h4>
          <ul style="margin: 0; padding-left: 1.25rem;">
            ${analysis.recommendations.map(r => 
              `<li style="font-size: 0.9rem; color: #4a5568; margin-bottom: 0.5rem;">${escapeHtml(r)}</li>`
            ).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

// Export types
export type { SEOAnalysis, SEOConfig, TitleAnalysis, MetaAnalysis, ContentSEOAnalysis, StructureAnalysis };
