// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v22.2 — APPLE-STYLE SOTA UI COMPONENTS
// Ultra-Premium • Minimal • Sophisticated • Performance-Optimized
// ═══════════════════════════════════════════════════════════════════════════════

import React, { 
    useEffect, 
    useRef, 
    useMemo, 
    useState, 
    useCallback,
    memo,
    ReactNode
} from 'react';
import { 
    SitemapPage, 
    QAValidationResult, 
    EntityGapAnalysis, 
    NeuronTerm, 
    GodModePhase, 
    SeoMetrics,
    ValidatedReference,
    APP_VERSION 
} from './types';
import { useAppStore } from './store';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

export const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
};

export const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
};

export const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
};

export const getScoreGradient = (score: number): string => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🍎 TOAST NOTIFICATION SYSTEM — APPLE-STYLE
// ═══════════════════════════════════════════════════════════════════════════════

export const ToastContainer: React.FC = memo(() => {
    const toasts = useAppStore(state => state.toasts);
    const removeToast = useAppStore(state => state.removeToast);

    useEffect(() => {
        const timers = toasts.map(toast => 
            setTimeout(() => removeToast(toast.id), toast.duration || 4000)
        );
        return () => timers.forEach(clearTimeout);
    }, [toasts, removeToast]);

    if (toasts.length === 0) return null;

    return (
        <div 
            className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast, index) => (
                <div 
                    key={toast.id}
                    className={cn(
                        'pointer-events-auto flex items-center gap-4 px-5 py-4',
                        'rounded-2xl backdrop-blur-2xl border cursor-pointer',
                        'shadow-2xl transition-all duration-300',
                        'hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                        'animate-[slideInRight_0.4s_ease-out]',
                        toast.type === 'error' && 'bg-red-500/10 border-red-500/20',
                        toast.type === 'success' && 'bg-green-500/10 border-green-500/20',
                        toast.type === 'warning' && 'bg-yellow-500/10 border-yellow-500/20',
                        toast.type === 'info' && 'bg-blue-500/10 border-blue-500/20'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => removeToast(toast.id)}
                >
                    <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                        toast.type === 'error' && 'bg-red-500/20 text-red-400',
                        toast.type === 'success' && 'bg-green-500/20 text-green-400',
                        toast.type === 'warning' && 'bg-yellow-500/20 text-yellow-400',
                        toast.type === 'info' && 'bg-blue-500/20 text-blue-400'
                    )}>
                        {toast.type === 'error' ? '✕' : 
                         toast.type === 'success' ? '✓' : 
                         toast.type === 'warning' ? '!' : 'i'}
                    </div>
                    <span className="text-[14px] font-medium text-white/90 flex-1 leading-snug">
                        {toast.message}
                    </span>
                </div>
            ))}
        </div>
    );
});

ToastContainer.displayName = 'ToastContainer';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 TITAN HEALTH RING — APPLE-STYLE CIRCULAR PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════

interface TitanHealthRingProps {
    score: number;
    size?: number;
    showLabel?: boolean;
    label?: string;
    animated?: boolean;
}

