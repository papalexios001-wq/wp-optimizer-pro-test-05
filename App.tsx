// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v40.0 — ENTERPRISE SOTA MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 SOTA ENTERPRISE FEATURES:
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
import {
    ContentContract,
    GenerateConfig,
    CrawledPage,
    InternalLinkTarget,
    BulkGenerationResult,
    APIKeyConfig
} from './types';
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

    return { valid: true, message: '' };
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

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
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    
    // Sitemap Crawler State
    const [sitemapUrl, setSitemapUrl] = useState('');
    const [isCrawling, setIsCrawling] = useState(false);
    const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([]);
    const [internalLinks, setInternalLinks] = useState<InternalLinkTarget[]>([]);
    
    // WordPress State
    const [wpConfig, setWpConfig] = useState<WordPressConfig>(() => {
        const saved = localStorage.getItem('wpo_wp_config_v2');
        return saved ? JSON.parse(saved) : { siteUrl: '', username: '', applicationPassword: '' };
    });
    const [wpConnected, setWpConnected] = useState(false);
    const [wpSiteName, setWpSiteName] = useState('');

      // ═══════════════════════════════════════════════════════════════════════════
  // 🏢 SITE CONTEXT & OPTIMIZATION CONFIG STATE (SOTA v41.0)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const [siteContext, setSiteContext] = useState<SiteContext>(() => {
    const loaded = loadEnterpriseConfig();
    return loaded?.siteContext || DEFAULT_SITE_CONTEXT;
  });
  
  const [optimizationConfig, setOptimizationConfig] = useState<OptimizationConfig>(() => {
    const loaded = loadEnterpriseConfig();
    return loaded?.optimization || DEFAULT_OPTIMIZATION_CONFIG;
  });
    
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
    }, [useCustomOpenRouterModel, useCustomGroqModel, customOpenRouterModel, customGroqModel]);
    
    // Load custom model settings on mount
    useEffect(() => {
        const saved = localStorage.getItem('wpo_custom_models');
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
    
    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) {
            log('❌ Please enter a topic');
            return;
        }
        
        // Validate API key for selected provider
        const providerKeyMap: Record<string, string | undefined> = {
            google: apiKeys.google,
            openrouter: apiKeys.openrouter,
            openai: apiKeys.openai,
            anthropic: apiKeys.anthropic,
            groq: apiKeys.groq
        };
        
        if (!providerKeyMap[provider]) {
            log(`❌ Please enter your ${provider.toUpperCase()} API key`);
            return;
        }
        
        // Validate custom model if using one
        if (provider === 'openrouter' && useCustomOpenRouterModel) {
            if (!customOpenRouterModel.trim()) {
                log('❌ Please enter a custom OpenRouter model ID');
                return;
            }
        }
        
        if (provider === 'groq' && useCustomGroqModel) {
            if (!customGroqModel.trim()) {
                log('❌ Please enter a custom Groq model ID');
                return;
            }
        }
        
        setIsGenerating(true);
        setProgress(null);
        setResult(null);
        setLogs([]);
        
        // Log configuration
        log('🔑 Configuration Check:');
        log(`   → Provider: ${provider.toUpperCase()}`);
        log(`   → Model: ${effectiveModel}`);
        log(`   → Custom Model: ${(provider === 'openrouter' && useCustomOpenRouterModel) || (provider === 'groq' && useCustomGroqModel) ? 'YES' : 'NO'}`);
        log(`   → Serper API: ${apiKeys.serper ? '✅' : '❌ MISSING (YouTube/References disabled)'}`);
        
        const config: GenerateConfig = {
            topic: topic.trim(),
            provider,
            model: effectiveModel,
            apiKeys: {
                google: apiKeys.google,
                openrouter: apiKeys.openrouter,
                openrouterModel: provider === 'openrouter' ? effectiveModel : apiKeys.openrouterModel,
                openai: apiKeys.openai,
                anthropic: apiKeys.anthropic,
                groq: apiKeys.groq,
                groqModel: provider === 'groq' ? effectiveModel : apiKeys.groqModel,
                serper: apiKeys.serper,
            },
            internalLinks: internalLinks.length > 0 ? internalLinks : undefined,
        };
        
        try {
            const generationResult = await orchestrator.generate(
                config,
                log,
                (p) => setProgress(p)
            );
            
            setResult(generationResult);
            log(`🎉 Generation complete!`);
            
        } catch (error: any) {
            log(`❌ Generation failed: ${error.message}`);
            
            // Enhanced error feedback
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                log('   💡 Tip: Check your API key - it may be invalid or expired');
            }
            if (error.message.includes('model')) {
                log('   💡 Tip: The model ID may be incorrect. Try selecting from presets.');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [topic, provider, effectiveModel, apiKeys, internalLinks, log, useCustomOpenRouterModel, customOpenRouterModel, useCustomGroqModel, customGroqModel]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 WORDPRESS CONNECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    const handleConnectWordPress = useCallback(async () => {
        if (!wpConfig.siteUrl || !wpConfig.username || !wpConfig.applicationPassword) {
            log('❌ Please fill in all WordPress credentials');
            return;
        }
        
        const validation = await validateWordPressConnection(wpConfig, log);
        
        if (validation.valid) {
            setWpConnected(true);
            setWpSiteName(validation.siteName || '');
            log(`✅ Connected to WordPress: ${validation.siteName}`);
        } else {
            setWpConnected(false);
            log(`❌ WordPress connection failed: ${validation.error}`);
        }
    }, [wpConfig, log]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📤 PUBLISH TO WORDPRESS
    // ═══════════════════════════════════════════════════════════════════════════
    
    const handlePublish = useCallback(async (status: 'publish' | 'draft' = 'draft') => {
        if (!result?.contract) {
            log('❌ No content to publish');
            return;
        }
        
        if (!wpConnected) {
            log('❌ Please connect to WordPress first');
            return;
        }
        
        const publishResult = await publishToWordPress(
            wpConfig,
            result.contract,
            { status },
            log
        );
        
        if (publishResult.success) {
            log(`✅ Published: ${publishResult.postUrl}`);
        } else {
            log(`❌ Publish failed: ${publishResult.error}`);
        }
    }, [result, wpConnected, wpConfig, log]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 COPY TO CLIPBOARD
    // ═══════════════════════════════════════════════════════════════════════════
    
    const handleCopyHtml = useCallback(() => {
        if (result?.contract?.htmlContent) {
            navigator.clipboard.writeText(result.contract.htmlContent);
            log('✅ HTML copied to clipboard');
        }
    }, [result, log]);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 RENDER
    // ═══════════════════════════════════════════════════════════════════════════
    
    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>🚀 WP Optimizer Pro</h1>
                <p style={styles.subtitle}>
                    Enterprise AI Content Generation Engine v{AI_ORCHESTRATOR_VERSION} — SOTA Edition
                </p>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={styles.badge}>Multi-Provider</span>
                    <span style={styles.badge}>Custom Models</span>
                    <span style={styles.badge}>YouTube Discovery</span>
                    <span style={styles.badge}>Enterprise Grade</span>
                </div>
            </header>
            
            <div style={styles.grid}>
                {/* ═══════════════════════════════════════════════════════════════════
                    🔑 API CONFIGURATION CARD — ENHANCED WITH MANUAL MODEL INPUT
                    ═══════════════════════════════════════════════════════════════════ */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>🔑 API Configuration</h2>
                    
                    {/* Provider Selection */}
                    <label style={styles.label}>AI Provider</label>
                    <select
                        style={styles.select}
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as any)}
                    >
                        <option value="google">Google (Gemini)</option>
                        <option value="openrouter">OpenRouter (100+ Models)</option>
                        <option value="openai">OpenAI (GPT-4o)</option>
                        <option value="anthropic">Anthropic (Claude)</option>
                        <option value="groq">Groq (Ultra-Fast)</option>
                    </select>
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        GOOGLE PROVIDER
                        ═══════════════════════════════════════════════════════════════ */}
                    {provider === 'google' && (
                        <>
                            <label style={styles.label}>Google API Key</label>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="AIza..."
                                value={apiKeys.google || ''}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
                            />
                            
                            <label style={styles.label}>Model</label>
                            <select
                                style={styles.select}
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            >
                                {Object.entries(VALID_GEMINI_MODELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        OPENROUTER PROVIDER — WITH MANUAL MODEL INPUT
                        ═══════════════════════════════════════════════════════════════ */}
                    {provider === 'openrouter' && (
                        <>
                            <label style={styles.label}>OpenRouter API Key</label>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="sk-or-..."
                                value={apiKeys.openrouter || ''}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, openrouter: e.target.value }))}
                            />
                            
                            {/* 🆕 Manual Model Toggle */}
                            <div style={styles.labelRow}>
                                <label style={styles.label}>Model Selection</label>
                                <ToggleSwitch
                                    checked={useCustomOpenRouterModel}
                                    onChange={setUseCustomOpenRouterModel}
                                    label={useCustomOpenRouterModel ? 'Custom' : 'Preset'}
                                />
                            </div>
                            
                            {!useCustomOpenRouterModel ? (
                                // Preset Model Dropdown
                                <>
                                    <select
                                        style={styles.select}
                                        value={apiKeys.openrouterModel || OPENROUTER_MODELS[0]}
                                        onChange={(e) => setApiKeys(prev => ({ ...prev, openrouterModel: e.target.value }))}
                                    >
                                        {OPENROUTER_MODELS.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <p style={styles.helpText}>
                                        Popular models from OpenRouter. Toggle "Custom" to use any model.
                                    </p>
                                </>
                            ) : (
                                // 🆕 Custom Model Input
                                <>
                                    <div style={styles.modelInputContainer}>
                                        <input
                                            type="text"
                                            style={{
                                                ...styles.input,
                                                paddingRight: '40px',
                                                borderColor: customOpenRouterModel && !openRouterValidation.valid 
                                                    ? COLORS.danger 
                                                    : customOpenRouterModel && openRouterValidation.valid 
                                                        ? COLORS.success 
                                                        : 'rgba(99, 102, 241, 0.3)'
                                            }}
                                            placeholder="e.g., openai/o3-mini, deepseek/deepseek-r1"
                                            value={customOpenRouterModel}
                                            onChange={(e) => setCustomOpenRouterModel(e.target.value)}
                                        />
                                        {customOpenRouterModel && (
                                            <span style={{
                                                ...styles.modelValidation,
                                                color: openRouterValidation.valid ? COLORS.success : COLORS.danger
                                            }}>
                                                {openRouterValidation.valid ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        ...styles.helpText,
                                        color: customOpenRouterModel && !openRouterValidation.valid 
                                            ? COLORS.dangerLight 
                                            : '#64748b'
                                    }}>
                                        {customOpenRouterModel ? openRouterValidation.message : 
                                            'Enter any OpenRouter model ID (e.g., anthropic/claude-3.5-sonnet, meta-llama/llama-3.3-70b-instruct)'}
                                    </p>
                                    
                                    {/* Quick Model Suggestions */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '11px', color: '#64748b', marginRight: '8px' }}>Quick picks:</span>
                                        {['openai/o3-mini', 'deepseek/deepseek-r1', 'anthropic/claude-3.5-sonnet'].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setCustomOpenRouterModel(m)}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: '4px',
                                                    padding: '2px 8px',
                                                    marginRight: '6px',
                                                    marginBottom: '4px',
                                                    fontSize: '10px',
                                                    color: '#a5b4fc',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {m.split('/')[1]}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        OPENAI PROVIDER
                        ═══════════════════════════════════════════════════════════════ */}
                    {provider === 'openai' && (
                        <>
                            <label style={styles.label}>OpenAI API Key</label>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="sk-..."
                                value={apiKeys.openai || ''}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                            />
                            <p style={styles.helpText}>
                                Uses GPT-4o by default — OpenAI's most capable model.
                            </p>
                        </>
                    )}
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        ANTHROPIC PROVIDER
                        ═══════════════════════════════════════════════════════════════ */}
                    {provider === 'anthropic' && (
                        <>
                            <label style={styles.label}>Anthropic API Key</label>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="sk-ant-..."
                                value={apiKeys.anthropic || ''}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                            />
                            <p style={styles.helpText}>
                                Uses Claude Sonnet 4 — Anthropic's latest flagship model.
                            </p>
                        </>
                    )}
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        GROQ PROVIDER — WITH MANUAL MODEL INPUT
                        ═══════════════════════════════════════════════════════════════ */}
                    {provider === 'groq' && (
                        <>
                            <label style={styles.label}>Groq API Key</label>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="gsk_..."
                                value={apiKeys.groq || ''}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, groq: e.target.value }))}
                            />
                            
                            {/* 🆕 Manual Model Toggle */}
                            <div style={styles.labelRow}>
                                <label style={styles.label}>Model Selection</label>
                                <ToggleSwitch
                                    checked={useCustomGroqModel}
                                    onChange={setUseCustomGroqModel}
                                    label={useCustomGroqModel ? 'Custom' : 'Preset'}
                                />
                            </div>
                            
                            {!useCustomGroqModel ? (
                                // Preset Model Dropdown
                                <>
                                    <select
                                        style={styles.select}
                                        value={apiKeys.groqModel || GROQ_MODELS[0]}
                                        onChange={(e) => setApiKeys(prev => ({ ...prev, groqModel: e.target.value }))}
                                    >
                                        {GROQ_MODELS.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <p style={styles.helpText}>
                                        Ultra-fast inference. Toggle "Custom" to use any Groq model.
                                    </p>
                                </>
                            ) : (
                                // 🆕 Custom Model Input
                                <>
                                    <div style={styles.modelInputContainer}>
                                        <input
                                            type="text"
                                            style={{
                                                ...styles.input,
                                                paddingRight: '40px',
                                                borderColor: customGroqModel && !groqValidation.valid 
                                                    ? COLORS.danger 
                                                    : customGroqModel && groqValidation.valid 
                                                        ? COLORS.success 
                                                        : 'rgba(99, 102, 241, 0.3)'
                                            }}
                                            placeholder="e.g., llama-3.3-70b-specdec, deepseek-r1-distill-llama-70b"
                                            value={customGroqModel}
                                            onChange={(e) => setCustomGroqModel(e.target.value)}
                                        />
                                        {customGroqModel && (
                                            <span style={{
                                                ...styles.modelValidation,
                                                color: groqValidation.valid ? COLORS.success : COLORS.danger
                                            }}>
                                                {groqValidation.valid ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        ...styles.helpText,
                                        color: customGroqModel && !groqValidation.valid 
                                            ? COLORS.dangerLight 
                                            : '#64748b'
                                    }}>
                                        {customGroqModel ? groqValidation.message : 
                                            'Enter any Groq model ID. Check console.groq.com/docs/models for available models.'}
                                    </p>
                                    
                                    {/* Quick Model Suggestions */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '11px', color: '#64748b', marginRight: '8px' }}>Quick picks:</span>
                                        {['llama-3.3-70b-specdec', 'deepseek-r1-distill-llama-70b', 'qwen-2.5-coder-32b'].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setCustomGroqModel(m)}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: '4px',
                                                    padding: '2px 8px',
                                                    marginRight: '6px',
                                                    marginBottom: '4px',
                                                    fontSize: '10px',
                                                    color: '#a5b4fc',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    
                    <hr style={styles.divider} />
                    
                    {/* Serper API Key - Always Visible */}
                    <label style={styles.label}>Serper API Key (YouTube + References)</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Your Serper.dev API key"
                        value={apiKeys.serper || ''}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, serper: e.target.value }))}
                    />
                    <p style={styles.helpText}>
                        🎬 Required for YouTube video discovery and 📚 authority reference citations
                    </p>
                    
                    {/* Current Configuration Display */}
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '8px'
                    }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>ACTIVE CONFIGURATION</div>
                        <div style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Monaco, monospace' }}>
                            {provider.toUpperCase()} → {effectiveModel.length > 35 ? effectiveModel.substring(0, 35) + '...' : effectiveModel}
                        </div>
                    </div>
                </div>
                
                {/* ═══════════════════════════════════════════════════════════════════
                    🕷️ SITEMAP CRAWLER CARD
                    ═══════════════════════════════════════════════════════════════════ */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>🕷️ Sitemap Crawler</h2>
                    
                    <label style={styles.label}>Sitemap URL</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="https://example.com/sitemap.xml"
                        value={sitemapUrl}
                        onChange={(e) => setSitemapUrl(e.target.value)}
                    />
                    
                    <button
                        style={{ ...styles.button, width: '100%', opacity: isCrawling ? 0.7 : 1 }}
                        onClick={handleCrawlSitemap}
                        disabled={isCrawling}
                    >
                        {isCrawling ? '🔄 Crawling...' : '🕷️ Crawl Sitemap'}
                    </button>
                    
                    {crawledPages.length > 0 && (
                        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{crawledPages.length}</div>
                                <div style={styles.statLabel}>Pages Found</div>
                            </div>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{internalLinks.length}</div>
                                <div style={styles.statLabel}>Link Targets</div>
                            </div>
                        </div>
                    )}
                    
                    <p style={{ ...styles.helpText, marginTop: '12px' }}>
                        Crawl your sitemap to enable intelligent internal linking in generated content.
                    </p>
                </div>
                
                {/* ═══════════════════════════════════════════════════════════════════
                    📤 WORDPRESS PUBLISHING CARD
                    ═══════════════════════════════════════════════════════════════════ */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📤 WordPress Publishing</h2>
                    
                    <label style={styles.label}>Site URL</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="https://yoursite.com"
                        value={wpConfig.siteUrl}
                        onChange={(e) => setWpConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
                    />
                    
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="admin"
                        value={wpConfig.username}
                        onChange={(e) => setWpConfig(prev => ({ ...prev, username: e.target.value }))}
                    />
                    
                    <label style={styles.label}>Application Password</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                        value={wpConfig.applicationPassword}
                        onChange={(e) => setWpConfig(prev => ({ ...prev, applicationPassword: e.target.value }))}
                    />
                    
                    <button
                        style={{ ...styles.buttonSecondary, width: '100%' }}
                        onClick={handleConnectWordPress}
                    >
                        {wpConnected ? `✅ Connected: ${wpSiteName}` : '🔌 Connect'}
                    </button>
                    
                    <p style={{ ...styles.helpText, marginTop: '12px' }}>
                        Generate an Application Password in WordPress: Users → Profile → Application Passwords
                    </p>
                </div>
                
                {/* ═══════════════════════════════════════════════════════════════════
                    ✨ CONTENT GENERATION CARD
                    ═══════════════════════════════════════════════════════════════════ */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <h2 style={styles.cardTitle}>✨ Content Generation</h2>
                    
                    <label style={styles.label}>Topic / Keyword</label>
                    <textarea
                        style={styles.textarea}
                        placeholder="Enter your topic, keyword, or content brief...&#10;&#10;Example: 'best productivity apps for remote workers 2026'&#10;Example: 'how to start a successful podcast from scratch'&#10;Example: 'beginner's guide to investing in index funds'"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <button
                            style={{ ...styles.button, flex: 1, minWidth: '200px', opacity: isGenerating ? 0.7 : 1 }}
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? '🔄 Generating...' : '🚀 Generate Content'}
                        </button>
                        
                        {result && (
                            <>
                                <button style={styles.buttonSecondary} onClick={handleCopyHtml}>
                                    📋 Copy HTML
                                </button>
                                {wpConnected && (
                                    <>
                                        <button
                                            style={styles.buttonSecondary}
                                            onClick={() => handlePublish('draft')}
                                        >
                                            📝 Save Draft
                                        </button>
                                        <button
                                            style={styles.button}
                                            onClick={() => handlePublish('publish')}
                                        >
                                            🚀 Publish
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* Progress */}
                    {progress && (
                        <div>
                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progressFill, width: `${progress.progress}%` }} />
                            </div>
                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                                {progress.message} ({progress.progress}%)
                            </p>
                        </div>
                    )}
                    
                    {/* Stats */}
                    {result && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{result.contract.wordCount.toLocaleString()}</div>
                                <div style={styles.statLabel}>Words</div>
                            </div>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{result.youtubeVideo ? '1' : '0'}</div>
                                <div style={styles.statLabel}>Video</div>
                            </div>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{result.references?.length || 0}</div>
                                <div style={styles.statLabel}>References</div>
                            </div>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{(result.totalTime / 1000).toFixed(1)}s</div>
                                <div style={styles.statLabel}>Time</div>
                            </div>
                            <div style={styles.stat}>
                                <div style={styles.statValue}>{result.generationMethod}</div>
                                <div style={styles.statLabel}>Method</div>
                            </div>
                        </div>
                    )}
                    
                    {/* Logs */}
                    <div ref={logContainerRef} style={styles.logContainer}>
                        {logs.map((logLine, i) => (
                            <div 
                                key={i} 
                                style={{ 
                                    color: logLine.includes('❌') ? COLORS.dangerLight : 
                                           logLine.includes('✅') || logLine.includes('🎉') ? COLORS.successLight : 
                                           logLine.includes('⚠️') ? COLORS.warningLight :
                                           logLine.includes('🚀') || logLine.includes('🔍') ? COLORS.primaryLight :
                                           '#94a3b8' 
                                }}
                            >
                                {logLine}
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div style={{ color: '#64748b' }}>Logs will appear here...</div>
                        )}
                    </div>
                </div>
                
                {/* ═══════════════════════════════════════════════════════════════════
                    👁️ CONTENT PREVIEW CARD
                    ═══════════════════════════════════════════════════════════════════ */}
                {result && (
                    <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                        <h2 style={styles.cardTitle}>
                            👁️ Content Preview
                            <span style={{ marginLeft: 'auto', ...styles.badge }}>
                                {result.contract.wordCount.toLocaleString()} words
                            </span>
                        </h2>
                        <div
                            style={styles.preview}
                            dangerouslySetInnerHTML={{ __html: result.contract.htmlContent }}
                        />
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <footer style={{ 
                textAlign: 'center', 
                marginTop: '40px', 
                padding: '20px',
                color: '#64748b',
                fontSize: '13px'
            }}>
                <p>WP Optimizer Pro v{AI_ORCHESTRATOR_VERSION} — Enterprise SOTA Edition</p>
                <p style={{ marginTop: '8px', fontSize: '11px' }}>
                    Multi-Provider AI • Custom Model Support • YouTube Discovery • Authority References
                </p>
            </footer>
        </div>
    );
}
