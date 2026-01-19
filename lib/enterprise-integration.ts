// =============================================================================
// ENTERPRISE INTEGRATION LAYER
// =============================================================================
// Wires all enterprise-grade modules together for the frontend
// =============================================================================

// Import all enterprise modules
import {
  ReadabilityAnalyzer,
  ContentHumanizer,
  generateHumanIntroduction,
  generateReadableBulletSection,
  generateStepByStepGuide,
  generateFAQSection,
  generateConclusion,
  DEFAULT_QUALITY_CONFIG
} from './content-quality-engine';

import {
  RichAnchorTextLinker,
  SemanticRelevanceAnalyzer,
  generateRelatedArticlesSection,
  insertContextualLinks,
  generateFurtherReadingCallout,
  type InternalLink
} from './rich-anchor-text-linker';

import {
  SEOAnalyzer,
  generateArticleSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateMetaTags,
  generateSEOScoreCard,
  type SEOConfig,
  type SEOAnalysis
} from './enterprise-seo-optimizer';

import {
  generateHeroSection,
  generateProgressIndicator,
  generateBeforeAfterSlider,
  generateSocialProofCounter
} from './visual-components';

// =============================================================================
// ENTERPRISE BLOG POST GENERATOR
// =============================================================================

export interface EnhancedBlogConfig {
  topic: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  painPoints: string[];
  promise: string;
  authorName: string;
  siteUrl: string;
  availableInternalLinks: InternalLink[];
  enableVisualElements: boolean;
  enableSEOOptimization: boolean;
  enableHumanization: boolean;
}

export interface EnhancedBlogResult {
  html: string;
  metaTags: string;
  schemaMarkup: string;
  seoAnalysis: SEOAnalysis;
  readabilityScore: number;
  wordCount: number;
}

/**
 * Generate a fully enhanced, enterprise-grade blog post
 * with all SOTA features wired together
 */
export async function generateEnhancedBlogPost(
  config: EnhancedBlogConfig,
  mainContent: string // Raw AI-generated content
): Promise<EnhancedBlogResult> {
  const humanizer = new ContentHumanizer();
  const linker = new RichAnchorTextLinker();
  const readabilityAnalyzer = ReadabilityAnalyzer;
  
  let enhancedHtml = '';
  
  // 1. Generate Hero Section with visual elements
  if (config.enableVisualElements) {
    enhancedHtml += generateHeroSection(
      config.topic,
      `Discover everything you need to know about ${config.topic}`,
    );
  }
  
  // 2. Generate Human-Written Introduction
  if (config.enableHumanization) {
    enhancedHtml += generateHumanIntroduction(
      config.topic,
      config.painPoints,
      config.promise
    );
  }
  
  // 3. Process main content with humanization
  let processedContent = mainContent;
  if (config.enableHumanization) {
    // Split into paragraphs and humanize each
    const paragraphs = mainContent.split('</p>');
    processedContent = paragraphs
      .map((p, i) => humanizer.humanizeParagraph(p, i === 0))
      .join('</p>');
  }
  
  // 4. Insert contextual internal links with rich anchor text
  if (config.availableInternalLinks.length > 0) {
    processedContent = insertContextualLinks(
      processedContent,
      config.availableInternalLinks,
      3
    );
  }
  
  enhancedHtml += `<div id="main-content">${processedContent}</div>`;
  
  // 5. Add Related Articles Section
  if (config.availableInternalLinks.length > 0) {
    enhancedHtml += generateRelatedArticlesSection(
      mainContent,
      config.availableInternalLinks,
      'You Might Also Like'
    );
  }
  
  // 6. Generate Conclusion with CTA
  enhancedHtml += generateConclusion(
    `You now have everything you need to master ${config.topic}. Take action today!`,
    'Get Started Now',
    config.siteUrl
  );
  
  // 7. SEO Analysis and Optimization
  let seoAnalysis: SEOAnalysis = {
    score: 0,
    title: { length: 0, hasKeyword: false, isOptimal: false },
    meta: { descriptionLength: 0, hasKeyword: false, isOptimal: false },
    content: { wordCount: 0, keywordDensity: 0, headingStructure: false, hasImages: false, readabilityScore: 0 },
    structure: { hasH1: false, headingHierarchy: false, hasInternalLinks: false, hasExternalLinks: false, hasFAQ: false },
    recommendations: []
  };
  
  let metaTags = '';
  let schemaMarkup = '';
  
  if (config.enableSEOOptimization) {
    const seoConfig: SEOConfig = {
      targetKeyword: config.targetKeyword,
      secondaryKeywords: config.secondaryKeywords,
      minWordCount: 1500,
      targetKeywordDensity: 1.5,
      enableSchema: true
    };
    
    const analyzer = new SEOAnalyzer(seoConfig);
    const title = `${config.topic} - Complete Guide ${new Date().getFullYear()}`;
    const description = `Learn everything about ${config.topic}. ${config.promise}. Expert tips and actionable advice.`;
    
    seoAnalysis = analyzer.analyze(enhancedHtml, title, description);
    
    // Generate meta tags
    metaTags = generateMetaTags(
      title,
      description,
      [config.targetKeyword, ...config.secondaryKeywords],
      `${config.siteUrl}/${config.topic.toLowerCase().replace(/\s+/g, '-')}`
    );
    
    // Generate schema markup
    schemaMarkup = generateArticleSchema(
      title,
      description,
      config.authorName,
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    // Add SEO score card to the content
    enhancedHtml += generateSEOScoreCard(seoAnalysis);
  }
  
  // 8. Calculate readability score
  const plainText = enhancedHtml.replace(/<[^>]*>/g, ' ');
  const readabilityScore = readabilityAnalyzer.calculateFleschScore(plainText);
  const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
  
  return {
    html: enhancedHtml,
    metaTags,
    schemaMarkup,
    seoAnalysis,
    readabilityScore,
    wordCount
  };
}

/**
 * Quick enhancement for existing content
 * Adds enterprise features without full regeneration
 */
export function enhanceExistingContent(
  content: string,
  internalLinks: InternalLink[]
): string {
  let enhanced = content;
  
  // Add contextual links
  if (internalLinks.length > 0) {
    enhanced = insertContextualLinks(enhanced, internalLinks, 3);
    enhanced += generateRelatedArticlesSection(content, internalLinks);
  }
  
  return enhanced;
}

/**
 * Generate visual enhancement components
 */
export function generateVisualEnhancements(
  topic: string,
  stats: Array<{ value: string; label: string }>
): string {
  let visuals = '';
  
  // Add progress indicator
  visuals += generateProgressIndicator('Content Quality', 75);  
  // Add social proof counters
  visuals += generateSocialProofCounter(stats);  
  return visuals;
}

// Re-export all modules for direct access
export {
  // Content Quality
  ReadabilityAnalyzer,
  ContentHumanizer,
  generateHumanIntroduction,
  generateReadableBulletSection,
  generateStepByStepGuide,
  generateFAQSection,
  generateConclusion,
  
  // Internal Linking
  RichAnchorTextLinker,
  SemanticRelevanceAnalyzer,
  generateRelatedArticlesSection,
  insertContextualLinks,
  generateFurtherReadingCallout,
  
  // SEO
  SEOAnalyzer,
  generateArticleSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateMetaTags,
  generateSEOScoreCard,
  
  // Visual Components
  generateHeroSection,
  generateProgressIndicator,
  generateBeforeAfterSlider,
  generateSocialProofCounter
};
