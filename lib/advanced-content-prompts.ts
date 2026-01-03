// WP Optimizer Pro v28.0 - Advanced Content Generation Prompts
// Enterprise-Grade SOTA Content & Copywriting Module
// Implements Alex Hormozi Style + Neuroscience-Driven Copywriting

// SOTA Content Framework - Problem-Agitation-Solution-Outcome
export const HORMOZI_STYLE_PROMPTS = {
  // Problem identification & amplification
  problemAmplification: {
    pattern: 'Most [target_audience] don\'t realize that [hidden_problem].',
    variations: [
      'Most WordPress sites are hemorrhaging organic traffic due to [problem].',
      'Almost all [niche] businesses fail to [desired_outcome] because of [root_cause].',
      'The biggest mistake [target_audience] make is [costly_mistake].',
      'What most people don\'t know about [topic] is [counterintuitive_truth].',
    ],
  },
  
  // Agitation & curiosity loops
  agitationLoops: {
    pattern: 'Not only is [problem] costly, but it also [secondary_consequence].',
    variations: [
      'If you don\'t fix [problem], you\'ll lose [valuable_outcome] to competitors.',
      'This mistake costs [target_audience] an average of [quantified_loss].',
      'The longer you wait, the more [negative_metric] grows exponentially.',
      'Your competitors already know this secret... [creates_urgency].',
    ],
  },
  
  // Solution introduction (pattern interrupt)
  solutionIntro: {
    pattern: 'Here\'s what most [niche] get wrong about [topic]: [counter_belief].',
    variations: [
      'The real secret to [desired_outcome] is [counterintuitive_insight].',
      'What if I told you there\'s a way to [outcome] without [common_sacrifice]?',
      'The system we\'ve built specifically solves [unique_angle].',
      'After helping [number] clients, we discovered the real reason [outcome] works.',
    ],
  },
  
  // Transformation narrative
  transformationNarrative: {
    pattern: 'Imagine if you could [desired_outcome] by simply [elegant_solution].',
    variations: [
      'Picture this: [day] where your [metric] increased by [specific_percentage].',
      'What would change if you could [outcome] without [pain_point]?',
      'Our clients went from [before_state] to [after_state] in [timeframe].',
      'Think about the possibilities when [outcome] becomes your reality.',
    ],
  },
  
  // Social proof & specificity
  socialProof: {
    pattern: '[Number] [target_audience] have already [outcome] using [system_name].',
    variations: [
      '[Percentage]% of our clients see [specific_metric] improvement within [timeframe].',
      '[Company_name] increased their [metric] by [number] using our approach.',
      'From a [initial_state], they now [desired_state]. Here\'s how...',
      'The average client we work with gains [specific_value] in [measurable_unit].',
    ],
  },
  
  // Urgency & scarcity
  urgencyElements: {
    pattern: '[Limited_resource] available for serious entrepreneurs only.',
    variations: [
      'Only [number] spots available for [month] due to demand.',
      'We\'re closing this to new [target_audience] after [date].',
      'The [window_of_opportunity] to implement this is closing fast.',
      'Those who act now get [exclusive_benefit] for free.',
    ],
  },
  
  // Guarantee framing
  guaranteeFraming: {
    pattern: 'Risk-free: See [outcome] or we\'ll [refund_condition].',
    variations: [
      'If you don\'t see [specific_metric] by [date], we give you [refund_terms].',
      '30-day guarantee: [Desired_result] or 100% of your investment back.',
      'Try risk-free for [period]. Keep the results, get your money back if not.',
    ],
  },
};

// Content Quality Enhancement System
export interface ContentQualityFramework {
  emotionalResonance: number; // 0-100 based on power words
  specificity: number; // 0-100 based on concrete details
  novelty: number; // 0-100 based on unique angle
  credibility: number; // 0-100 based on evidence
  actionability: number; // 0-100 based on clear next steps
}

