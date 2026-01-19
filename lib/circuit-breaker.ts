/**
 * WP OPTIMIZER PRO v50.0 - ENTERPRISE CIRCUIT BREAKER
 * 
 * SOTA Fault Tolerance Architecture:
 * - Circuit Breaker Pattern (Closed/Open/Half-Open)
 * - Exponential Backoff with Jitter
 * - Bulkhead Isolation
 * - Rate Limiting
 * - Timeout Management
 * - Health Monitoring
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoff: number;
}

export interface CircuitStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  totalRequests: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

export interface RetryOptions {
  maxRetries?: number;
  backoffMultiplier?: number;
  maxBackoff?: number;
  shouldRetry?: (error: Error) => boolean;
}

// ============================================================================
// CIRCUIT BREAKER CLASS
// ============================================================================

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures: number = 0;
  private successes: number = 0;
  private lastFailure: Date | null = null;
  private lastSuccess: Date | null = null;
  private totalRequests: number = 0;
  private consecutiveFailures: number = 0;
  private consecutiveSuccesses: number = 0;
  private resetTimer: NodeJS.Timeout | null = null;
  private config: CircuitBreakerConfig;
  private listeners: Map<string, ((stats: CircuitStats) => void)[]> = new Map();

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: 5,
      successThreshold: 3,
      timeout: 30000,
      resetTimeout: 60000,
      maxRetries: 3,
      backoffMultiplier: 2,
      maxBackoff: 30000,
      ...config
    };
  }

  // Execute function through circuit breaker
  async execute<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
    this.totalRequests++;

    if (this.state === 'open') {
      throw new Error('Circuit is OPEN - service unavailable');
    }

    const mergedOptions = {
      maxRetries: this.config.maxRetries,
      backoffMultiplier: this.config.backoffMultiplier,
      maxBackoff: this.config.maxBackoff,
      shouldRetry: () => true,
      ...options
    };

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= mergedOptions.maxRetries) {
      try {
        const result = await this.executeWithTimeout(fn);
        this.onSuccess();
        return result;
      } catch (error) {
        lastError = error as Error;
        attempt++;

        if (attempt > mergedOptions.maxRetries || !mergedOptions.shouldRetry(lastError)) {
          this.onFailure(lastError);
          throw lastError;
        }

        // Calculate backoff with jitter
        const backoff = Math.min(
          mergedOptions.maxBackoff,
          Math.pow(mergedOptions.backoffMultiplier, attempt) * 1000
        );
        const jitter = backoff * 0.2 * Math.random();
        await this.sleep(backoff + jitter);
      }
    }

    this.onFailure(lastError!);
    throw lastError;
  }

  // Execute with timeout
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), this.config.timeout);
      })
    ]);
  }

  // Handle successful execution
  private onSuccess(): void {
    this.successes++;
    this.consecutiveSuccesses++;
    this.consecutiveFailures = 0;
    this.lastSuccess = new Date();

    if (this.state === 'half-open') {
      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        this.transitionTo('closed');
      }
    }

    this.emit('success', this.getStats());
  }

  // Handle failed execution
  private onFailure(error: Error): void {
    this.failures++;
    this.consecutiveFailures++;
    this.consecutiveSuccesses = 0;
    this.lastFailure = new Date();

    if (this.state === 'closed' || this.state === 'half-open') {
      if (this.consecutiveFailures >= this.config.failureThreshold) {
        this.transitionTo('open');
      }
    }

    this.emit('failure', this.getStats());
  }

  // Transition to new state
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }

    if (newState === 'open') {
      this.resetTimer = setTimeout(() => {
        this.transitionTo('half-open');
      }, this.config.resetTimeout);
    }

    if (newState === 'closed') {
      this.consecutiveFailures = 0;
      this.consecutiveSuccesses = 0;
    }

    this.emit('stateChange', { oldState, newState, stats: this.getStats() });
  }

  // Get current statistics
  getStats(): CircuitStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      totalRequests: this.totalRequests,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses
    };
  }

  // Check if circuit allows requests
  isAvailable(): boolean {
    return this.state !== 'open';
  }

  // Get current state
  getState(): CircuitState {
    return this.state;
  }

  // Force circuit state (for testing/admin)
  forceState(state: CircuitState): void {
    this.transitionTo(state);
  }

  // Reset all statistics
  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.successes = 0;
    this.lastFailure = null;
    this.lastSuccess = null;
    this.totalRequests = 0;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
  }

  // Event handling
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  // Utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// RATE LIMITER
// ============================================================================

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
  strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';
}

export class RateLimiter {
  private requests: number[] = [];
  private tokens: number;
  private lastRefill: number;
  private config: RateLimiterConfig;

  constructor(config?: Partial<RateLimiterConfig>) {
    this.config = {
      maxRequests: 100,
      windowMs: 60000,
      strategy: 'sliding-window',
      ...config
    };
    this.tokens = this.config.maxRequests;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<boolean> {
    const now = Date.now();

    switch (this.config.strategy) {
      case 'fixed-window':
        return this.fixedWindow(now);
      case 'sliding-window':
        return this.slidingWindow(now);
      case 'token-bucket':
        return this.tokenBucket(now);
      default:
        return this.slidingWindow(now);
    }
  }

  private fixedWindow(now: number): boolean {
    const windowStart = Math.floor(now / this.config.windowMs) * this.config.windowMs;
    this.requests = this.requests.filter(t => t >= windowStart);

    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  private slidingWindow(now: number): boolean {
    const windowStart = now - this.config.windowMs;
    this.requests = this.requests.filter(t => t > windowStart);

    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  private tokenBucket(now: number): boolean {
    const elapsed = now - this.lastRefill;
    const refillAmount = (elapsed / this.config.windowMs) * this.config.maxRequests;
    this.tokens = Math.min(this.config.maxRequests, this.tokens + refillAmount);
    this.lastRefill = now;

    if (this.tokens < 1) {
      return false;
    }

    this.tokens--;
    return true;
  }

  getRemainingRequests(): number {
    if (this.config.strategy === 'token-bucket') {
      return Math.floor(this.tokens);
    }
    return Math.max(0, this.config.maxRequests - this.requests.length);
  }
}

// ============================================================================
// BULKHEAD
// ============================================================================

export interface BulkheadConfig {
  maxConcurrent: number;
  maxQueued: number;
  queueTimeout: number;
}

export class Bulkhead {
  private running: number = 0;
  private queue: Array<{ resolve: () => void; reject: (err: Error) => void; timestamp: number }> = [];
  private config: BulkheadConfig;

  constructor(config?: Partial<BulkheadConfig>) {
    this.config = {
      maxConcurrent: 10,
      maxQueued: 100,
      queueTimeout: 30000,
      ...config
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    if (this.running < this.config.maxConcurrent) {
      this.running++;
      return Promise.resolve();
    }

    if (this.queue.length >= this.config.maxQueued) {
      return Promise.reject(new Error('Bulkhead queue full'));
    }

    return new Promise<void>((resolve, reject) => {
      const item = { resolve, reject, timestamp: Date.now() };
      this.queue.push(item);

      setTimeout(() => {
        const idx = this.queue.indexOf(item);
        if (idx !== -1) {
          this.queue.splice(idx, 1);
          reject(new Error('Bulkhead queue timeout'));
        }
      }, this.config.queueTimeout);
    });
  }

  private release(): void {
    this.running--;
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.running++;
      next.resolve();
    }
  }

  getStats(): { running: number; queued: number; available: number } {
    return {
      running: this.running,
      queued: this.queue.length,
      available: this.config.maxConcurrent - this.running
    };
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export function createCircuitBreaker(config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
  return new CircuitBreaker(config);
}

export function createRateLimiter(config?: Partial<RateLimiterConfig>): RateLimiter {
  return new RateLimiter(config);
}

export function createBulkhead(config?: Partial<BulkheadConfig>): Bulkhead {
  return new Bulkhead(config);
}

export default CircuitBreaker;
