/**
 * Content Quality Enhancer for WP Optimizer Pro
 * Addresses Issue #5: 10000x Content Quality Improvement
 * 
 * This module provides:
 * - Human writing patterns library
 * - Conversational tone enhancers
 * - Rich anchor text generation
 * - Visual component optimization
 * - Readability improvements
 */

// ============================================================================
// HUMAN WRITING PATTERNS LIBRARY
// ============================================================================

export const CONVERSATIONAL_OPENERS = [
  "Let's be honest:",
  "Here's the thing:",
  "You know what?",
  "Want to know the secret?",
  "Picture this:",
  "Ever wondered why",
  "Here's what most people don't realize:",
  "Think about it:",
  "Here's a question for you:",
  "Let me tell you something:",
];

export const EMPATHY_PHRASES = [
  "I totally get it",
  "I've been there",
  "It's frustrating when",
  "You're not alone in thinking",
  "We've all experienced",
  "It's completely normal to feel",
  "Many of us struggle with",
  "I understand the challenge",
  "This is exactly what I thought when",
  "If you're like most people",
];

export const TRANSITION_PHRASES = [
  "But here's the kicker:",
  "Now, here's where it gets interesting:",
  "Let me break it down for you:",
  "Here's what changed everything:",
  "The game-changer?",
  "What really matters is:",
  "Here's the bottom line:",
  "Let's dive deeper:",
  "Now pay attention to this:",
  "Here's what you need to know:",
];

export const ACTIONABLE_ADVICE_FRAMES = [
  "Start by",
  "The first step is to",
  "Try this today:",
  "Here's what works:",
  "My recommendation?",
  "What you should do is",
  "The simplest approach is",
  "Begin with these steps:",
  "Here's your action plan:",
  "Put this into practice:",
];

// ============================================================================
// READABILITY OPTIMIZER
// ============================================================================

export interface ReadabilityConfig {
  targetGradeLevel: number; // 8th grade default
  maxSentenceLength: number;
  maxParagraphSentences: number;
  preferredWordLength: number;
}

export const DEFAULT_READABILITY_CONFIG: ReadabilityConfig = {
  targetGradeLevel: 8,
  maxSentenceLength: 20,
  maxParagraphSentences: 4,
  preferredWordLength: 2,
};

/**
 * Simplifies vocabulary for better readability
 */
export const VOCABULARY_SIMPLIFICATION: Record<string, string> = {
  utilize: 'use',
  implement: 'use',
  facilitate: 'help',
  optimize: 'improve',
  leverage: 'use',
  paradigm: 'model',
  synergy: 'teamwork',
  expedite: 'speed up',
  commence: 'start',
  terminate: 'end',
  acquire: 'get',
  sufficient: 'enough',
  approximately: 'about',
  demonstrate: 'show',
  fundamental: 'basic',
};

// ============================================================================
// RICH ANCHOR TEXT SYSTEM
// ============================================================================

export interface AnchorTextRule {
  minWords: number;
  maxWords: number;
  mustIncludeKeyword: boolean;
  avoidPatterns: string[];
  preferredPatterns: string[];
}

export const ANCHOR_TEXT_RULES: AnchorTextRule = {
  minWords: 3,
  maxWords: 7,
  mustIncludeKeyword: true,
  avoidPatterns: [
    'click here',
    'read more',
    'this link',
    'here',
    'this',
  ],
  preferredPatterns: [
    'learn how to [action]',
    'discover the best [topic]',
    'complete guide to [topic]',
    'proven strategies for [goal]',
    'step-by-step [process]',
  ],
};

/**
 * Validates if a phrase is suitable for anchor text
 */