// SOTA Blog Content Structure
export const ENTERPRISE_BLOG_STRUCTURE = {
  headline: {
    minWords: 8,
    maxWords: 16,
    patterns: [
      '[Number] [Result] Using [Method]',
      'How [Specific_Case] [Achieved_Outcome]',
      '[Counterintuitive] Truth About [Topic]',
      'The [Superlative] [Metric] In [Industry]',
    ],
  },
  
  introduction: {
    structure: [
      '1. Problem statement (2-3 sentences)',
      '2. Why it matters (emotional + financial)',
      '3. Preview of solution (curiosity gap)',
      '4. Promise of outcome (specific measurable)',
    ],
  },
  
  mainBody: {
    sections: [
      'The Underlying Problem (Root cause analysis)',
      'Why Most Solutions Fail (Common mistakes)',
      'The SOTA Framework (Proprietary system)',
      'Implementation Roadmap (Step-by-step)',
      'Real-World Case Studies (Proof)',
    ],
    contentDepth: 'Minimum 2000 words, enterprise-grade detail',
    internalLinks: 'Minimum 8-12 contextual links with rich anchor text',
    images: 'Visual proof, data visualizations, case study graphics',
  },
  
  conclusion: {
    structure: [
      '1. Key takeaway summary',
      '2. Transformation promise',
      '3. Call-to-action (specific, urgent)',
      '4. P.S. line (additional incentive)',
    ],
  },
};

// Power words that increase emotional resonance
export const POWER_WORDS = {
  curiosity: ['discover', 'uncover', 'reveal', 'secret', 'hidden', 'breakthrough', 'proprietary'],
  urgency: ['now', 'today', 'immediately', 'limited time', 'closing', 'deadline', 'before'],
  authority: ['proven', 'research-backed', 'science-based', 'expert', 'certified', 'validated'],
  emotion: ['breakthrough', 'transform', 'accelerate', 'dominate', 'eliminate', 'guarantee'],
  specificity: ['exactly', 'precisely', 'specifically', 'concrete', 'detailed', 'step-by-step'],
};

// Content Quality Scoring Engine
export class ContentQualityEngine {
  // Calculate headline effectiveness score
  static scoreHeadline(headline: string): number {
    let score = 0;
    
    // Word count optimization (8-16 words optimal)
    const wordCount = headline.split(/\s+/).length;
    score += Math.min(100, (wordCount / 12) * 100) * 0.2;
    
    // Power words presence
    const powerWordCount = Object.values(POWER_WORDS).flat()
      .filter(word => headline.toLowerCase().includes(word)).length;
    score += Math.min(100, (powerWordCount / 3) * 100) * 0.3;
    
    // Number presence (headlines with numbers perform 36% better)
    const hasNumber = /\d+/.test(headline);
    score += hasNumber ? 30 : 0;
    
    // Question format or curiosity gap
    const hasCuriosityGap = /[?:]|how|why|what|which/.test(headline.toLowerCase());
    score += hasCuriosityGap ? 20 : 0;
    
    return Math.min(100, score);
  }
  
  // Calculate overall content quality
  static scoreContent(content: ContentQualityFramework): number {
    const weights = {
      emotionalResonance: 0.25,
      specificity: 0.25,
      novelty: 0.20,
      credibility: 0.20,
      actionability: 0.10,
    };
    
    return (
      (content.emotionalResonance * weights.emotionalResonance) +
      (content.specificity * weights.specificity) +
      (content.novelty * weights.novelty) +
      (content.credibility * weights.credibility) +
      (content.actionability * weights.actionability)
    );
  }
}

// Export everything
export const AdvancedContentPrompts = {
  hormozi: HORMOZI_STYLE_PROMPTS,
  blogStructure: ENTERPRISE_BLOG_STRUCTURE,
  powerWords: POWER_WORDS,
  qualityEngine: ContentQualityEngine,
};
