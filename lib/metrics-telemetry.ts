/**
 * WP OPTIMIZER PRO v50.0 - ENTERPRISE METRICS & TELEMETRY
 * 
 * SOTA Observability System:
 * - Real-time Metrics Collection
 * - Distributed Tracing
 * - Performance Monitoring
 * - Error Tracking
 * - Custom Dashboards
 * - Alerting System
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MetricPoint {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
}

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'ok' | 'error';
  tags: Record<string, string>;
  logs: Array<{ timestamp: Date; message: string }>;
}

export interface Alert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  triggered: boolean;
  lastTriggered?: Date;
}

export interface TelemetryConfig {
  enabled: boolean;
  sampleRate: number;
  flushInterval: number;
  maxBufferSize: number;
  exporters: string[];
}

// ============================================================================
// METRICS COLLECTOR
// ============================================================================

export class MetricsCollector {
  private metrics: Map<string, MetricPoint[]> = new Map();
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private config: TelemetryConfig;
  private flushTimer: NodeJS.Timeout | null = null;
  private buffer: MetricPoint[] = [];

  constructor(config?: Partial<TelemetryConfig>) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      flushInterval: 10000,
      maxBufferSize: 1000,
      exporters: [],
      ...config
    };
    if (this.config.enabled) {
      this.startFlushing();
    }
  }

  // Increment counter
  increment(name: string, value: number = 1, tags: Record<string, string> = {}): void {
    if (!this.shouldSample()) return;
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
    this.record({ name, value: current + value, timestamp: new Date(), tags, type: 'counter' });
  }

  // Set gauge value
  gauge(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.shouldSample()) return;
    this.gauges.set(name, value);
    this.record({ name, value, timestamp: new Date(), tags, type: 'gauge' });
  }

  // Record histogram value
  histogram(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.shouldSample()) return;
    const values = this.histograms.get(name) || [];
    values.push(value);
    this.histograms.set(name, values);
    this.record({ name, value, timestamp: new Date(), tags, type: 'histogram' });
  }

  // Time an operation
  async time<T>(name: string, fn: () => Promise<T>, tags: Record<string, string> = {}): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.histogram(name, duration, { ...tags, status: 'success' });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.histogram(name, duration, { ...tags, status: 'error' });
      throw error;
    }
  }

  // Get histogram statistics
  getHistogramStats(name: string): { min: number; max: number; avg: number; p50: number; p95: number; p99: number } | null {
    const values = this.histograms.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  // Get all metrics
  getMetrics(): Record<string, unknown> {
    const histogramStats: Record<string, unknown> = {};
    for (const [name] of this.histograms) {
      histogramStats[name] = this.getHistogramStats(name);
    }

    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: histogramStats,
      bufferSize: this.buffer.length
    };
  }

  private record(point: MetricPoint): void {
    this.buffer.push(point);
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  private shouldSample(): boolean {
    return this.config.enabled && Math.random() < this.config.sampleRate;
  }

  private startFlushing(): void {
    this.flushTimer = setInterval(() => this.flush(), this.config.flushInterval);
  }

  private flush(): void {
    if (this.buffer.length === 0) return;
    const toExport = [...this.buffer];
    this.buffer = [];
    // Export to configured exporters (console for demo)
    console.log(`[Metrics] Flushing ${toExport.length} metrics`);
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// ============================================================================
// DISTRIBUTED TRACER
// ============================================================================

export class Tracer {
  private activeSpans: Map<string, Span> = new Map();
  private completedSpans: Span[] = [];
  private config: TelemetryConfig;

  constructor(config?: Partial<TelemetryConfig>) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      flushInterval: 10000,
      maxBufferSize: 100,
      exporters: [],
      ...config
    };
  }

  // Start a new span
  startSpan(operationName: string, parentSpanId?: string): Span {
    const span: Span = {
      traceId: parentSpanId ? this.getTraceId(parentSpanId) : this.generateId(),
      spanId: this.generateId(),
      parentSpanId,
      operationName,
      startTime: new Date(),
      status: 'ok',
      tags: {},
      logs: []
    };
    this.activeSpans.set(span.spanId, span);
    return span;
  }

  // End a span
  endSpan(spanId: string, status: 'ok' | 'error' = 'ok'): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.endTime = new Date();
      span.duration = span.endTime.getTime() - span.startTime.getTime();
      span.status = status;
      this.activeSpans.delete(spanId);
      this.completedSpans.push(span);
      if (this.completedSpans.length >= this.config.maxBufferSize) {
        this.flush();
      }
    }
  }

  // Add tag to span
  addTag(spanId: string, key: string, value: string): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }

  // Add log to span
  addLog(spanId: string, message: string): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.logs.push({ timestamp: new Date(), message });
    }
  }

  // Trace an async operation
  async trace<T>(operationName: string, fn: () => Promise<T>, parentSpanId?: string): Promise<T> {
    const span = this.startSpan(operationName, parentSpanId);
    try {
      const result = await fn();
      this.endSpan(span.spanId, 'ok');
      return result;
    } catch (error) {
      this.addLog(span.spanId, `Error: ${(error as Error).message}`);
      this.endSpan(span.spanId, 'error');
      throw error;
    }
  }

  // Get completed traces
  getTraces(): Span[] {
    return [...this.completedSpans];
  }

  private getTraceId(spanId: string): string {
    const span = this.activeSpans.get(spanId);
    return span?.traceId || this.generateId();
  }

  private generateId(): string {
    return `${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private flush(): void {
    if (this.completedSpans.length === 0) return;
    console.log(`[Tracer] Flushing ${this.completedSpans.length} spans`);
    this.completedSpans = [];
  }
}

// ============================================================================
// ALERTING SYSTEM
// ============================================================================

export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private metrics: MetricsCollector;
  private checkInterval: NodeJS.Timeout | null = null;
  private callbacks: ((alert: Alert) => void)[] = [];

  constructor(metrics: MetricsCollector) {
    this.metrics = metrics;
    this.startMonitoring();
  }

  // Register an alert
  registerAlert(alert: Omit<Alert, 'id' | 'triggered'>): string {
    const id = `alert_${Date.now()}`;
    this.alerts.set(id, { ...alert, id, triggered: false });
    return id;
  }

  // Remove an alert
  removeAlert(id: string): void {
    this.alerts.delete(id);
  }

  // Subscribe to alert triggers
  onAlert(callback: (alert: Alert) => void): void {
    this.callbacks.push(callback);
  }

  // Check all alerts
  private checkAlerts(): void {
    const currentMetrics = this.metrics.getMetrics();
    for (const [id, alert] of this.alerts) {
      const value = this.evaluateCondition(alert.condition, currentMetrics);
      const shouldTrigger = this.checkThreshold(value, alert.threshold);

      if (shouldTrigger && !alert.triggered) {
        alert.triggered = true;
        alert.lastTriggered = new Date();
        this.notifyAlert(alert);
      } else if (!shouldTrigger && alert.triggered) {
        alert.triggered = false;
      }
    }
  }

  private evaluateCondition(condition: string, metrics: Record<string, unknown>): number {
    // Simple metric lookup (can be extended to support expressions)
    const counters = metrics.counters as Record<string, number>;
    const gauges = metrics.gauges as Record<string, number>;
    return counters[condition] ?? gauges[condition] ?? 0;
  }

  private checkThreshold(value: number, threshold: number): boolean {
    return value >= threshold;
  }

  private notifyAlert(alert: Alert): void {
    console.log(`[ALERT] ${alert.severity.toUpperCase()}: ${alert.name}`);
    this.callbacks.forEach(cb => cb(alert));
  }

  private startMonitoring(): void {
    this.checkInterval = setInterval(() => this.checkAlerts(), 5000);
  }

  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export function createMetricsCollector(config?: Partial<TelemetryConfig>): MetricsCollector {
  return new MetricsCollector(config);
}

export function createTracer(config?: Partial<TelemetryConfig>): Tracer {
  return new Tracer(config);
}

export function createAlertManager(metrics: MetricsCollector): AlertManager {
  return new AlertManager(metrics);
}

// Default exports
export default { MetricsCollector, Tracer, AlertManager };
