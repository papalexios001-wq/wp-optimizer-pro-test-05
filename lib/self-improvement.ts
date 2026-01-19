/**
 * Self-Improvement System - SOTA Autonomous Learning Engine
 * Enables continuous improvement through feedback loops and performance analysis
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  timestamp: Date;
}

export interface ImprovementSuggestion {
  area: string;
  currentScore: number;
  targetScore: number;
  actions: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number;
}

export interface LearningInsight {
  pattern: string;
  frequency: number;
  successRate: number;
  recommendation: string;
}

export class SelfImprovementEngine {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private feedbackHistory: FeedbackEntry[] = [];
  private learningRate: number = 0.1;

  // Record a performance metric
  public recordMetric(name: string, value: number, target: number): void {
    const existing = this.metrics.get(name) || [];
    const trend = this.calculateTrend(existing, value);
    existing.push({ name, value, target, trend, timestamp: new Date() });
    this.metrics.set(name, existing.slice(-100)); // Keep last 100 entries
  }

  // Calculate trend based on historical data
  private calculateTrend(history: PerformanceMetric[], current: number): 'improving' | 'stable' | 'declining' {
    if (history.length < 3) return 'stable';
    const recent = history.slice(-5).map(m => m.value);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (current > avg * 1.05) return 'improving';
    if (current < avg * 0.95) return 'declining';
    return 'stable';
  }

  // Add user feedback for learning
  public addFeedback(contentId: string, rating: number, comments?: string): void {
    this.feedbackHistory.push({
      contentId,
      rating,
      comments,
      timestamp: new Date(),
    });
  }

  // Analyze performance and generate improvement suggestions
  public analyze(): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    this.metrics.forEach((history, name) => {
      const recent = history.slice(-10);
      if (recent.length === 0) return;

      const avgValue = recent.reduce((a, b) => a + b.value, 0) / recent.length;
      const target = recent[recent.length - 1].target;
      const gap = target - avgValue;

      if (gap > 0) {
        suggestions.push({
          area: name,
          currentScore: Math.round(avgValue * 100) / 100,
          targetScore: target,
          actions: this.generateActions(name, gap),
          priority: gap > target * 0.3 ? 'high' : gap > target * 0.1 ? 'medium' : 'low',
          estimatedImpact: Math.min(gap / target * 100, 100),
        });
      }
    });

    return suggestions.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
  }

  // Generate specific improvement actions
  private generateActions(metric: string, gap: number): string[] {
    const actions: Record<string, string[]> = {
      'seo_score': [
        'Optimize keyword placement in titles and headings',
        'Improve meta description quality',
        'Add more internal links',
        'Optimize image alt tags',
      ],
      'readability': [
        'Use shorter sentences',
        'Replace complex words with simpler alternatives',
        'Add more paragraph breaks',
        'Use bullet points for lists',
      ],
      'engagement': [
        'Add more compelling CTAs',
        'Include relevant images and media',
        'Improve content structure with subheadings',
        'Add interactive elements',
      ],
      'content_quality': [
        'Increase content depth and detail',
        'Add supporting data and statistics',
        'Include expert quotes or citations',
        'Update with latest information',
      ],
    };

    return actions[metric] || ['Review and optimize this metric'];
  }

  // Extract learning insights from feedback
  public extractInsights(): LearningInsight[] {
    const patterns = new Map<string, { success: number; total: number }>();

    this.feedbackHistory.forEach(feedback => {
      const key = feedback.rating >= 4 ? 'high_rated' : feedback.rating >= 2 ? 'medium_rated' : 'low_rated';
      const current = patterns.get(key) || { success: 0, total: 0 };
      current.total++;
      if (feedback.rating >= 4) current.success++;
      patterns.set(key, current);
    });

    return Array.from(patterns.entries()).map(([pattern, stats]) => {
      const calculatedSuccessRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
      return {
        pattern,
        frequency: stats.total,
        successRate: calculatedSuccessRate,
        recommendation: this.getRecommendation(pattern, calculatedSuccessRate),
      };
    });
  }

  private getRecommendation(pattern: string, successRate: number): string {
    if (successRate >= 80) return 'Continue current approach';
    if (successRate >= 50) return 'Minor adjustments recommended';
    return 'Significant improvements needed';
  }

  // Get current performance summary
  public getSummary(): { overallScore: number; trends: Record<string, string>; topPriorities: string[] } {
    let totalScore = 0;
    let count = 0;
    const trends: Record<string, string> = {};

    this.metrics.forEach((history, name) => {
      if (history.length > 0) {
        const latest = history[history.length - 1];
        totalScore += (latest.value / latest.target) * 100;
        trends[name] = latest.trend;
        count++;
      }
    });

    const suggestions = this.analyze();

    return {
      overallScore: count > 0 ? Math.round(totalScore / count) : 0,
      trends,
      topPriorities: suggestions.slice(0, 3).map(s => s.area),
    };
  }
}

interface FeedbackEntry {
  contentId: string;
  rating: number;
  comments?: string;
  timestamp: Date;
}

export default SelfImprovementEngine;
