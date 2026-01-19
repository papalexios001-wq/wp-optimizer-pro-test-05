/**
 * WP OPTIMIZER PRO v50.0 - SELF-CORRECTION ENGINE
 * 
 * Advanced self-correction and error recovery system
 * Features:
 * - Error pattern recognition
 * - Automatic retry with exponential backoff
 * - Circuit breaker pattern
 * - Learning from failures
 * - Adaptive correction strategies
 */

export interface CorrectionAttempt {
  id: string;
  taskId: string;
  error: string;
  strategy: CorrectionStrategy;
  success: boolean;
  timestamp: Date;
  learnings: string[];
}

export interface CorrectionStrategy {
  name: string;
  type: 'retry' | 'alternative' | 'decompose' | 'escalate' | 'skip';
  parameters: Record<string, unknown>;
  confidence: number;
}

export interface ErrorPattern {
  pattern: RegExp;
  category: string;
  recommendedStrategy: CorrectionStrategy;
  occurrences: number;
}

export interface CircuitBreakerState {
  status: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailure: Date | null;
  successCount: number;
}

const DEFAULT_ERROR_PATTERNS: ErrorPattern[] = [
  {
    pattern: /timeout|timed out/i,
    category: 'timeout',
    recommendedStrategy: {
      name: 'Retry with backoff',
      type: 'retry',
      parameters: { maxRetries: 3, backoffMs: 1000 },
      confidence: 0.8
    },
    occurrences: 0
  },
  {
    pattern: /rate limit|429|too many requests/i,
    category: 'rate_limit',
    recommendedStrategy: {
      name: 'Exponential backoff',
      type: 'retry',
      parameters: { maxRetries: 5, backoffMs: 2000, exponential: true },
      confidence: 0.9
    },
    occurrences: 0
  },
  {
    pattern: /not found|404|missing/i,
    category: 'not_found',
    recommendedStrategy: {
      name: 'Alternative approach',
      type: 'alternative',
      parameters: { searchAlternatives: true },
      confidence: 0.7
    },
    occurrences: 0
  },
  {
    pattern: /permission|forbidden|403|unauthorized|401/i,
    category: 'auth',
    recommendedStrategy: {
      name: 'Escalate to user',
      type: 'escalate',
      parameters: { reason: 'Authentication required' },
      confidence: 0.95
    },
    occurrences: 0
  },
  {
    pattern: /complex|too large|split/i,
    category: 'complexity',
    recommendedStrategy: {
      name: 'Decompose task',
      type: 'decompose',
      parameters: { maxSubtasks: 5 },
      confidence: 0.75
    },
    occurrences: 0
  }
];

/**
 * SelfCorrectionEngine - Intelligent error recovery system
 */
export class SelfCorrectionEngine {
  private errorPatterns: ErrorPattern[];
  private attempts: Map<string, CorrectionAttempt[]> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private learnings: Map<string, string[]> = new Map();
  
  private readonly maxAttemptsPerTask = 5;
  private readonly circuitBreakerThreshold = 5;
  private readonly circuitBreakerResetMs = 60000;

  constructor(customPatterns: ErrorPattern[] = []) {
    this.errorPatterns = [...DEFAULT_ERROR_PATTERNS, ...customPatterns];
  }

  async correct(
    taskId: string,
    error: string,
    context: Record<string, unknown>
  ): Promise<{ strategy: CorrectionStrategy; shouldRetry: boolean }> {
    // Check circuit breaker
    const breaker = this.getCircuitBreaker(taskId);
    if (breaker.status === 'open') {
      return {
        strategy: {
          name: 'Circuit breaker open',
          type: 'skip',
          parameters: { reason: 'Too many failures' },
          confidence: 1
        },
        shouldRetry: false
      };
    }

    // Check attempt count
    const taskAttempts = this.attempts.get(taskId) || [];
    if (taskAttempts.length >= this.maxAttemptsPerTask) {
      this.recordFailure(taskId);
      return {
        strategy: {
          name: 'Max attempts reached',
          type: 'escalate',
          parameters: { attempts: taskAttempts.length },
          confidence: 1
        },
        shouldRetry: false
      };
    }

    // Analyze error and get strategy
    const strategy = this.analyzeError(error, context);
    
    // Record attempt
    const attempt: CorrectionAttempt = {
      id: `attempt_${Date.now()}`,
      taskId,
      error,
      strategy,
      success: false,
      timestamp: new Date(),
      learnings: []
    };
    
    taskAttempts.push(attempt);
    this.attempts.set(taskId, taskAttempts);

    return {
      strategy,
      shouldRetry: strategy.type !== 'escalate' && strategy.type !== 'skip'
    };
  }

