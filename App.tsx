740
738
// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v42.0 — ENTERPRISE SOTA MAIN APPLICATION// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 SOTA ENTERPRISE FEATURES:
// ✅ Content Strategy Dashboard with Real-time Stats
// ✅ Quick Optimize for Single-page Optimization  
// ✅ Bulk Optimization Mode with Queue Management
// ✅ Activity Log with Real-time Tracking
// ✅ Analytics & Performance Metrics Dashboard
// ✅ Optimization Mode (Surgical vs Full Rewrite)
// ✅ Content Preservation Controls (Images, Categories, Tags)
// ✅ Manual AI Model Input for OpenRouter & Groq
// ✅ Smart Model Selection with Validation
// ✅ Enhanced Error Handling & Recovery
// ✅ Responsive Enterprise UI
// ✅ Real-time Progress Tracking
// ✅ Persistent Configuration
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
    orchestrator,
    AI_ORCHESTRATOR_VERSION,
    VALID_GEMINI_MODELS,
    OPENROUTER_MODELS,
    GROQ_MODELS,
    StageProgress,
    GenerationResult
} from './lib/ai-orchestrator';
import { crawlSitemap, convertToInternalLinkTargets } from './lib/sitemap-crawler';
import {
    validateWordPressConnection,
    publishToWordPress,
    WordPressConfig
} from './lib/wordpress-publisher';
import { updateExistingPost, fetchExistingPost, batchUpdatePosts } from './lib/wordpress-post-updater';
import {
    ContentContract,
    GenerateConfig,
    InternalLinkTarget,
    BulkGenerationResult,
    APIKeyConfig, CrawledPage
} from './types';
import {
  OptimizationPage,
  OptimizationJob,
  ActivityLogEntry,
  AnalyticsMetrics,
  SessionStatistics,
  PageStatus,
  ActivityType,
  QuickOptimizeRequest,
        BulkOptimizeRequest,
  PageQueueFilters,
  DEFAULT_ANALYTICS_METRICS,
  DEFAULT_SESSION_STATS,
  generateId,
  isPageAtTarget,
  getStatusColor,
  getStatusIcon,
  STORAGE_KEYS
} from './types/optimization-system';
import {
  SiteContext,
  OptimizationConfig,
  DEFAULT_SITE_CONTEXT,
  DEFAULT_OPTIMIZATION_CONFIG,
  INDUSTRY_OPTIONS,
  validateSiteContext,
  loadEnterpriseConfig,
  saveEnterpriseConfig
} from './types/enterprise-config';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 ENTERPRISE DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
    // Primary Palette
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    
    // Semantic Colors
    success: '#22c55e',
    successLight: '#4ade80',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    danger: '#ef4444',
    dangerLight: '#f87171',
    info: '#3b82f6',
    infoLight: '#60a5fa',
    
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
    
    // Gradients
    gradPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    gradSuccess: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    gradDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    gradPurple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradOcean: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 ENTERPRISE STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
    container: {
        minHeight: '100vh',
        background: COLORS.gradOcean,
        color: '#e2e8f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px'
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.2)'
    },
    title: {
        fontSize: '36px',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '16px',
        color: '#94a3b8',
        margin: 0
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        maxWidth: '1600px',
        margin: '0 auto'
    },
    card: {
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        backdropFilter: 'blur(10px)'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#f1f5f9',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '12px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box' as const
    },
    inputFocused: {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)'
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '12px',
        outline: 'none',
        cursor: 'pointer',
        boxSizing: 'border-box' as const
    },
    textarea: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '12px',
        outline: 'none',
        resize: 'vertical' as const,
        minHeight: '100px',
        fontFamily: 'inherit',
        boxSizing: 'border-box' as const
    },
    button: {
        padding: '14px 28px',
        background: COLORS.gradPrimary,
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
    },
    buttonSecondary: {
        padding: '14px 28px',
        background: 'transparent',
        border: '2px solid rgba(99, 102, 241, 0.5)',
        borderRadius: '10px',
        color: '#a5b4fc',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    buttonDanger: {
        padding: '14px 28px',
        background: COLORS.gradDanger,
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: '6px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
    },
    labelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
    },
    logContainer: {
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '10px',
        padding: '16px',
        maxHeight: '300px',
        overflowY: 'auto' as const,
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '12px',
        lineHeight: '1.6',
        marginTop: '16px'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '12px'
    },
    progressFill: {
        height: '100%',
        background: COLORS.gradPrimary,
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    badge: {
        display: 'inline-block',
        padding: '4px 10px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#a5b4fc',
        textTransform: 'uppercase' as const
    },
    stat: {
        textAlign: 'center' as const,
        padding: '16px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
        flex: 1
    },
    statValue: {
        fontSize: '28px',
        fontWeight: 900,
        color: '#a5b4fc',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '11px',
        color: '#64748b',
        textTransform: 'uppercase' as const
    },
    preview: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        color: '#1f2937',
        maxHeight: '500px',
        overflowY: 'auto' as const,
        fontSize: '16px',
        lineHeight: '1.7'
    },
    // Toggle Switch Styles
    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    toggleSwitch: {
        position: 'relative' as const,
        width: '44px',
        height: '24px',
        background: 'rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    toggleSwitchActive: {
        background: COLORS.primary
    },
    toggleKnob: {
        position: 'absolute' as const,
        top: '2px',
        left: '2px',
        width: '20px',
        height: '20px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    toggleKnobActive: {
        transform: 'translateX(20px)'
    },
    toggleLabel: {
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: 500
    },
    helpText: {
        fontSize: '11px',
        color: '#64748b',
        margin: '4px 0 12px 0',
        lineHeight: '1.4'
    },
    modelInputContainer: {
        position: 'relative' as const
    },
    modelValidation: {
        position: 'absolute' as const,
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '14px'
    },
    divider: {
        border: 'none',
        borderTop: '1px solid rgba(99,102,241,0.2)',
        margin: '20px 0'
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 CUSTOM TOGGLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled }) => (
    <div style={styles.toggleContainer}>
        <div
            style={{
                ...styles.toggleSwitch,
                ...(checked ? styles.toggleSwitchActive : {}),
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div style={{
                ...styles.toggleKnob,
                ...(checked ? styles.toggleKnobActive : {})
            }} />
        </div>
        {label && <span style={styles.toggleLabel}>{label}</span>}
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🔍 MODEL VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const validateModelFormat = (model: string, provider: 'openrouter' | 'groq'): { valid: boolean; message: string } => {
    if (!model || model.trim().length === 0) {
        return { valid: false, message: 'Model ID required' };
    }

    const trimmed = model.trim();

    if (provider === 'openrouter') {
        // OpenRouter models typically follow: provider/model-name format
        if (trimmed.includes('/') && trimmed.length >= 5) {
            return { valid: true, message: '✓ Valid format' };
        }
        if (trimmed.length >= 3) {
            return { valid: true, message: '⚠ Checking...' };
        }
        return { valid: false, message: 'Use format: provider/model' };
    }

    if (provider === 'groq') {
        // Groq models are typically: model-name-version
        if (trimmed.length >= 5 && /^[a-z0-9-]+$/i.test(trimmed)) {
            return { valid: true, message: '✓ Valid format' };
        }
        return { valid: false, message: 'Invalid model format' };
          }
          
  // Default return for other providers
  return { valid: true, message: '' };
};

    
export default function App() {
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    // API Keys with persistence
    const [apiKeys, setApiKeys] = useState<APIKeyConfig>(() => {
        const saved = localStorage.getItem('wpo_api_keys_v2');
        return saved ? JSON.parse(saved) : {};
    });
    
    // Provider & Model Selection
    const [provider, setProvider] = useState<'google' | 'openrouter' | 'openai' | 'anthropic' | 'groq'>('google');
    const [model, setModel] = useState('gemini-2.5-flash-preview-05-20');
    
    // 🆕 SOTA FEATURE: Manual Model Input Toggle
    const [useCustomOpenRouterModel, setUseCustomOpenRouterModel] = useState(false);
    const [useCustomGroqModel, setUseCustomGroqModel] = useState(false);
    const [customOpenRouterModel, setCustomOpenRouterModel] = useState('');
    const [customGroqModel, setCustomGroqModel] = useState('');
    
    // Content Generation State
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<StageProgress | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
      const [result, setResult] = useState<GenerationResult | null>(null);
    
    // Sitemap Crawler State
      const [wpConfig, setWpConfig] = useState<WordPressConfig>(() => {
    const saved = localStorage.getItem('wpo_wp_config_v2');
    return saved ? JSON.parse(saved) : { isStored: '', userNAME: '', applicationPassword: '' };
  });
      const [sitemapUrl, setSitemapUrl] = useState('');
      const [isCrawling, setIsCrawling] = useState(false);
      const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([]);
      const [internalLinks, setInternalLinks] = useState<InternalLinkTarget[]>([]);
      const [wpConnected, setWpConnected] = useState(false);
      const [wpSiteName, setWpSiteName] = useState('');
      const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
      const [isOptimizingExisting, setIsOptimizingExisting] = useState(false);
    
  // 🏢 SITE CONTEXT & OPTIMIZATION CONFIG STATE (SOTA v41.0)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const [siteContext, setSiteContext] = useState<SiteContext>(() => {
    const loaded = loadEnterpriseConfig();
    return loaded?.siteContext || DEFAULT_SITE_CONTEXT;
  });

      // ═════════════════════════════════════════════════════════════════
  // 📊 OPTIMIZATION SYSTEM STATE (SOTA v42.0) 
  // ═════════════════════════════════════════════════════════════════
  
  // Pages for optimization queue
  const [pages, setPages] = useState<OptimizationPage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PAGES);
    return stored ? JSON.parse(stored) : [];
  });
  
  // Analytics metrics
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
    return stored ? JSON.parse(stored) : DEFAULT_ANALYTICS_METRICS;
  });
  
  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
    return stored ? JSON.parse(stored) : [];
  });
  
  // Session statistics
  const [sessionStats, setSessionStats] = useState<SessionStatistics>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION_STATS);
    return stored ? JSON.parse(stored) : DEFAULT_SESSION_STATS;
  });
      const [optimizationConfig, setOptimizationConfig] = useState<OptimizationConfig>(() => {
              const loaded = loadEnterpriseConfig();
              return loaded?.optimization || DEFAULT_OPTIMIZATION_CONFIG;
            });
  
  // Recent jobs
  const [recentJobs, setRecentJobs] = useState<OptimizationJob[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_JOBS);
    return stored ? JSON.parse(stored) : [];
  });
  
  // Quick optimize form state
  const [quickOptimizeUrl, setQuickOptimizeUrl] = useState('');
  const [quickOptimizeKeyword, setQuickOptimizeKeyword] = useState('');
  const [quickOptimizeMode, setQuickOptimizeMode] = useState<'surgical' | 'rewrite'>('surgical');
  const [quickOptimizeAutoPublish, setQuickOptimizeAutoPublish] = useState(false);
  const [isQuickOptimizing, setIsQuickOptimizing] = useState(false);
  
  // Bulk optimization state
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isBulkOptimizing, setIsBulkOptimizing] = useState(false);
  const [bulkOptimizeMode, setBulkOptimizeMode] = useState<'surgical' | 'rewrite'>('surgical');
  const [bulkAutoPublish, setBulkAutoPublish] = useState(false);
  
  // Page queue filters
  const [pageFilter, setPageFilter] = useState<PageStatus | 'all'>('all');
  const [pageSearchQuery, setPageSearchQuery] = useState('');
    
    // Refs
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧮 COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Get the effective model based on provider and custom toggle
    const effectiveModel = useMemo(() => {
        if (provider === 'openrouter') {
            return useCustomOpenRouterModel && customOpenRouterModel.trim()
                ? customOpenRouterModel.trim()
                : apiKeys.openrouterModel || OPENROUTER_MODELS[0];
        }
        if (provider === 'groq') {
            return useCustomGroqModel && customGroqModel.trim()
                ? customGroqModel.trim()
                : apiKeys.groqModel || GROQ_MODELS[0];
        }
        return model;
    }, [provider, useCustomOpenRouterModel, customOpenRouterModel, useCustomGroqModel, customGroqModel, apiKeys, model]);
    
    // Model validation for custom inputs
    const openRouterValidation = useMemo(() => 
        validateModelFormat(customOpenRouterModel, 'openrouter'), 
        [customOpenRouterModel]
    );
    
    const groqValidation = useMemo(() => 
        validateModelFormat(customGroqModel, 'groq'), 
        [customGroqModel]
    );
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 EFFECTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Persist API keys
    useEffect(() => {
        localStorage.setItem('wpo_api_keys_v2', JSON.stringify(apiKeys));
    }, [apiKeys]);
    
    // Persist WP config
    useEffect(() => {
        localStorage.setItem('wpo_wp_config_v2', JSON.stringify(wpConfig));
    }, [wpConfig]);
    
    // Persist custom model settings
    useEffect(() => {
        localStorage.setItem('wpo_custom_models', JSON.stringify({
            useCustomOpenRouterModel,
            useCustomGroqModel,
            customOpenRouterModel,
            customGroqModel
        }));
          }, [useCustomOpenRouterModel, useCustomGroqModel, customOpenRouterModel, customGroqModel]);

      // Persist enterprise configuration (Site Context + Optimization Config)

  useEffect(() => {
    const enterpriseConfig = {
      siteContext,
      optimization: optimizationConfig,
      lastUpdated: Date.now(),
      version: '41.0'
    };
    saveEnterpriseConfig(enterpriseConfig);
  }, [siteContext, optimizationConfig]);
    
    // Load custom model settings on mount
    useEffect(() => {
    const saved            = localStorage.getItem('wpo_custom_models');
        if (saved) {
            const parsed = JSON.parse(saved);
            setUseCustomOpenRouterModel(parsed.useCustomOpenRouterModel || false);
            setUseCustomGroqModel(parsed.useCustomGroqModel || false);
            setCustomOpenRouterModel(parsed.customOpenRouterModel || '');
            setCustomGroqModel(parsed.customGroqModel || '');
        }
    }, []);
    
    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 LOGGING FUNCTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    const log = useCallback((msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-200), `[${timestamp}] ${msg}`]);
        console.log(`[WPO] ${msg}`);
    }, []);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🕷️ SITEMAP CRAWLER
    // ═══════════════════════════════════════════════════════════════════════════
    
    const handleCrawlSitemap = useCallback(async () => {
        if (!sitemapUrl.trim()) {
            log('❌ Please enter a sitemap URL');
            return;
        }
        
        setIsCrawling(true);
        setCrawledPages([]);
        setInternalLinks([]);
        
        try {
            const pages = await crawlSitemap(
                sitemapUrl,
                log,
                (current, total) => {
                    log(`   📊 Progress: ${current}/${total} URLs`);
                }
            );
            
            setCrawledPages(pages);
            
            const links = convertToInternalLinkTargets(pages);
            setInternalLinks(links);
            
            log(`✅ Crawl complete: ${pages.length} pages ready for internal linking`);
            
        } catch (error: any) {
            log(`❌ Crawl failed: ${error.message}`);
        } finally {
            setIsCrawling(false);
        }
    }, [sitemapUrl, log]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 CONTENT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════


      // ═══════════════════════════════════════════════════════════════════════════════
  // 🔄 EXISTING POST OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleOptimizeSelected = useCallback(async () => {
    if (selectedUrls.size === 0) {
      log('⚠️ Please select at least one URL to optimize');
      return;
    }

    setIsOptimizingExisting(true);
    const urlsArray = Array.from(selectedUrls);
    log(`🚀 Starting optimization for ${urlsArray.length} existing posts...`);

    try {
      for (const url of urlsArray) {
        try {
          log(`📥 Fetching existing post: ${url}`);
          
          // Fetch the existing post content
          const existingPost = await fetchExistingPost(url, wpConfig);
          
          if (!existingPost) {
            log(`❌ Could not fetch post at ${url}`);
            continue;
          }

          log(`✨ Optimizing content for: ${existingPost.title}`);

          // Create optimization request
          const config: GenerateConfig = {
            topic: existingPost.title,
            targetWordCount: existingPost.content?.length || 2000,
          };

          // Generate optimized content
      const result = await orchestrator.generate(config, log, (p) => {});
              }
      } catch (error: any) {    log(`❌ Error during optimization: ${error.message}`);
  }
              }
} finally {
    setIsOptimizingExisting(false);
  }}, [log]);

      // Return minimal JSX since actual UI is in components.tsx
  return <div>Loading...</div>;
}
    }
