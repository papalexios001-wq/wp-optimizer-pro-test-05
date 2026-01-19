/**
 * WP OPTIMIZER PRO v50.0 - ENTERPRISE MEMORY SYSTEM
 * 
 * SOTA Memory Architecture:
 * - Vector Memory with Semantic Search
 * - Episodic Memory with Context Windows
 * - Working Memory for Active Tasks
 * - Long-term Memory Consolidation
 * - Memory Compression & Summarization
 * - Retrieval Augmented Generation (RAG)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MemoryEntry {
  id: string;
  content: string;
  embedding?: number[];
  timestamp: Date;
  type: 'episodic' | 'semantic' | 'procedural';
  importance: number;
  accessCount: number;
  lastAccessed: Date;
  metadata: Record<string, unknown>;
  associations: string[];
}

export interface VectorSearchResult {
  entry: MemoryEntry;
  similarity: number;
  relevanceScore: number;
}

export interface MemoryConfig {
  maxShortTermSize: number;
  maxLongTermSize: number;
  consolidationThreshold: number;
  decayRate: number;
  embeddingDimension: number;
  similarityThreshold: number;
}

export interface ConsolidationResult {
  consolidated: number;
  pruned: number;
  compressed: number;
}

// ============================================================================
// VECTOR OPERATIONS
// ============================================================================

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function generateEmbedding(text: string): Promise<number[]> {
  // Simple hash-based embedding for demo (replace with real embedding API)
  const dimension = 384;
  const embedding = new Array(dimension).fill(0);
  for (let i = 0; i < text.length; i++) {
    const idx = i % dimension;
    embedding[idx] += text.charCodeAt(i) / 1000;
  }
  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map(v => v / (norm || 1));
}

// ============================================================================
// MEMORY SYSTEM CLASS
// ============================================================================

export class MemorySystem {
  private shortTermMemory: Map<string, MemoryEntry> = new Map();
  private longTermMemory: Map<string, MemoryEntry> = new Map();
  private workingMemory: MemoryEntry[] = [];
  private config: MemoryConfig;
  private consolidationTimer: NodeJS.Timeout | null = null;

  constructor(config?: Partial<MemoryConfig>) {
    this.config = {
      maxShortTermSize: 100,
      maxLongTermSize: 10000,
      consolidationThreshold: 0.7,
      decayRate: 0.01,
      embeddingDimension: 384,
      similarityThreshold: 0.75,
      ...config
    };
    this.startConsolidationCycle();
  }

  // Store new memory
  async store(content: string, type: MemoryEntry['type'] = 'episodic', metadata: Record<string, unknown> = {}): Promise<MemoryEntry> {
    const embedding = await generateEmbedding(content);
    const entry: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      embedding,
      timestamp: new Date(),
      type,
      importance: this.calculateInitialImportance(content),
      accessCount: 0,
      lastAccessed: new Date(),
      metadata,
      associations: []
    };

    // Find and link associations
    const similar = await this.search(content, 3);
    entry.associations = similar.map(r => r.entry.id);

    this.shortTermMemory.set(entry.id, entry);
    this.enforceMemoryLimits();

    return entry;
  }

  // Search memories by semantic similarity
  async search(query: string, limit: number = 5): Promise<VectorSearchResult[]> {
    const queryEmbedding = await generateEmbedding(query);
    const results: VectorSearchResult[] = [];

    // Search both memory stores
    const allMemories = [...this.shortTermMemory.values(), ...this.longTermMemory.values()];

    for (const entry of allMemories) {
      if (!entry.embedding) continue;
      const similarity = cosineSimilarity(queryEmbedding, entry.embedding);
      if (similarity >= this.config.similarityThreshold) {
        const relevanceScore = this.calculateRelevance(entry, similarity);
        results.push({ entry, similarity, relevanceScore });
      }
    }

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  // Retrieve specific memory and update access stats
  retrieve(id: string): MemoryEntry | null {
    let entry = this.shortTermMemory.get(id) || this.longTermMemory.get(id);
    if (entry) {
      entry.accessCount++;
      entry.lastAccessed = new Date();
      entry.importance = Math.min(1, entry.importance + 0.05);
    }
    return entry || null;
  }

  // Add to working memory for current task context
  addToWorkingMemory(entry: MemoryEntry): void {
    this.workingMemory.unshift(entry);
    if (this.workingMemory.length > 10) {
      this.workingMemory.pop();
    }
  }

  // Get current working memory context
  getWorkingContext(): string {
    return this.workingMemory
      .map(e => `[${e.type}] ${e.content}`)
      .join('\n');
  }

  // Consolidate memories (move important short-term to long-term)
  async consolidate(): Promise<ConsolidationResult> {
    let consolidated = 0;
    let pruned = 0;
    let compressed = 0;

    const now = new Date();

    for (const [id, entry] of this.shortTermMemory) {
      // Apply time decay
      const age = (now.getTime() - entry.timestamp.getTime()) / (1000 * 60 * 60);
      entry.importance *= Math.exp(-this.config.decayRate * age);

      // Consolidate important memories
      if (entry.importance >= this.config.consolidationThreshold) {
        this.longTermMemory.set(id, entry);
        this.shortTermMemory.delete(id);
        consolidated++;
      } else if (entry.importance < 0.1 && entry.accessCount < 2) {
        this.shortTermMemory.delete(id);
        pruned++;
      }
    }

    // Compress long-term memories if too large
    if (this.longTermMemory.size > this.config.maxLongTermSize * 0.9) {
      compressed = await this.compressLongTermMemory();
    }

    return { consolidated, pruned, compressed };
  }

  // Compress old long-term memories by summarization
  private async compressLongTermMemory(): Promise<number> {
    const entries = [...this.longTermMemory.values()]
      .sort((a, b) => a.importance - b.importance)
      .slice(0, Math.floor(this.longTermMemory.size * 0.1));

    let compressed = 0;
    // Group similar memories and merge
    const groups: MemoryEntry[][] = [];
    const processed = new Set<string>();

    for (const entry of entries) {
      if (processed.has(entry.id)) continue;
      const similar = entries.filter(e => 
        !processed.has(e.id) && 
        e.embedding && 
        entry.embedding && 
        cosineSimilarity(e.embedding, entry.embedding) > 0.9
      );
      if (similar.length > 1) {
        groups.push(similar);
        similar.forEach(e => processed.add(e.id));
      }
    }

    // Merge each group into single entry
    for (const group of groups) {
      const merged = this.mergeMemories(group);
      group.forEach(e => this.longTermMemory.delete(e.id));
      this.longTermMemory.set(merged.id, merged);
      compressed += group.length - 1;
    }

    return compressed;
  }

  // Merge multiple memories into one
  private mergeMemories(memories: MemoryEntry[]): MemoryEntry {
    const contents = memories.map(m => m.content);
    const mergedContent = `[Merged ${memories.length} memories] ${contents.join(' | ').slice(0, 500)}`;

    return {
      id: `mem_merged_${Date.now()}`,
      content: mergedContent,
      embedding: memories[0].embedding,
      timestamp: new Date(),
      type: memories[0].type,
      importance: Math.max(...memories.map(m => m.importance)),
      accessCount: memories.reduce((sum, m) => sum + m.accessCount, 0),
      lastAccessed: new Date(),
      metadata: { merged: true, sourceCount: memories.length },
      associations: [...new Set(memories.flatMap(m => m.associations))]
    };
  }

  // Calculate initial importance based on content
  private calculateInitialImportance(content: string): number {
    let importance = 0.5;
    // Boost for action items
    if (/\b(important|critical|urgent|must|required)\b/i.test(content)) importance += 0.2;
    // Boost for structured content
    if (/\b(step|phase|stage|\d+\.)\b/i.test(content)) importance += 0.1;
    // Boost for code/technical content
    if (/\b(function|class|interface|const|let|var)\b/.test(content)) importance += 0.15;
    return Math.min(1, importance);
  }

  // Calculate relevance score combining similarity and other factors
  private calculateRelevance(entry: MemoryEntry, similarity: number): number {
    const recencyBoost = Math.exp(-(Date.now() - entry.lastAccessed.getTime()) / (1000 * 60 * 60 * 24));
    const frequencyBoost = Math.min(1, entry.accessCount / 10);
    return similarity * 0.6 + entry.importance * 0.2 + recencyBoost * 0.1 + frequencyBoost * 0.1;
  }

  // Enforce memory size limits
  private enforceMemoryLimits(): void {
    if (this.shortTermMemory.size > this.config.maxShortTermSize) {
      const entries = [...this.shortTermMemory.entries()]
        .sort((a, b) => a[1].importance - b[1].importance);
      const toRemove = entries.slice(0, entries.length - this.config.maxShortTermSize);
      toRemove.forEach(([id]) => this.shortTermMemory.delete(id));
    }
  }

  // Start automatic consolidation cycle
  private startConsolidationCycle(): void {
    this.consolidationTimer = setInterval(() => {
      this.consolidate().catch(console.error);
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Get memory statistics
  getStats(): Record<string, number> {
    return {
      shortTermCount: this.shortTermMemory.size,
      longTermCount: this.longTermMemory.size,
      workingMemoryCount: this.workingMemory.length,
      totalMemories: this.shortTermMemory.size + this.longTermMemory.size
    };
  }

  // Export memories for persistence
  export(): { shortTerm: MemoryEntry[]; longTerm: MemoryEntry[] } {
    return {
      shortTerm: [...this.shortTermMemory.values()],
      longTerm: [...this.longTermMemory.values()]
    };
  }

  // Import memories from persistence
  import(data: { shortTerm: MemoryEntry[]; longTerm: MemoryEntry[] }): void {
    data.shortTerm.forEach(e => this.shortTermMemory.set(e.id, e));
    data.longTerm.forEach(e => this.longTermMemory.set(e.id, e));
  }

  // Cleanup
  destroy(): void {
    if (this.consolidationTimer) {
      clearInterval(this.consolidationTimer);
    }
    this.shortTermMemory.clear();
    this.longTermMemory.clear();
    this.workingMemory = [];
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createMemorySystem(config?: Partial<MemoryConfig>): MemorySystem {
  return new MemorySystem(config);
}

// Default export
export default MemorySystem;