  private analyzeError(error: string, context: Record<string, unknown>): CorrectionStrategy {
    // Match against known patterns
    for (const pattern of this.errorPatterns) {
      if (pattern.pattern.test(error)) {
        pattern.occurrences++;
        return { ...pattern.recommendedStrategy };
      }
    }

    // Default strategy for unknown errors
    return {
      name: 'Generic retry',
      type: 'retry',
      parameters: { maxRetries: 2, backoffMs: 500 },
      confidence: 0.5
    };
  }

  recordSuccess(taskId: string): void {
    const breaker = this.getCircuitBreaker(taskId);
    
    if (breaker.status === 'half-open') {
      breaker.successCount++;
      if (breaker.successCount >= 3) {
        breaker.status = 'closed';
        breaker.failures = 0;
      }
    }
    
    // Mark last attempt as successful
    const attempts = this.attempts.get(taskId);
    if (attempts?.length) {
      attempts[attempts.length - 1].success = true;
    }
  }

  recordFailure(taskId: string): void {
    const breaker = this.getCircuitBreaker(taskId);
    breaker.failures++;
    breaker.lastFailure = new Date();
    
    if (breaker.failures >= this.circuitBreakerThreshold) {
      breaker.status = 'open';
      
      // Schedule half-open transition
      setTimeout(() => {
        if (breaker.status === 'open') {
          breaker.status = 'half-open';
          breaker.successCount = 0;
        }
      }, this.circuitBreakerResetMs);
    }
  }

  private getCircuitBreaker(taskId: string): CircuitBreakerState {
    if (!this.circuitBreakers.has(taskId)) {
      this.circuitBreakers.set(taskId, {
        status: 'closed',
        failures: 0,
        lastFailure: null,
        successCount: 0
      });
    }
    return this.circuitBreakers.get(taskId)!;
  }

  addLearning(taskId: string, learning: string): void {
    const taskLearnings = this.learnings.get(taskId) || [];
    taskLearnings.push(learning);
    this.learnings.set(taskId, taskLearnings);
  }

  getLearnings(taskId?: string): string[] {
    if (taskId) {
      return this.learnings.get(taskId) || [];
    }
    
    // Return all learnings
    return Array.from(this.learnings.values()).flat();
  }

  getErrorPatternStats(): Array<{ category: string; occurrences: number }> {
    return this.errorPatterns.map(p => ({
      category: p.category,
      occurrences: p.occurrences
    }));
  }

  getStats(): Record<string, unknown> {
    const allAttempts = Array.from(this.attempts.values()).flat();
    const successfulAttempts = allAttempts.filter(a => a.success);
    
    return {
      totalAttempts: allAttempts.length,
      successfulAttempts: successfulAttempts.length,
      successRate: allAttempts.length > 0 
        ? successfulAttempts.length / allAttempts.length 
        : 0,
      circuitBreakers: {
        open: Array.from(this.circuitBreakers.values()).filter(b => b.status === 'open').length,
        halfOpen: Array.from(this.circuitBreakers.values()).filter(b => b.status === 'half-open').length,
        closed: Array.from(this.circuitBreakers.values()).filter(b => b.status === 'closed').length
      },
      errorPatterns: this.getErrorPatternStats(),
      totalLearnings: this.getLearnings().length
    };
  }

  reset(): void {
    this.attempts.clear();
    this.circuitBreakers.clear();
    this.learnings.clear();
    this.errorPatterns.forEach(p => p.occurrences = 0);
  }
}

// Utility: Exponential backoff helper
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    exponential?: boolean;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, exponential = true, onRetry } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = exponential 
          ? baseDelayMs * Math.pow(2, attempt)
          : baseDelayMs;
        
        onRetry?.(attempt + 1, lastError);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