export function isValidAnchorText(phrase: string): boolean {
  const words = phrase.trim().split(/\s+/);
  
  // Check word count
  if (words.length < ANCHOR_TEXT_RULES.minWords || 
      words.length > ANCHOR_TEXT_RULES.maxWords) {
    return false;
  }
  
  // Check for avoided patterns
  const lowerPhrase = phrase.toLowerCase();
  for (const pattern of ANCHOR_TEXT_RULES.avoidPatterns) {
    if (lowerPhrase.includes(pattern)) {
      return false;
    }
  }
  
  // Must form a complete, meaningful phrase
  // Check if it starts with a capital letter or is mid-sentence
  const hasCompleteness = /^[A-Z]/.test(phrase) || 
                          /[a-z]/.test(words[0]);
  
  return hasCompleteness;
}

/**
 * Generates rich, semantic anchor text suggestions
 */
export function generateRichAnchorText(topic: string, keywords: string[]): string[] {
  const suggestions: string[] = [];
  
  // Pattern-based generation
  suggestions.push(`complete guide to ${topic}`);
  suggestions.push(`how to master ${topic}`);
  suggestions.push(`best practices for ${topic}`);
  suggestions.push(`proven ${topic} strategies`);
  suggestions.push(`step-by-step ${topic} tutorial`);
  
  // Keyword-based variations
  keywords.forEach(keyword => {
    suggestions.push(`${keyword} best practices`);
    suggestions.push(`how ${keyword} works`);
    suggestions.push(`${keyword} complete guide`);
  });
  
  return suggestions;
}

// ============================================================================
// CONTENT QUALITY SCORING
// ============================================================================

export interface ContentQualityMetrics {
  humanWarmthScore: number; // 0-100
  readabilityScore: number; // 0-100
  actionabilityScore: number; // 0-100
  visualVarietyScore: number; // 0-100
  anchorQualityScore: number; // 0-100
  overallScore: number; // 0-100
}

/**
 * Analyzes content quality and returns metrics
 */
export function analyzeContentQuality(content: string): ContentQualityMetrics {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const paragraphs = content.split(/\n\n+/);
  
  // Calculate human warmth (presence of empathy phrases, conversational tone)
  let humanWarmth = 0;
  const allHumanPatterns = [
    ...CONVERSATIONAL_OPENERS,
    ...EMPATHY_PHRASES,
    ...TRANSITION_PHRASES,
  ];
  
  allHumanPatterns.forEach(pattern => {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      humanWarmth += 10;
    }
  });
  
  const humanWarmthScore = Math.min(100, humanWarmth);
  
  // Calculate readability (sentence length, paragraph density)
  const avgSentenceLength = sentences.reduce((sum, s) => 
    sum + s.split(/\s+/).length, 0) / sentences.length;
  const readabilityScore = avgSentenceLength <= 20 ? 100 : 
    Math.max(0, 100 - (avgSentenceLength - 20) * 5);
  
  // Calculate actionability (presence of action words)
  let actionCount = 0;
  ACTIONABLE_ADVICE_FRAMES.forEach(frame => {
    if (content.toLowerCase().includes(frame.toLowerCase())) {
      actionCount++;
    }
  });
  const actionabilityScore = Math.min(100, actionCount * 20);
  
  // Visual variety score (placeholder - would need actual visual analysis)
  const visualVarietyScore = 70; // Default assumption
  
  // Anchor quality score (placeholder - would need link analysis)
  const anchorQualityScore = 70; // Default assumption
  
  // Overall score
  const overallScore = Math.round(
    (humanWarmthScore * 0.3) +
    (readabilityScore * 0.25) +
    (actionabilityScore * 0.2) +
    (visualVarietyScore * 0.15) +
    (anchorQualityScore * 0.1)
  );
  
  return {
    humanWarmthScore,
    readabilityScore,
    actionabilityScore,
    visualVarietyScore,
    anchorQualityScore,
    overallScore,
  };
}

// ============================================================================
// ENHANCED PROMPT GENERATION
// ============================================================================

/**
 * Generates enhanced content generation prompts with quality requirements
 */