export const TitanHealthRing: React.FC<TitanHealthRingProps> = memo(({ 
    score, 
    size = 180,
    showLabel = true,
    label = 'AI Score',
    animated = true
}) => {
    const radius = (size / 2) - 16;
    const circumference = 2 * Math.PI * radius;
    const clampedScore = Math.min(100, Math.max(0, score));
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
    
    const getColor = () => {
        if (score >= 80) return { stroke: '#30d158', glow: 'rgba(48, 209, 88, 0.35)' };
        if (score >= 60) return { stroke: '#0a84ff', glow: 'rgba(10, 132, 255, 0.35)' };
        if (score >= 40) return { stroke: '#ffd60a', glow: 'rgba(255, 214, 10, 0.35)' };
        return { stroke: '#ff453a', glow: 'rgba(255, 69, 58, 0.35)' };
    };
    
    const colors = getColor();

    const getScoreLabel = () => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Great';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Fair';
        if (score >= 40) return 'Needs Work';
        if (score > 0) return 'Poor';
        return 'Not Scored';
    };

    return (
        <div 
            className="relative flex items-center justify-center group"
            style={{ width: size, height: size }}
        >
            {/* Glow effect */}
            <div 
                className="absolute inset-6 rounded-full blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: colors.glow }}
            />
            
            <svg 
                className="transform -rotate-90" 
                width={size} 
                height={size}
            >
                {/* Background track */}
                <circle 
                    cx={size / 2} 
                    cy={size / 2} 
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="12"
                />
                
                {/* Progress arc */}
                <circle 
                    cx={size / 2} 
                    cy={size / 2} 
                    r={radius}
                    fill="transparent"
                    stroke={colors.stroke}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(animated && 'transition-all duration-1000 ease-out')}
                    style={{ filter: `drop-shadow(0 0 12px ${colors.stroke}50)` }}
                />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                    className="font-bold tabular-nums tracking-tight"
                    style={{ 
                        fontSize: size * 0.22,
                        color: score > 0 ? 'white' : 'rgba(255,255,255,0.2)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    {score}
                </span>
                {showLabel && (
                    <>
                        <span 
                            className="text-white/40 font-semibold uppercase tracking-widest"
                            style={{ fontSize: size * 0.055 }}
                        >
                            {label}
                        </span>
                        <span 
                            className="font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                                fontSize: size * 0.05,
                                color: colors.stroke 
                            }}
                        >
                            {getScoreLabel()}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
});

TitanHealthRing.displayName = 'TitanHealthRing';

// ═══════════════════════════════════════════════════════════════════════════════
// 📜 NEURAL LOG — APPLE-STYLE ACTIVITY MONITOR
// ═══════════════════════════════════════════════════════════════════════════════

interface NeuralLogProps {
    maxHeight?: string;
    showControls?: boolean;
}

export const NeuralLog: React.FC<NeuralLogProps> = memo(({ 
    maxHeight = '400px',
    showControls = true 
}) => {
    const logs = useAppStore(state => state.godModeLog);
    const clearLog = useAppStore(state => state.clearGodLog);
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [filter, setFilter] = useState<'all' | 'errors' | 'success'>('all');

    useEffect(() => {
        if (containerRef.current && autoScroll) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        setAutoScroll(isAtBottom);
    }, []);

    const getLogStyle = useCallback((log: string): string => {
        if (log.includes('❌') || log.includes('FATAL') || log.includes('FAILED') || log.includes('ERROR')) 
            return 'text-red-400 bg-red-500/[0.06]';
        if (log.includes('⚠️') || log.includes('WARN')) 
            return 'text-yellow-400 bg-yellow-500/[0.06]';
        if (log.includes('✅') || log.includes('COMPLETE') || log.includes('SUCCESS') || log.includes('PASSED')) 
            return 'text-green-400 bg-green-500/[0.06]';
        if (log.includes('🚀') || log.includes('═══')) 
            return 'text-purple-400 font-semibold bg-purple-500/[0.06]';
        if (log.includes('🔍') || log.includes('PHASE')) 
            return 'text-blue-400 bg-blue-500/[0.06]';
        if (log.includes('🎉')) 
            return 'text-pink-400 font-semibold bg-pink-500/[0.06]';
        if (log.includes('→') || log.includes('...')) 
            return 'text-white/30';
        return 'text-white/50';
    }, []);

    const filteredLogs = useMemo(() => {
        if (filter === 'errors') {
            return logs.filter(log => 
                log.includes('❌') || log.includes('FATAL') || log.includes('FAILED') || 
                log.includes('ERROR') || log.includes('⚠️')
            );
        }
        if (filter === 'success') {
            return logs.filter(log => 
                log.includes('✅') || log.includes('COMPLETE') || log.includes('SUCCESS') || 
                log.includes('PASSED') || log.includes('🎉')
            );
        }
        return logs;
    }, [logs, filter]);

    const exportLogs = useCallback(() => {
        const content = logs.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wp-optimizer-log-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }, [logs]);

    return (
        <div className="glass-panel overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/10">
                            <span className="text-lg">📊</span>
                        </div>
                        {logs.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(48,209,88,0.6)]" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-[14px] font-semibold text-white">Activity Log</h4>
                        <p className="text-[11px] text-white/30 tabular-nums">
                            {filteredLogs.length.toLocaleString()} entries
                        </p>
                    </div>
                </div>
                
                {showControls && (
                    <div className="flex items-center gap-2">
                        {/* Filter */}
                        <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
                            {(['all', 'errors', 'success'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all',
                                        filter === f 
                                            ? 'bg-white text-black' 
                                            : 'text-white/40 hover:text-white'
                                    )}
                                >
                                    {f === 'all' ? '📋' : f === 'errors' ? '❌' : '✅'}
                                </button>
                            ))}
                        </div>
                        
                        {logs.length > 0 && (
                            <div className="flex gap-1">
                                <button 
                                    onClick={exportLogs}
                                    className="p-2 hover:bg-white/[0.04] rounded-xl transition-colors text-white/40 hover:text-blue-400"
                                    title="Export logs"
                                >
                                    📥
                                </button>
                                <button 
                                    onClick={clearLog}
                                    className="p-2 hover:bg-white/[0.04] rounded-xl transition-colors text-white/40 hover:text-red-400"
                                    title="Clear logs"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Log Container */}
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="overflow-y-auto custom-scrollbar px-4 py-3 font-mono text-[11px]"
                style={{ maxHeight }}
            >
                {filteredLogs.length > 0 ? (
                    <div className="space-y-1">
                        {filteredLogs.map((log, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    'px-3 py-2 rounded-xl leading-relaxed select-text transition-all hover:scale-[1.005]',
                                    getLogStyle(log)
                                )}
                            >
                                {log}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-white/20">
                        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin mb-4" />
                        <span className="text-[11px] uppercase tracking-widest font-medium">Awaiting activity...</span>
                    </div>
                )}
            </div>
            
            {/* Auto-scroll indicator */}
            {!autoScroll && logs.length > 10 && (
                <button 
                    onClick={() => {
                        setAutoScroll(true);
                        if (containerRef.current) {
                            containerRef.current.scrollTop = containerRef.current.scrollHeight;
                        }
                    }}
                    className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full shadow-lg hover:bg-blue-500 transition-colors"
                >
                    ↓ Latest
                </button>
            )}
        </div>
    );
});

NeuralLog.displayName = 'NeuralLog';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 STATS DASHBOARD — APPLE-STYLE METRICS
// ═══════════════════════════════════════════════════════════════════════════════

export const StatsDashboard: React.FC = memo(() => {
    const pages = useAppStore(state => state.pages);
    const config = useAppStore(state => state.autonomousConfig);
    const globalStats = useAppStore(state => state.globalStats);
    
    const stats = useMemo(() => {
        const total = pages.length;
        const targetScore = config?.targetScore || 85;
        const pagesWithScore = pages.filter(p => p.healthScore !== null);
        const atTarget = pagesWithScore.filter(p => (p.healthScore || 0) >= targetScore).length;
        const processing = pages.filter(p => p.jobState?.status === 'running').length;
        const avgScore = pagesWithScore.length > 0 
            ? Math.round(pagesWithScore.reduce((sum, p) => sum + (p.healthScore || 0), 0) / pagesWithScore.length) 
            : 0;
        const completed = pages.filter(p => p.jobState?.status === 'completed').length;
        const totalWords = pages.reduce((sum, p) => sum + (p.wordCount || 0), 0);
        
        return { total, atTarget, processing, avgScore, completed, totalWords };
    }, [pages, config?.targetScore]);

    const statItems = [
        { label: 'Total Pages', value: stats.total, icon: '📄', color: '#8e8e93' },
        { label: 'At Target', value: stats.atTarget, icon: '✓', color: '#30d158' },
        { label: 'Processing', value: stats.processing, icon: '⚡', color: '#ffd60a', pulse: stats.processing > 0 },
        { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '📈', 
          color: stats.avgScore >= 80 ? '#30d158' : stats.avgScore >= 60 ? '#0a84ff' : '#ff453a' },
        { label: 'Completed', value: stats.completed, icon: '🎯', color: '#bf5af2' },
        { label: 'Total Words', value: formatNumber(stats.totalWords), icon: '📝', color: '#0a84ff' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statItems.map(({ label, value, icon, color, pulse }, index) => (
                <div 
                    key={label} 
                    className="animate-[fadeInUp_0.5s_ease-out_forwards] opacity-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className={cn(
                        'glass-panel p-5 text-center transition-all duration-300',
                        'hover:scale-[1.03] hover:shadow-xl',
                        pulse && 'animate-pulse'
                    )}>
                        {/* Icon */}
                        <div 
                            className="w-11 h-11 mx-auto mb-3 rounded-2xl flex items-center justify-center text-lg"
                            style={{ 
                                background: `${color}15`,
                                boxShadow: `0 0 24px ${color}20`
                            }}
                        >
                            {icon}
                        </div>
                        
                        {/* Value */}
                        <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
                            {value}
                        </div>
                        
                        {/* Label */}
                        <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium mt-1">
                            {label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

StatsDashboard.displayName = 'StatsDashboard';

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 PAGE QUEUE LIST — APPLE-STYLE
// ═══════════════════════════════════════════════════════════════════════════════

interface PageQueueListProps {
    onSelect: (id: string) => void;
    limit?: number;
    showFilters?: boolean;
    compact?: boolean;
}

export const PageQueueList: React.FC<PageQueueListProps> = memo(({ 
    onSelect, 
    limit = 50, 
    showFilters = true,
    compact = false 
}) => {
    const pages = useAppStore(state => state.pages);
    const targetScore = useAppStore(state => state.autonomousConfig?.targetScore || 85);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
    const [sortBy, setSortBy] = useState<'score' | 'opportunity' | 'name'>('score');
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredPages = useMemo(() => {
        let filtered = [...pages];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(term) || 
                p.slug.toLowerCase().includes(term)
            );
        }
        
        switch (filter) {
            case 'pending':
                filtered = filtered.filter(p => 
                    !p.jobState?.status || p.jobState.status === 'idle' || 
                    (p.healthScore !== null && p.healthScore < targetScore)
                );
                break;
            case 'completed':
                filtered = filtered.filter(p => p.jobState?.status === 'completed');
                break;
            case 'failed':
                filtered = filtered.filter(p => p.jobState?.status === 'failed');
                break;
        }
        
        filtered.sort((a, b) => {
            if (a.jobState?.status === 'running') return -1;
            if (b.jobState?.status === 'running') return 1;
            
            switch (sortBy) {
                case 'opportunity':
                    return (b.opportunity?.total || 50) - (a.opportunity?.total || 50);
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    if (a.healthScore === null) return -1;
                    if (b.healthScore === null) return 1;
                    return (a.healthScore || 0) - (b.healthScore || 0);
            }
        });
        
        return filtered.slice(0, limit);
    }, [pages, filter, sortBy, limit, targetScore, searchTerm]);

    const getStatusConfig = useCallback((page: SitemapPage) => {
        if (page.jobState?.status === 'running') {
            return { border: 'border-yellow-500/40', icon: '⚡', pulse: true };
        }
        if (page.jobState?.status === 'completed') {
            return { border: 'border-green-500/30', icon: '✅', pulse: false };
        }
        if (page.jobState?.status === 'failed') {
            return { border: 'border-red-500/30', icon: '❌', pulse: false };
        }
        return { border: 'border-white/[0.06]', icon: '📄', pulse: false };
    }, []);

    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 pl-10 text-[14px] font-medium focus:border-blue-500 outline-none transition-all placeholder:text-white/20"
                        />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
                        {(['all', 'pending', 'completed', 'failed'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all',
                                    filter === f ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* List */}
            <div className={cn(
                'space-y-2 overflow-y-auto custom-scrollbar pr-1',
                compact ? 'max-h-[300px]' : 'max-h-[500px]'
            )}>
                {filteredPages.map(page => {
                    const status = getStatusConfig(page);
                    
                    return (
                        <div 
                            key={page.id}
                            onClick={() => onSelect(page.id)}
                            className={cn(
                                'p-4 rounded-2xl border cursor-pointer transition-all duration-300',
                                'hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]',
                                'bg-white/[0.02]',
                                status.border,
                                status.pulse && 'animate-pulse'
                            )}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{status.icon}</span>
                                        <span className="font-semibold text-[14px] text-white truncate">
                                            {page.title}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-white/30 font-mono truncate">
                                        {page.slug}
                                    </div>
                                    {page.jobState?.phase && 
                                     page.jobState.phase !== 'idle' && 
                                     page.jobState.phase !== 'completed' && (
                                        <div className="text-[10px] text-blue-400 mt-2 uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                            {page.jobState.phase.replace(/_/g, ' ')}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className={cn(
                                        'text-2xl font-bold tabular-nums',
                                        page.healthScore !== null
                                            ? getScoreColor(page.healthScore)
                                            : 'text-white/20'
                                    )}>
                                        {page.healthScore ?? '--'}%
                                    </div>
                                    {page.wordCount && (
                                        <div className="text-[10px] text-white/30 mt-1">
                                            {formatNumber(page.wordCount)} words
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {filteredPages.length === 0 && (
                    <div className="text-center py-16 text-white/30">
                        <div className="text-5xl mb-4 opacity-30">📭</div>
                        <div className="text-[14px] font-semibold">No pages found</div>
                        <div className="text-[12px] mt-1 opacity-60">
                            {searchTerm ? 'Try a different search' : 'Crawl a sitemap to get started'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

PageQueueList.displayName = 'PageQueueList';

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ QA SWARM PANEL — VALIDATION RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

interface QASwarmPanelProps {
    results: QAValidationResult[];
    showTitle?: boolean;
}

export const QASwarmPanel: React.FC<QASwarmPanelProps> = memo(({ 
    results,
    showTitle = true 
}) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>('critical');
    const [showOnlyIssues, setShowOnlyIssues] = useState(false);
    
    const { totalScore, groupedResults } = useMemo(() => {
        if (results.length === 0) {
            return { totalScore: 0, groupedResults: {} as Record<string, QAValidationResult[]> };
        }
        
        const grouped: Record<string, QAValidationResult[]> = {};
        results.forEach(r => {
            const cat = r.category || 'enhancement';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(r);
        });
        
        const total = Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length);
        return { totalScore: total, groupedResults: grouped };
    }, [results]);

    const getCategoryConfig = (category: string) => {
        switch (category) {
            case 'critical': return { icon: '🚨', label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10' };
            case 'seo': return { icon: '🔍', label: 'SEO', color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'aeo': return { icon: '🤖', label: 'AEO', color: 'text-purple-400', bg: 'bg-purple-500/10' };
            case 'geo': return { icon: '🌍', label: 'GEO', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
            default: return { icon: '✨', label: 'Enhancement', color: 'text-green-400', bg: 'bg-green-500/10' };
        }
    };

    const displayResults = useMemo(() => {
        if (!showOnlyIssues) return groupedResults;
        const filtered: Record<string, QAValidationResult[]> = {};
        Object.entries(groupedResults).forEach(([cat, items]) => {
            const issues = items.filter(r => r.status !== 'passed');
            if (issues.length > 0) filtered[cat] = issues;
        });
        return filtered;
    }, [groupedResults, showOnlyIssues]);

    const categoryOrder = ['critical', 'seo', 'aeo', 'geo', 'enhancement'];

    return (
        <div className="glass-panel p-8 space-y-6 min-h-[500px]">
            {showTitle && (
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-2xl">
                            🔍
                        </div>
                        <div>
                            <h4 className="text-[14px] font-semibold text-white">QA Validation</h4>
                            <p className="text-[11px] text-white/40">{results.length} checks performed</p>
                        </div>
                    </div>
                    
                    {results.length > 0 && (
                        <div className={cn('text-4xl font-bold tabular-nums', getScoreColor(totalScore))}>
                            {totalScore}%
                        </div>
                    )}
                </div>
            )}
            
            {/* Filter toggle */}
            {results.length > 0 && (
                <button
                    onClick={() => setShowOnlyIssues(!showOnlyIssues)}
                    className={cn(
                        'text-[11px] font-semibold uppercase px-4 py-2 rounded-xl transition-all',
                        showOnlyIssues 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white'
                    )}
                >
                    {showOnlyIssues ? '⚠️ Issues Only' : '📋 Show All'}
                </button>
            )}
            
            {/* Results */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {categoryOrder
                    .filter(cat => displayResults[cat])
                    .map((category) => {
                        const items = displayResults[category];
                        if (!items) return null;
                        
                        const config = getCategoryConfig(category);
                        const isExpanded = expandedCategory === category;
                        const failedCount = items.filter(r => r.status === 'failed').length;
                        
                        return (
                            <div key={category} className="border border-white/[0.06] rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                                    className="w-full p-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{config.icon}</span>
                                        <span className={cn('text-[12px] font-semibold uppercase tracking-wider', config.color)}>
                                            {config.label}
                                        </span>
                                        <span className="text-[10px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
                                            {items.length}
                                        </span>
                                        {failedCount > 0 && (
                                            <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">
                                                {failedCount} failed
                                            </span>
                                        )}
                                    </div>
                                    <span className={cn('transition-transform text-white/30', isExpanded && 'rotate-180')}>
                                        ▼
                                    </span>
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-4 space-y-3 bg-black/20 border-t border-white/[0.04]">
                                        {items.map((r, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    'p-4 rounded-xl border transition-all',
                                                    r.status === 'passed' && 'bg-green-500/5 border-green-500/20',
                                                    r.status === 'failed' && 'bg-red-500/5 border-red-500/20',
                                                    r.status === 'warning' && 'bg-yellow-500/5 border-yellow-500/20'
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[12px] font-semibold text-white">
                                                        {r.agent}
                                                    </span>
                                                    <span className={cn('text-[14px] font-bold tabular-nums', getScoreColor(r.score))}>
                                                        {r.score}%
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-white/60 leading-relaxed">{r.feedback}</p>
                                                {r.fixSuggestion && r.status !== 'passed' && (
                                                    <p className="text-[11px] text-blue-400 mt-3 pt-3 border-t border-white/[0.04] flex items-start gap-2">
                                                        <span>💡</span>
                                                        <span>{r.fixSuggestion}</span>
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                
                {results.length === 0 && (
                    <div className="text-center py-16 text-white/30">
                        <div className="text-5xl mb-4 opacity-30">🔍</div>
                        <div className="text-[14px] font-semibold">No validation data</div>
                        <div className="text-[12px] mt-1 opacity-60">Run optimization to generate results</div>
                    </div>
                )}
            </div>
        </div>
    );
});

QASwarmPanel.displayName = 'QASwarmPanel';

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 ENTITY GAP PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface EntityGapPanelProps {
    entityData?: EntityGapAnalysis;
    showTitle?: boolean;
}

export const EntityGapPanel: React.FC<EntityGapPanelProps> = memo(({ 
    entityData,
    showTitle = true 
}) => {
    const [activeTab, setActiveTab] = useState<'entities' | 'paa' | 'refs'>('entities');
    
    if (!entityData) {
        return (
            <div className="glass-panel p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center text-white/30">
                    <div className="text-5xl mb-4 opacity-30">🧠</div>
                    <div className="text-[14px] font-semibold">No entity data</div>
                    <div className="text-[12px] mt-1 opacity-60">Configure Serper API for SERP analysis</div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'entities' as const, label: 'Entities', icon: '🎯', count: entityData.missingEntities?.length || 0 },
        { id: 'paa' as const, label: 'PAA', icon: '❓', count: entityData.paaQuestions?.length || 0 },
        { id: 'refs' as const, label: 'References', icon: '📚', count: entityData.validatedReferences?.length || 0 },
    ];

    return (
        <div className="glass-panel p-8 space-y-6 min-h-[500px]">
            {showTitle && (
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-2xl">
                            🧠
                        </div>
                        <div>
                            <h4 className="text-[14px] font-semibold text-white">Entity Gap Analysis</h4>
                            <p className="text-[11px] text-white/40">{entityData.competitors?.length || 0} competitors analyzed</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white tabular-nums">
                            {entityData.recommendedWordCount || 4500}+
                        </div>
                        <div className="text-[10px] text-white/40 uppercase">Target Words</div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 px-4 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all',
                            activeTab === tab.id 
                                ? 'bg-white text-black' 
                                : 'text-white/40 hover:text-white'
                        )}
                    >
                        {tab.icon} {tab.label}
                        {tab.count > 0 && (
                            <span className={cn(
                                'ml-1.5 px-1.5 py-0.5 rounded text-[9px]',
                                activeTab === tab.id ? 'bg-black/20' : 'bg-white/10'
                            )}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {activeTab === 'entities' && (
                    <div className="space-y-4">
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                            <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>⚠️</span>
                                Missing Entities ({entityData.missingEntities?.length || 0})
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(entityData.missingEntities || []).slice(0, 25).map((e, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-[11px] font-medium border border-red-500/20">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'paa' && (
                    <div className="space-y-3">
                        {(entityData.paaQuestions || []).map((q, i) => (
                            <div key={i} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                                <span className="text-blue-400 mr-2">❓</span>
                                <span className="text-white/90 text-[13px]">{q}</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'refs' && (
                    <div className="space-y-3">
                        {(entityData.validatedReferences || []).map((ref, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">{ref.isAuthority ? '🏛️' : '📄'}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-medium text-white line-clamp-2">{ref.title}</div>
                                        <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
                                            <span>{ref.source}</span>
                                            <span>•</span>
                                            <span>{ref.year}</span>
                                            {ref.isAuthority && (
                                                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[9px] font-semibold">
                                                    Authority
                                                </span>
                                            )}
                                        </div>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer"
                                           className="text-[10px] text-blue-400 hover:underline truncate block mt-2">
                                            {ref.url}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

EntityGapPanel.displayName = 'EntityGapPanel';

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 DEEP METRICS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface DeepMetricsPanelProps {
    page: SitemapPage;
    showTitle?: boolean;
}

export const DeepMetricsPanel: React.FC<DeepMetricsPanelProps> = memo(({ 
    page,
    showTitle = true 
}) => {
    const [expanded, setExpanded] = useState(true);
    
    if (!page.seoMetrics) {
        return (
            <div className="glass-panel p-6 text-center text-white/30">
                <div className="text-4xl mb-4 opacity-30">📊</div>
                <div className="text-[13px] font-semibold">No metrics</div>
            </div>
        );
    }
    
    const m = page.seoMetrics;
    
    const metrics = [
        { label: 'Word Count', value: m.wordCount, isNum: true, icon: '📏' },
        { label: 'Content Depth', value: m.contentDepth, icon: '📚' },
        { label: 'Readability', value: m.readability, icon: '👓' },
        { label: 'Heading Structure', value: m.headingStructure, icon: '🏗️' },
        { label: 'AEO Score', value: m.aeoScore, icon: '🎯' },
        { label: 'GEO Score', value: m.geoScore, icon: '🌍' },
        { label: 'E-E-A-T', value: m.eeatSignals, icon: '🏆' },
        { label: 'Internal Links', value: m.internalLinkScore, icon: '🔗' },
    ];

    return (
        <div className="glass-panel p-6 space-y-4">
            {showTitle && (
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between border-b border-white/[0.06] pb-4"
                >
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                        <span>📊</span>
                        SEO Metrics
                    </span>
                    <span className={cn('transition-transform text-white/30', expanded && 'rotate-180')}>▼</span>
                </button>
            )}
            
            {expanded && (
                <div className="space-y-3">
                    {metrics.map(({ label, value, isNum, icon }) => (
                        <div key={label} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-semibold uppercase text-white/40">
                                <span className="flex items-center gap-1.5">
                                    <span>{icon}</span>
                                    {label}
                                </span>
                                <span className={isNum ? 'text-white' : getScoreColor(value)}>
                                    {isNum ? formatNumber(value) : `${value}%`}
                                </span>
                            </div>
                            {!isNum && (
                                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                    <div 
                                        className={cn('h-full transition-all duration-700 rounded-full', getScoreBgColor(value))} 
                                        style={{ width: `${value}%` }} 
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Schema */}
                    <div className="pt-4 border-t border-white/[0.04]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-white/40 uppercase">Schema</span>
                            <span className={m.schemaDetected ? 'text-green-400' : 'text-red-400'}>
                                {m.schemaDetected ? '✓ Detected' : '✗ Missing'}
                            </span>
                        </div>
                        {m.schemaTypes && m.schemaTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {m.schemaTypes.map((t, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px] font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

DeepMetricsPanel.displayName = 'DeepMetricsPanel';

// ═══════════════════════════════════════════════════════════════════════════════
// 🧬 NEURON NLP PANEL
// ═══════════════════════════════════════════════════════════════════════════════

interface NeuronNLPPanelProps {
    content: string;
    title?: string;
    showTitle?: boolean;
    compact?: boolean;
}

export const NeuronNLPPanel: React.FC<NeuronNLPPanelProps> = memo(({ 
    content,
    title = '',
    showTitle = true,
    compact = false
}) => {
    const terms = useAppStore(state => state.neuronTerms);
    const [showAll, setShowAll] = useState(false);
    
    const coverage = useMemo(() => {
        if (!content || terms.length === 0) {
            return { score: 0, usedTerms: [], missingTerms: [], termDetails: [] };
        }
        
        const contentLower = content.toLowerCase();
        const usedTerms: any[] = [];
        const missingTerms: any[] = [];
        const termDetails: any[] = [];
        
        terms.forEach(term => {
            const termLower = term.term.toLowerCase();
            const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            const matches = contentLower.match(regex) || [];
            const count = matches.length;
            const met = count >= term.recommended;
            
            const detail = { ...term, count, met };
            termDetails.push(detail);
            
            if (count > 0) usedTerms.push(detail);
            else missingTerms.push(detail);
        });
        
        const score = terms.length > 0 ? Math.round((usedTerms.length / terms.length) * 100) : 0;
        
        return { score, usedTerms, missingTerms, termDetails };
    }, [content, terms]);

    const displayTerms = showAll ? coverage.termDetails : coverage.termDetails.slice(0, 50);
    
    if (terms.length === 0) {
        return (
            <div className="glass-panel p-6 text-center text-white/30">
                <div className="text-4xl mb-4 opacity-30">🧬</div>
                <div className="text-[13px] font-semibold">NeuronWriter not configured</div>
            </div>
        );
    }

    return (
        <div className={cn('glass-panel space-y-4 border-green-500/10', compact ? 'p-4' : 'p-6')}>
            {showTitle && (
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🧬</span>
                        <div>
                            <h4 className="text-[11px] font-semibold text-green-400 uppercase tracking-wider">
                                NLP Coverage
                            </h4>
                            <p className="text-[10px] text-white/30">{terms.length} terms</p>
                        </div>
                    </div>
                    <div className={cn('text-3xl font-bold tabular-nums', getScoreColor(coverage.score))}>
                        {coverage.score}%
                    </div>
                </div>
            )}
            
            {/* Progress */}
            <div className="space-y-2">
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div 
                        className={cn('h-full transition-all duration-700 rounded-full', getScoreBgColor(coverage.score))}
                        style={{ width: `${coverage.score}%` }}
                    />
                </div>
                <div className="flex justify-between text-[9px] text-white/40">
                    <span>{coverage.usedTerms.length} used</span>
                    <span>{coverage.missingTerms.length} missing</span>
                </div>
            </div>
            
            {/* Terms */}
            <div className={cn('flex flex-wrap gap-1.5 overflow-y-auto custom-scrollbar', compact ? 'max-h-32' : 'max-h-48')}>
                {displayTerms.map((t, i) => (
                    <span 
                        key={`${t.term}-${i}`}
                        className={cn(
                            'px-2 py-1 rounded-lg text-[10px] font-medium border transition-all',
                            t.count > 0 
                                ? t.met
                                    ? 'bg-green-500/15 border-green-500/40 text-green-400'
                                    : 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                                : 'bg-white/[0.02] border-white/[0.08] text-white/30'
                        )}
                        title={`${t.term}: ${t.count}/${t.recommended} (${t.type})`}
                    >
                        {t.type === 'title' && '🏷️ '}
                        {t.type === 'header' && '📑 '}
                        {t.term}
                        {t.count > 0 && (
                            <span className="ml-1 opacity-60">({t.count})</span>
                        )}
                    </span>
                ))}
            </div>
            
            {coverage.termDetails.length > 50 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-center text-[10px] font-semibold uppercase text-blue-400 hover:text-blue-300 py-2 border-t border-white/[0.04]"
                >
                    {showAll ? '↑ Show Less' : `↓ Show All (${coverage.termDetails.length})`}
                </button>
            )}
        </div>
    );
});

NeuronNLPPanel.displayName = 'NeuronNLPPanel';

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 FORM COMPONENTS — APPLE-STYLE
// ═══════════════════════════════════════════════════════════════════════════════

interface AdvancedInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    helpText?: string;
    error?: string;
    disabled?: boolean;
    icon?: string;
    required?: boolean;
}

export const AdvancedInput: React.FC<AdvancedInputProps> = memo(({ 
    label, value, onChange, type = 'text', placeholder, helpText, error, disabled, icon, required 
}) => (
    <div className="space-y-2.5">
        <label className="flex items-center gap-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider">
            {icon && <span className="text-sm">{icon}</span>}
            {label}
            {required && <span className="text-red-400">*</span>}
        </label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
                'w-full px-5 py-4 rounded-2xl text-[15px] font-medium',
                'bg-white/[0.03] border transition-all duration-200',
                'placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-4',
                error 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                    : 'border-white/[0.08] hover:border-white/[0.12] focus:border-blue-500 focus:ring-blue-500/10',
                type === 'password' && value && 'tracking-[0.25em]'
            )}
        />
        {helpText && !error && (
            <p className="text-[11px] text-white/30 pl-1 flex items-center gap-1.5">
                <span className="text-blue-400/60">ℹ</span>
                {helpText}
            </p>
        )}
        {error && (
            <p className="text-[11px] text-red-400 pl-1 flex items-center gap-1.5">
                <span>⚠</span>
                {error}
            </p>
        )}
    </div>
));

AdvancedInput.displayName = 'AdvancedInput';

// ═══════════════════════════════════════════════════════════════════════════════

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    description?: string;
    disabled?: boolean;
    icon?: string;
}

export const Toggle: React.FC<ToggleProps> = memo(({ 
    label, checked, onChange, description, disabled, icon 
}) => (
    <div 
        className={cn(
            'flex items-center justify-between p-5 rounded-2xl',
            'bg-white/[0.02] border border-white/[0.06] transition-all duration-200',
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.04] cursor-pointer'
        )}
        onClick={() => !disabled && onChange(!checked)}
    >
        <div className="flex items-center gap-4">
            {icon && (
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-lg">
                    {icon}
                </div>
            )}
            <div>
                <span className="text-[14px] font-semibold text-white/90">{label}</span>
                {description && (
                    <p className="text-[11px] text-white/40 mt-0.5">{description}</p>
                )}
            </div>
        </div>
        <div className={cn(
            'w-[51px] h-[31px] rounded-full relative transition-all duration-300 flex-shrink-0',
            checked ? 'bg-green-500' : 'bg-white/10'
        )}>
            <div className={cn(
                'absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-lg transition-transform duration-300',
                checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
            )} />
        </div>
    </div>
));

Toggle.displayName = 'Toggle';

// ═══════════════════════════════════════════════════════════════════════════════

interface SectionHeaderProps {
    title: string;
    icon?: string;
    color?: string;
    subtitle?: string;
    actions?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = memo(({ 
    title, icon, color = '#0a84ff', subtitle, actions 
}) => (
    <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
            {icon && (
                <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{ 
                        background: `${color}15`,
                        boxShadow: `0 0 24px ${color}20`
                    }}
                >
                    {icon}
                </div>
            )}
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                {subtitle && (
                    <p className="text-[13px] text-white/40 mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
        {actions}
    </div>
));

SectionHeader.displayName = 'SectionHeader';

// ═══════════════════════════════════════════════════════════════════════════════

interface ProgressIndicatorProps {
    phase: GodModePhase;
    progress?: number;
    processingTime?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = memo(({ 
    phase, 
    progress, 
    processingTime 
}) => {
const phaseConfig: Record<GodModePhase, { icon: string; label: string; color: string }> = {
    idle: { icon: '⏸️', label: 'Idle', color: '#8e8e93' },
    initializing: { icon: '🚀', label: 'Starting', color: '#0a84ff' },
    crawling: { icon: '🕷️', label: 'Crawling', color: '#64d2ff' },
    resolving_post: { icon: '📍', label: 'Resolving', color: '#0a84ff' },
    analyzing_existing: { icon: '🔍', label: 'Analyzing', color: '#bf5af2' },
    collect_intel: { icon: '🎯', label: 'Intel', color: '#5e5ce6' },
    strategic_intel: { icon: '🧠', label: 'Strategy', color: '#5e5ce6' },
    entity_gap_analysis: { icon: '🧬', label: 'Entities', color: '#bf5af2' },
    reference_discovery: { icon: '📚', label: 'References', color: '#0a84ff' },
    reference_validation: { icon: '✅', label: 'Validating', color: '#30d158' },
    neuron_analysis: { icon: '🔬', label: 'NLP', color: '#30d158' },
    competitor_deep_dive: { icon: '🔎', label: 'Competitors', color: '#64d2ff' },
    outline_generation: { icon: '📋', label: 'Outline', color: '#0a84ff' },
    section_drafts: { icon: '✍️', label: 'Drafting', color: '#bf5af2' },
    link_plan: { icon: '🔗', label: 'Link Plan', color: '#64d2ff' },
    section_finalize: { icon: '📝', label: 'Finalizing', color: '#5e5ce6' },
    merge_content: { icon: '🔀', label: 'Merging', color: '#0a84ff' },
    prompt_assembly: { icon: '🧩', label: 'Prompts', color: '#ff9f0a' },
    content_synthesis: { icon: '🎨', label: 'Generating', color: '#bf5af2' },
    qa_validation: { icon: '🔍', label: 'QA Check', color: '#ffd60a' },
    auto_fix_loop: { icon: '🔄', label: 'Auto-Fix', color: '#ff9f0a' },
    self_improvement: { icon: '📈', label: 'Improving', color: '#ff9f0a' },
    internal_linking: { icon: '🔗', label: 'Linking', color: '#0a84ff' },
    schema_generation: { icon: '📊', label: 'Schema', color: '#5e5ce6' },
    final_polish: { icon: '✨', label: 'Polishing', color: '#ff375f' },
    publishing: { icon: '📤', label: 'Publishing', color: '#30d158' },
    completed: { icon: '🎉', label: 'Done', color: '#30d158' },
    failed: { icon: '❌', label: 'Failed', color: '#ff453a' },
    youtube_integration: { icon: '🎬', label: 'YouTube', color: '#ff0000' },
};


    
    const config = phaseConfig[phase] || phaseConfig.idle;
    const isActive = !['idle', 'completed', 'failed'].includes(phase);
    
    return (
        <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-xl"
            style={{ 
                background: `${config.color}10`,
                borderColor: `${config.color}30`
            }}
        >
            <span className={cn('text-lg', isActive && 'animate-pulse')}>
                {config.icon}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>
                {config.label}
            </span>
            {processingTime !== undefined && processingTime > 0 && (
                <span className="text-[10px] text-white/40 ml-auto tabular-nums">
                    {formatDuration(processingTime)}
                </span>
            )}
        </div>
    );
});

ProgressIndicator.displayName = 'ProgressIndicator';

// ═══════════════════════════════════════════════════════════════════════════════
// 📄 CONTENT PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════

interface ContentPreviewProps {
    html: string;
    maxHeight?: string;
    showWordCount?: boolean;
}

export const ContentPreview: React.FC<ContentPreviewProps> = memo(({ 
    html, 
    maxHeight = '600px',
    showWordCount = true 
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const wordCount = useMemo(() => {
        if (!html) return 0;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = doc.body?.innerText || '';
        return text.split(/\s+/).filter(Boolean).length;
    }, [html]);
    
    if (!html) {
        return (
            <div className="glass-panel p-8 flex items-center justify-center" style={{ minHeight: maxHeight }}>
                <div className="text-center text-white/30">
                    <div className="text-5xl mb-4 opacity-30">📝</div>
                    <div className="text-[14px] font-semibold">No content yet</div>
                    <div className="text-[12px] mt-1 opacity-60">Run optimization to generate</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={cn(isFullscreen && 'fixed inset-0 z-50 bg-black/95 p-8')}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                {showWordCount && (
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                            📝 {formatNumber(wordCount)} words
                        </span>
                        {wordCount >= 4500 && (
                            <span className="text-[9px] font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                                ✓ Target Met
                            </span>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(html)}
                        className="text-[10px] font-semibold uppercase text-white/40 hover:text-white px-3 py-1.5 hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                        📋 Copy
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-[10px] font-semibold uppercase text-white/40 hover:text-white px-3 py-1.5 hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                        {isFullscreen ? '↙️ Exit' : '↗️ Expand'}
                    </button>
                </div>
            </div>
            
            {/* Content */}
            <div 
                className="glass-panel p-8 overflow-auto custom-scrollbar"
                style={{ maxHeight: isFullscreen ? 'calc(100vh - 150px)' : maxHeight }}
            >
                <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
});

ContentPreview.displayName = 'ContentPreview';

// ═══════════════════════════════════════════════════════════════════════════════
// 🏷️ BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
    size?: 'sm' | 'md';
    pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = memo(({ 
    children, 
    variant = 'default',
    size = 'sm',
    pulse = false 
}) => {
    const variantClasses = {
        default: 'bg-white/10 text-white/60 border-white/10',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    
    const sizeClasses = {
        sm: 'text-[9px] px-2 py-0.5',
        md: 'text-[11px] px-3 py-1',
    };
    
    return (
        <span className={cn(
            'font-semibold uppercase tracking-wider rounded-full border',
            variantClasses[variant],
            sizeClasses[size],
            pulse && 'animate-pulse'
        )}>
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = memo(({ 
    children, 
    className,
    onClick,
    hoverable = false,
    padding = 'md'
}) => {
    const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
    
    return (
        <div 
            className={cn(
                'glass-panel',
                paddingClasses[padding],
                hoverable && 'hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface EmptyStateProps {
    icon: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = memo(({ 
    icon, 
    title, 
    description,
    action 
}) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">{icon}</div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        {description && (
            <p className="text-[13px] text-white/50 max-w-sm mb-6">{description}</p>
        )}
        {action && (
            <button
                onClick={action.onClick}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
                {action.label}
            </button>
        )}
    </div>
));

EmptyState.displayName = 'EmptyState';

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════════════════

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
    size = 'md', 
    text 
}) => {
    const sizeClasses = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
    
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={cn(
                'rounded-full border-white/10 border-t-blue-500 animate-spin',
                sizeClasses[size]
            )} />
            {text && (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    {text}
                </span>
            )}
        </div>
    );
});

LoadingSpinner.displayName = 'LoadingSpinner';
