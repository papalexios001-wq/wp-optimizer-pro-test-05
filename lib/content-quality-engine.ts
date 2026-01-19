// =============================================================================
// ENTERPRISE-GRADE CONTENT QUALITY ENGINE
// =============================================================================
// Generates 10000x more helpful, easy-to-read, human-written content
// =============================================================================

import { escapeHtml } from './utils';

// =============================================================================
// CONTENT QUALITY CONFIGURATION
// =============================================================================

interface ContentQualityConfig {
  readabilityTarget: 'elementary' | 'middle-school' | 'high-school' | 'college';
  toneOfVoice: 'conversational' | 'professional' | 'friendly' | 'authoritative';
  contentDepth: 'comprehensive' | 'detailed' | 'summary';
  humanizationLevel: number; // 1-10 scale
  engagementFeatures: EngagementFeatures;
}

interface EngagementFeatures {
  usePersonalPronouns: boolean;
  includeQuestions: boolean;
  addTransitions: boolean;
  useActiveVoice: boolean;
  includeExamples: boolean;
  addAnalogies: boolean;
  useConversationalPhrases: boolean;
}

const DEFAULT_QUALITY_CONFIG: ContentQualityConfig = {
  readabilityTarget: 'middle-school',
  toneOfVoice: 'conversational',
  contentDepth: 'comprehensive',
  humanizationLevel: 9,
  engagementFeatures: {
    usePersonalPronouns: true,
    includeQuestions: true,
    addTransitions: true,
    useActiveVoice: true,
    includeExamples: true,
    addAnalogies: true,
    useConversationalPhrases: true
  }
};

// =============================================================================
// HUMAN-WRITTEN CONTENT PATTERNS
// =============================================================================

const CONVERSATIONAL_OPENERS = [
  "Let's dive into",
  "Here's the thing about",
  "You might be wondering about",
  "Ever wondered why",
  "Picture this:",
  "Here's what you need to know about",
  "Let me break this down for you:",
  "The truth about",
  "What if I told you that"
];

const TRANSITION_PHRASES = [
  "Now, here's where it gets interesting:",
  "But wait, there's more to consider:",
  "On the flip side,",
  "Here's the key takeaway:",
  "Let's take a closer look at",
  "Moving on to the next important point:",
  "This brings us to an important question:",
  "Building on that idea,"
];

const ENGAGEMENT_QUESTIONS = [
  "Sound familiar?",
  "Makes sense, right?",
  "Have you experienced this?",
  "Can you relate to this?",
  "What do you think?",
  "Surprised? You're not alone.",
  "Ready to learn more?"
];

const CONCLUSION_STARTERS = [
  "So, what's the bottom line?",
  "Let's wrap this up with the key points:",
  "Here's what you should remember:",
  "To sum it all up:",
  "The main takeaway here is:"
];

// =============================================================================
// READABILITY ANALYZER
// =============================================================================

export class ReadabilityAnalyzer {
  /**
   * Calculate Flesch Reading Ease score
   * Higher scores = easier to read (target: 60-70 for general audience)
   */
  static calculateFleschScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((acc, word) => acc + this.countSyllables(word), 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    return 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  }
  
  /**
   * Count syllables in a word (approximation)
   */
  private static countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
  
  /**
   * Analyze sentence complexity
   */
  static analyzeSentenceComplexity(text: string): {
    avgLength: number;
    longSentences: number;
    shortSentences: number;
    recommendation: string;
  } {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sentences.map(s => s.split(/\s+/).length);
    
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length || 0;
    const longSentences = lengths.filter(l => l > 25).length;
    const shortSentences = lengths.filter(l => l < 8).length;
    
    let recommendation = '';
    if (avgLength > 20) {
      recommendation = 'Consider breaking long sentences into shorter ones for better readability.';
    } else if (avgLength < 10) {
      recommendation = 'Add some variety with longer, more detailed sentences.';
    } else {
      recommendation = 'Sentence length is well-balanced for readability.';
    }
    
    return { avgLength, longSentences, shortSentences, recommendation };
  }
}

// =============================================================================
// CONTENT HUMANIZER - Makes AI content sound human-written
// =============================================================================

export class ContentHumanizer {
  private config: ContentQualityConfig;
  
  constructor(config: Partial<ContentQualityConfig> = {}) {
    this.config = { ...DEFAULT_QUALITY_CONFIG, ...config };
  }
  
