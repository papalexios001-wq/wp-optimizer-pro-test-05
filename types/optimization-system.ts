// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO - OPTIMIZATION SYSTEM TYPES v42.0
// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 SOTA Enterprise-Grade Content Optimization System
// Complete type definitions for bulk optimization, analytics, and activity tracking
// ═══════════════════════════════════════════════════════════════════════════════

import { OptimizationMode } from './enterprise-config';

/**
 * Page Status for Optimization Queue
 */
export type PageStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'at-target';

/**
 * Optimization Job Status
 */
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Activity Log Entry Type
 */
export type ActivityType = 'optimization' | 'error' | 'success' | 'info' | 'warning';

/**
 * Page Data for Optimization
 * Represents a single page/URL in the optimization system
 */
export interface OptimizationPage {
  /** Unique identifier */
  id: string;
  
  /** Page URL */
  url: string;
  
  /** Page title */
  title: string;
  
  /** Target keyword for optimization */
  targetKeyword?: string;
  
  /** Current optimization status */
  status: PageStatus;
  
  /** SEO score (0-100) */
  score: number;
  
  /** Word count */
  wordCount: number;
  
  /** When the page was added to queue */
  addedAt: number;
  
  /** When optimization started */
  startedAt?: number;
  
  /** When optimization completed */
  completedAt?: number;
  
  /** Error message if failed */
  error?: string;
  
  /** Previous score before optimization */
  previousScore?: number;
  
  /** Previous word count before optimization */
  previousWordCount?: number;
  
  /** WordPress post ID if published */
  wpPostId?: number;
  
  /** Optimization mode used */
  optimizationMode?: OptimizationMode;
}

/**
 * Optimization Job
 * Represents a batch optimization job
 */
export interface OptimizationJob {
  /** Unique job identifier */
  id: string;
  
  /** Job name/description */
  name: string;
  
  /** Job status */
  status: JobStatus;
  
  /** Total pages in job */
  totalPages: number;
  
  /** Pages completed */
  completedPages: number;
  
  /** Pages failed */
  failedPages: number;
  
  /** Job start time */
  startedAt: number;
  
  /** Job completion time */
  completedAt?: number;
  
  /** Optimization mode */
  mode: OptimizationMode;
  
  /** Auto-publish flag */
  autoPublish: boolean;
  
  /** Total words generated */
  totalWordsGenerated: number;
  
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Activity Log Entry
 * Tracks all system activities
 */
export interface ActivityLogEntry {
  /** Unique entry ID */
  id: string;
  
  /** Activity type */
  type: ActivityType;
  
  /** Activity message */
  message: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Related page URL */
  pageUrl?: string;
  
  /** Related job ID */
  jobId?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Analytics Metrics
 * Comprehensive performance tracking
 */
export interface AnalyticsMetrics {
  /** Total pages processed all-time */
  totalPagesProcessed: number;
  
  /** Pages currently at target score */
  pagesAtTarget: number;
  
  /** Pages currently being processed */
  pagesProcessing: number;
  
  /** Average SEO score across all pages */
  averageScore: number;
  
  /** Total words generated */
  totalWordsGenerated: number;
  
  /** Total completed optimizations */
  totalCompletedOptimizations: number;
  
  /** Success rate percentage */
  successRate: number;
  
  /** Average processing time (ms) */
  averageProcessingTime: number;
  
  /** Last update timestamp */
  lastUpdated: number;
}

/**
 * Session Statistics
 * Stats for current session
 */
export interface SessionStatistics {
  /** Pages processed this session */
  pagesProcessed: number;
  
  /** Pages improved this session */
  pagesImproved: number;
  
  /** Words generated this session */
  wordsGenerated: number;
  
  /** Success rate for this session */
  successRate: number;
  
  /** Session start time */
  sessionStart: number;
}

/**
 * Content Strategy Dashboard Data
 * Aggregated data for the strategy dashboard
 */
export interface ContentStrategyData {
  /** All pages in the system */
  pages: OptimizationPage[];
  
  /** Analytics metrics */
  metrics: AnalyticsMetrics;
  
  /** Recent activity log */
  activityLog: ActivityLogEntry[];
  
  /** Current session stats */
  sessionStats: SessionStatistics;
  
  /** Recent jobs */
  recentJobs: OptimizationJob[];
}

/**
 * Quick Optimize Request
 * Single-page optimization request
 */
export interface QuickOptimizeRequest {
  /** Page URL to optimize */
  url: string;
  
  /** Target keyword (optional) */
  targetKeyword?: string;
  
  /** Optimization mode */
  mode: OptimizationMode;
  
  /** Auto-publish flag */
  autoPublish: boolean;
}

/**
 * Bulk Optimize Request
 * Multi-page optimization request
 */
export interface BulkOptimizeRequest {
  /** Page IDs to optimize */
  pageIds: string[];
  
  /** Optimization mode */
  mode: OptimizationMode;
  
  /** Auto-publish flag */
  autoPublish: boolean;
  
  /** Job name */
  jobName?: string;
}

/**
 * Filter Options for Page Queue
 */
export interface PageQueueFilters {
  /** Filter by status */
  status?: PageStatus | 'all';
  
  /** Search query */
  searchQuery?: string;
  
  /** Minimum score */
  minScore?: number;
  
  /** Maximum score */
  maxScore?: number;
  
  /** Sort field */
  sortBy?: 'score' | 'wordCount' | 'addedAt' | 'title';
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Default values and helpers
 */
export const DEFAULT_ANALYTICS_METRICS: AnalyticsMetrics = {
  totalPagesProcessed: 0,
  pagesAtTarget: 0,
  pagesProcessing: 0,
  averageScore: 0,
  totalWordsGenerated: 0,
  totalCompletedOptimizations: 0,
  successRate: 100,
  averageProcessingTime: 0,
  lastUpdated: Date.now()
};

export const DEFAULT_SESSION_STATS: SessionStatistics = {
  pagesProcessed: 0,
  pagesImproved: 0,
  wordsGenerated: 0,
  successRate: 100,
  sessionStart: Date.now()
};

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate score improvement
 */
export function calculateScoreImprovement(before: number, after: number): number {
  if (before === 0) return after;
  return Math.round(((after - before) / before) * 100);
}

/**
 * Check if page is at target (score >= 80)
 */
export function isPageAtTarget(score: number): boolean {
  return score >= 80;
}

/**
 * Format duration in ms to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: PageStatus): string {
  switch (status) {
    case 'at-target': return '#22c55e';
    case 'completed': return '#3b82f6';
    case 'processing': return '#f59e0b';
    case 'failed': return '#ef4444';
    case 'pending': return '#64748b';
    default: return '#64748b';
  }
}

/**
 * Get status icon
 */
export function getStatusIcon(status: PageStatus): string {
  switch (status) {
    case 'at-target': return '✓';
    case 'completed': return '🎯';
    case 'processing': return '⚡';
    case 'failed': return '❌';
    case 'pending': return '📋';
    default: return '📄';
  }
}

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  PAGES: 'wpo_optimization_pages_v42',
  METRICS: 'wpo_analytics_metrics_v42',
  ACTIVITY_LOG: 'wpo_activity_log_v42',
  SESSION_STATS: 'wpo_session_stats_v42',
  RECENT_JOBS: 'wpo_recent_jobs_v42'
} as const;