export function generateQualityEnhancedPrompt(
  topic: string,
  targetAudience: string,
  keywords: string[]
): string {
  return `
You are an expert content writer creating engaging, human-like blog content.

**CRITICAL QUALITY REQUIREMENTS:**

1. **Human Warmth & Conversational Tone:**
   - Start paragraphs with conversational openers like "Let's be honest:" or "Here's the thing:"
   - Use empathy phrases like "I totally get it" and "You're not alone"
   - Write as if speaking directly to a friend
   - Avoid robotic, corporate language

2. **Readability (8th Grade Level):**
   - Keep sentences under 20 words
   - Break paragraphs after 3-4 sentences
   - Use simple, everyday vocabulary
   - Avoid jargon unless absolutely necessary

3. **Actionable Advice:**
   - Include practical, step-by-step guidance
   - Use phrases like "Start by" and "Try this today:"
   - Provide concrete examples
   - Give readers clear next steps

4. **Natural Flow:**
   - Use transition phrases like "But here's the kicker:" and "Now, here's where it gets interesting:"
   - Vary sentence structure
   - Mix short punchy sentences with longer explanatory ones

5. **Engagement:**
   - Ask rhetorical questions
   - Use "you" and "your" frequently
   - Tell brief stories or examples
   - Make it relatable

**Topic:** ${topic}
**Target Audience:** ${targetAudience}
**Primary Keywords:** ${keywords.join(', ')}

**Your task:**
Write comprehensive, engaging blog content that feels genuinely human and helpful. Focus on connecting with readers emotionally while providing massive value.
`;
}

// ============================================================================
// PARAGRAPH BREAK OPTIMIZER
// ============================================================================

/**
 * Optimizes paragraph breaks for better scannability
 */
export function optimizeParagraphBreaks(content: string): string {
  const sentences = content.split(/([.!?]+\s)/);
  let result = '';
  let sentenceCount = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    result += sentence + ' ';
    
    if (sentence.match(/[.!?]$/)) {
      sentenceCount++;
      
      // Add paragraph break after 3-4 sentences
      if (sentenceCount >= 3 && Math.random() > 0.5) {
        result += '\n\n';
        sentenceCount = 0;
      }
    }
  }
  
  return result.trim();
}

// ============================================================================
// VISUAL COMPONENT SUGGESTIONS
// ============================================================================

export interface VisualSuggestion {
  type: 'stat' | 'quote' | 'tip' | 'warning' | 'example';
  content: string;
  placement: 'after-intro' | 'mid-content' | 'before-conclusion';
}

/**
 * Generates visual component suggestions based on content
 */
export function generateVisualSuggestions(
  content: string,
  topic: string
): VisualSuggestion[] {
  const suggestions: VisualSuggestion[] = [];
  
  // Add stat suggestion
  suggestions.push({
    type: 'stat',
    content: `Did you know? [Relevant statistic about ${topic}]`,
    placement: 'after-intro',
  });
  
  // Add tip suggestion
  suggestions.push({
    type: 'tip',
    content: `Pro Tip: [Insider advice for ${topic}]`,
    placement: 'mid-content',
  });
  
  // Add quote suggestion
  suggestions.push({
    type: 'quote',
    content: `"[Expert quote about ${topic}]"`,
    placement: 'mid-content',
  });
  
  return suggestions;
}

// ============================================================================
// EXPORT ALL ENHANCER FUNCTIONS
// ============================================================================

export const ContentQualityEnhancer = {
  conversationalOpeners: CONVERSATIONAL_OPENERS,
  empathyPhrases: EMPATHY_PHRASES,
  transitionPhrases: TRANSITION_PHRASES,
  actionableFrames: ACTIONABLE_ADVICE_FRAMES,
  vocabularySimplification: VOCABULARY_SIMPLIFICATION,
  anchorTextRules: ANCHOR_TEXT_RULES,
  isValidAnchorText,
  generateRichAnchorText,
  analyzeContentQuality,
  generateQualityEnhancedPrompt,
  optimizeParagraphBreaks,
  generateVisualSuggestions,
};

export default ContentQualityEnhancer;