  /**
   * Add conversational opener to content section
   */
  addConversationalOpener(topic: string): string {
    const opener = CONVERSATIONAL_OPENERS[Math.floor(Math.random() * CONVERSATIONAL_OPENERS.length)];
    return `${opener} ${topic}.`;
  }
  
  /**
   * Insert engagement questions throughout content
   */
  insertEngagementQuestion(): string {
    return ENGAGEMENT_QUESTIONS[Math.floor(Math.random() * ENGAGEMENT_QUESTIONS.length)];
  }
  
  /**
   * Add smooth transition between paragraphs
   */
  addTransition(): string {
    return TRANSITION_PHRASES[Math.floor(Math.random() * TRANSITION_PHRASES.length)];
  }
  
  /**
   * Transform passive voice to active voice
   */
  transformToActiveVoice(sentence: string): string {
    // Common passive patterns and their active replacements
    const passivePatterns: [RegExp, string][] = [
      [/was\s+(\w+ed)\s+by\s+([\w\s]+)/gi, '$2 $1'],
      [/is\s+being\s+(\w+ed)/gi, '$1'],
      [/has\s+been\s+(\w+ed)/gi, '$1'],
      [/will\s+be\s+(\w+ed)/gi, 'will $1']
    ];
    
    let result = sentence;
    for (const [pattern, replacement] of passivePatterns) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }
  
  /**
   * Humanize a paragraph of content
   */
  humanizeParagraph(paragraph: string, isFirst: boolean = false): string {
    let result = paragraph;
    
    // Add conversational opener for first paragraph
    if (isFirst && this.config.engagementFeatures.useConversationalPhrases) {
      const firstSentence = result.split('.')[0];
      const opener = this.addConversationalOpener(firstSentence.toLowerCase());
      result = opener + ' ' + result.substring(firstSentence.length + 1);
    }
    
    // Transform to active voice
    if (this.config.engagementFeatures.useActiveVoice) {
      result = this.transformToActiveVoice(result);
    }
    
    // Add engagement question at end of some paragraphs
    if (this.config.engagementFeatures.includeQuestions && Math.random() > 0.6) {
      result = result.trim() + ' ' + this.insertEngagementQuestion();
    }
    
    return result;
  }
}

// =============================================================================
// HIGH-QUALITY CONTENT SECTION GENERATORS
// =============================================================================

/**
 * Generate a compelling, human-written introduction section
 */
export function generateHumanIntroduction(
  topic: string,
  painPoints: string[],
  promise: string
): string {
  const humanizer = new ContentHumanizer();
  
  const hook = humanizer.addConversationalOpener(topic);
  
  const painPointsText = painPoints.length > 0
    ? `<p style="font-size: 1.1rem; line-height: 1.8; color: #4a5568;">` +
      `If you've ever struggled with ${painPoints.slice(0, -1).join(', ')}` +
      `${painPoints.length > 1 ? ', or ' : ''}${painPoints[painPoints.length - 1]}, ` +
      `you're definitely not alone. ${humanizer.insertEngagementQuestion()}</p>`
    : '';
  
  const promiseText = `<p style="font-size: 1.15rem; line-height: 1.8; color: #2d3748; font-weight: 500;">` +
    `In this comprehensive guide, we'll show you exactly how to ${promise}. ` +
    `No fluff, no jargon—just practical, actionable advice you can use right away.</p>`;
  
  return `
    <div class="intro-section" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); ` +
    `padding: 2.5rem; border-radius: 16px; margin-bottom: 2rem; border-left: 4px solid #4299e1;">
      <p style="font-size: 1.25rem; line-height: 1.9; color: #1a202c; margin-bottom: 1rem;">
        ${escapeHtml(hook)}
      </p>
      ${painPointsText}
      ${promiseText}
    </div>
  `;
}

/**
 * Generate easy-to-read bullet point sections with icons
 */
