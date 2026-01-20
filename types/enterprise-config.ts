// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO - ENTERPRISE CONFIGURATION TYPES v41.0
// ═══════════════════════════════════════════════════════════════════════════════
// 🏢 SOTA Enterprise-Grade TypeScript Interfaces for Configuration Management
// Provides comprehensive type safety for Site Context and Optimization settings
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Site Context Configuration
 * Captures essential business context for content generation optimization
 * Used by AI to generate highly relevant, contextually appropriate content
 */
export interface SiteContext {
  /** Organization or business name */
  organizationName: string;
  
  /** Primary author or content creator name */
  authorName: string;
  
  /** Industry or business vertical (e.g., "Technology", "Healthcare", "Finance") */
  industry: string;
  
  /** Target audience description (e.g., "B2B SaaS executives", "Small business owners") */
  targetAudience: string;
}

/**
 * Optimization Mode Type
 * Defines the content optimization strategy
 */
export type OptimizationMode = 'surgical' | 'rewrite';

/**
 * Image Optimization Settings
 * Controls how images are handled during content optimization
 */
export interface ImageOptimizationSettings {
  /** Preserve existing images in the content */
  preserveImages: boolean;
  
  /** Optimize image alt text for SEO and accessibility */
  optimizeAltText: boolean;
  
  /** Keep the featured/hero image */
  
  /** Real-time statistics tracking */
  realTimeStats?: boolean;

  /** Optimization mode: 'surgical' or 'rewrite' */
  optimizationMode?: 'surgical' | 'rewrite';

  /** Preserve existing images in the content */
  preserveImages?: boolean;
  keepFeaturedImage: boolean;
}

/**
 * Content Optimization Configuration
 * Comprehensive settings for content optimization behavior
 */
export interface OptimizationConfig {
  /** Optimization mode: 'surgical' for targeted improvements, 'rewrite' for complete regeneration */
  mode: OptimizationMode;
  
  /** Image handling settings */
  imageSettings: ImageOptimizationSettings;
  
  /** Preserve existing categories */
  preserveCategories: boolean;
  
  /** Preserve existing tags */
  preserveTags: boolean;
}

/**
 * Complete Enterprise Configuration
 * Combines all configuration aspects for the enterprise application
 */
export interface EnterpriseConfig {
  /** Site context for content personalization */
  siteContext: SiteContext;
  
  /** Optimization configuration */
  optimization: OptimizationConfig;
  
  /** Configuration timestamp */
  lastUpdated: number;
  
  /** Configuration version for migration compatibility */
  version: string;
}

/**
 * Default Site Context
 * Provides sensible defaults for new installations
 */
export const DEFAULT_SITE_CONTEXT: SiteContext = {
  organizationName: '',
  authorName: '',
  industry: '',
  targetAudience: ''
};

/**
 * Default Optimization Configuration
 * Provides safe, sensible defaults for content optimization
 */
export const DEFAULT_OPTIMIZATION_CONFIG: OptimizationConfig = {
  mode: 'surgical',
  imageSettings: {
    preserveImages: true,
    optimizeAltText: true,
    keepFeaturedImage: true
  },
  preserveCategories: true,
  preserveTags: true
};

/**
 * Validation helper for Site Context
 * Ensures all required fields are properly filled
 */
export function validateSiteContext(context: SiteContext): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!context.organizationName || context.organizationName.trim().length === 0) {
    errors.push('Organization name is required');
  }
  
  if (!context.authorName || context.authorName.trim().length === 0) {
    errors.push('Author name is required');
  }
  
  if (!context.industry || context.industry.trim().length === 0) {
    errors.push('Industry is required');
  }
  
  if (!context.targetAudience || context.targetAudience.trim().length === 0) {
    errors.push('Target audience is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Industry suggestions for common business verticals
 * Provides autocomplete/dropdown options
 */
export const INDUSTRY_OPTIONS = [
  'Technology & Software',
  'Healthcare & Medical',
  'Finance & Banking',
  'E-commerce & Retail',
  'Marketing & Advertising',
  'Real Estate',
  'Education & E-learning',
  'Manufacturing',
  'Professional Services',
  'Travel & Hospitality',
  'Food & Beverage',
  'Media & Entertainment',
  'Automotive',
  'Fashion & Beauty',
  'Non-Profit & NGO',
  'Other'
] as const;

/**
 * Get enterprise config from localStorage
 * Safely retrieves and parses stored configuration
 */
export function loadEnterpriseConfig(): EnterpriseConfig | null {
  try {
    const stored = localStorage.getItem('wpo_enterprise_config_v41');
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as EnterpriseConfig;
    
    // Validate version compatibility
    if (parsed.version !== '41.0') {
      console.warn('Enterprise config version mismatch, using defaults');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load enterprise config:', error);
    return null;
  }
}

/**
 * Save enterprise config to localStorage
 * Safely stores configuration with error handling
 */
export function saveEnterpriseConfig(config: EnterpriseConfig): boolean {
  try {
    config.lastUpdated = Date.now();
    config.version = '41.0';
    localStorage.setItem('wpo_enterprise_config_v41', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save enterprise config:', error);
    return false;
  }
}
