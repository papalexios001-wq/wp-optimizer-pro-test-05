// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — NEURONWRITER INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

import { NeuronTerm } from './types';

export const NEURONWRITER_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NeuronWriterData {
    terms: NeuronTerm[];
    targetScore: number;
    currentScore: number;
    recommendations: string[];
}

export interface ParsedNeuronData {
    terms: NeuronTerm[];
    totalTerms: number;
    criticalTerms: number;
    headerTerms: number;
    bodyTerms: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 PARSE NEURONWRITER CSV/TEXT
// ═══════════════════════════════════════════════════════════════════════════════

export function parseNeuronWriterData(rawData: string): ParsedNeuronData {
    const terms: NeuronTerm[] = [];
    const lines = rawData.trim().split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
            continue;
        }
        
        // Try to parse as CSV: term,type,importance,recommended
        const parts = trimmed.split(/[,\t;|]+/).map(p => p.trim());
        
        if (parts.length >= 1 && parts[0].length > 0) {
            const term = parts[0];
            const typeRaw = parts[1]?.toLowerCase() || 'body';
            const importance = parseInt(parts[2]) || 50;
            const recommended = parseInt(parts[3]) || 3;
            
            // Map type to valid NeuronTerm type
            let type: NeuronTerm['type'] = 'body';
            if (typeRaw.includes('critical')) {
                type = 'critical';
            } else if (typeRaw.includes('title')) {
                type = 'title';
            } else if (typeRaw.includes('header') || typeRaw.includes('h2') || typeRaw.includes('h3')) {
                type = 'header';
            } else {
                type = 'body';
            }
            
            terms.push({
                term,
                type,
                importance,
                recommended
            });
        }
    }
    
    const criticalTerms = terms.filter(t => t.type === 'critical').length;
    const headerTerms = terms.filter(t => t.type === 'header' || t.type === 'title').length;
    const bodyTerms = terms.filter(t => t.type === 'body').length;
    
    return {
        terms,
        totalTerms: terms.length,
        criticalTerms,
        headerTerms,
        bodyTerms
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CALCULATE NLP COVERAGE
// ═══════════════════════════════════════════════════════════════════════════════

export interface NLPCoverageResult {
    score: number;
    usedTerms: Array<NeuronTerm & { count: number }>;
    missingTerms: NeuronTerm[];
    criticalMissing: NeuronTerm[];
}

export function calculateNLPCoverage(
    content: string,
    terms: NeuronTerm[]
): NLPCoverageResult {
    if (!content || terms.length === 0) {
        return {
            score: 100,
            usedTerms: [],
            missingTerms: [],
            criticalMissing: []
        };
    }
    
    const contentLower = content.toLowerCase();
    const usedTerms: Array<NeuronTerm & { count: number }> = [];
    const missingTerms: NeuronTerm[] = [];
    
    for (const term of terms) {
        const termLower = term.term.toLowerCase();
        const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        const matches = contentLower.match(regex) || [];
        const count = matches.length;
        
        if (count > 0) {
            usedTerms.push({ ...term, count });
        } else {
            missingTerms.push(term);
        }
    }
    
    const score = terms.length > 0
        ? Math.round((usedTerms.length / terms.length) * 100)
        : 100;
    
    const criticalMissing = missingTerms.filter(t => 
        t.type === 'critical' || t.importance >= 80
    );
    
    return {
        score,
        usedTerms,
        missingTerms,
        criticalMissing
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 GENERATE TERM-OPTIMIZED PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

export function generateNLPOptimizedPrompt(
    basePrompt: string,
    terms: NeuronTerm[],
    maxTermsToInclude: number = 30
): string {
    if (terms.length === 0) return basePrompt;
    
    // Sort by importance and take top terms
    const sortedTerms = [...terms]
        .sort((a, b) => b.importance - a.importance)
        .slice(0, maxTermsToInclude);
    
    const criticalTerms = sortedTerms
        .filter(t => t.type === 'critical')
        .map(t => t.term);
    
    const headerTerms = sortedTerms
        .filter(t => t.type === 'header' || t.type === 'title')
        .map(t => t.term);
    
    const bodyTerms = sortedTerms
        .filter(t => t.type === 'body')
        .map(t => t.term);
    
    let nlpSection = '\n\n## NLP OPTIMIZATION REQUIREMENTS:\n';
    
    if (criticalTerms.length > 0) {
        nlpSection += `\n### CRITICAL TERMS (must appear 3+ times each):\n${criticalTerms.join(', ')}\n`;
    }
    
    if (headerTerms.length > 0) {
        nlpSection += `\n### HEADER TERMS (include in H2/H3 headings):\n${headerTerms.join(', ')}\n`;
    }
    
    if (bodyTerms.length > 0) {
        nlpSection += `\n### BODY TERMS (include naturally throughout):\n${bodyTerms.join(', ')}\n`;
    }
    
    return basePrompt + nlpSection;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    NEURONWRITER_VERSION,
    parseNeuronWriterData,
    calculateNLPCoverage,
    generateNLPOptimizedPrompt
};