export function generateReadableBulletSection(
  title: string,
  items: Array<{ heading: string; description: string; icon?: string }>
): string {
  const defaultIcons = ['✅', '💡', '🎯', '⚡', '🔑', '📌', '🚀', '💪'];
  
  const bulletItems = items.map((item, index) => {
    const icon = item.icon || defaultIcons[index % defaultIcons.length];
    return `
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; padding: 1.25rem; ` +
      `background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); ` +
      `transition: transform 0.2s ease;">
        <div style="font-size: 1.5rem; flex-shrink: 0;">${icon}</div>
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 600; color: #2d3748; margin: 0 0 0.5rem 0;">
            ${escapeHtml(item.heading)}
          </h4>
          <p style="font-size: 1rem; line-height: 1.7; color: #4a5568; margin: 0;">
            ${escapeHtml(item.description)}
          </p>
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <section style="margin: 2.5rem 0;">
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #1a202c; margin-bottom: 1.5rem; ` +
      `display: flex; align-items: center; gap: 0.75rem;">
        <span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; ` +
        `-webkit-text-fill-color: transparent;">${escapeHtml(title)}</span>
      </h3>
      ${bulletItems}
    </section>
  `;
}

/**
 * Generate step-by-step guide with visual numbering
 */
export function generateStepByStepGuide(
  title: string,
  steps: Array<{ title: string; content: string; tip?: string }>
): string {
  const stepsHtml = steps.map((step, index) => {
    const tipHtml = step.tip
      ? `<div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; ` +
        `margin-top: 0.75rem; border-radius: 0 8px 8px 0; font-size: 0.95rem;">
          <strong>💡 Pro Tip:</strong> ${escapeHtml(step.tip)}
        </div>`
      : '';
    
    return `
      <div style="display: flex; gap: 1.25rem; margin-bottom: 2rem;">
        <div style="flex-shrink: 0; width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); ` +
        `border-radius: 50%; display: flex; align-items: center; justify-content: center; ` +
        `color: white; font-weight: 700; font-size: 1.25rem; box-shadow: 0 4px 12px rgba(102,126,234,0.4);">
          ${index + 1}
        </div>
        <div style="flex: 1; padding-top: 0.25rem;">
          <h4 style="font-size: 1.15rem; font-weight: 600; color: #2d3748; margin: 0 0 0.75rem 0;">
            ${escapeHtml(step.title)}
          </h4>
          <p style="font-size: 1rem; line-height: 1.75; color: #4a5568; margin: 0;">
            ${escapeHtml(step.content)}
          </p>
          ${tipHtml}
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <section style="margin: 3rem 0; padding: 2rem; background: #f8fafc; border-radius: 16px;">
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #1a202c; margin-bottom: 2rem;">
        📝 ${escapeHtml(title)}
      </h3>
      ${stepsHtml}
    </section>
  `;
}

/**
 * Generate FAQ section with expandable answers
 */
export function generateFAQSection(
  faqs: Array<{ question: string; answer: string }>
): string {
  const faqItems = faqs.map((faq, index) => `
    <details style="margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <summary style="padding: 1.25rem; background: white; cursor: pointer; font-weight: 600; ` +
      `color: #2d3748; font-size: 1.05rem; list-style: none; display: flex; ` +
      `justify-content: space-between; align-items: center;">
        ${escapeHtml(faq.question)}
        <span style="color: #667eea; font-size: 1.25rem;">▼</span>
      </summary>
      <div style="padding: 1.25rem; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 1rem; line-height: 1.75; color: #4a5568; margin: 0;">
          ${escapeHtml(faq.answer)}
        </p>
      </div>
    </details>
  `).join('');
  
  return `
    <section style="margin: 3rem 0;">
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #1a202c; margin-bottom: 1.5rem;">
        ❓ Frequently Asked Questions
      </h3>
      ${faqItems}
    </section>
  `;
}

/**
 * Generate compelling conclusion with CTA
 */
export function generateConclusion(
  summary: string,
  ctaText: string,
  ctaUrl: string
): string {
  const conclusionStarter = CONCLUSION_STARTERS[Math.floor(Math.random() * CONCLUSION_STARTERS.length)];
  
  return `
    <section style="margin: 3rem 0; padding: 2.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ` +
    `border-radius: 20px; color: white; text-align: center;">
      <h3 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem 0;">
        ${conclusionStarter}
      </h3>
      <p style="font-size: 1.15rem; line-height: 1.8; margin: 0 0 1.5rem 0; opacity: 0.95;">
        ${escapeHtml(summary)}
      </p>
      <a href="${escapeHtml(ctaUrl)}" style="display: inline-block; padding: 1rem 2.5rem; ` +
      `background: white; color: #667eea; font-weight: 600; font-size: 1.1rem; ` +
      `border-radius: 50px; text-decoration: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); ` +
      `transition: transform 0.2s ease;">
        ${escapeHtml(ctaText)} →
      </a>
    </section>
  `;
}

// Export all utilities
export { DEFAULT_QUALITY_CONFIG, CONVERSATIONAL_OPENERS, TRANSITION_PHRASES };
