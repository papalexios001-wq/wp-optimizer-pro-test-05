// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v39.0 — NEURONWRITER NLP TERM PARSER
// ═══════════════════════════════════════════════════════════════════════════════

import { NeuronTerm } from './types';

export const NEURONWRITER_VERSION = "39.0.0";

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 PARSE NEURONWRITER CSV/TEXT
// ═══════════════════════════════════════════════════════════════════════════════

export function parseNeuronWriterTerms(input: string): NeuronTerm[] {
    if (!input || typeof input !== 'string') return [];

    const terms: NeuronTerm[] = [];
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        // Skip headers
        if (line.toLowerCase().includes('term') && line.toLowerCase().includes('type')) {
            continue;
        }

        // Try CSV format: term,type,recommended,importance
        const csvParts = line.split(',').map(p => p.trim());
        if (csvParts.length >= 2) {
            const term = csvParts[0].replace(/["']/g, '');
            const type = parseTermType(csvParts[1]);
            const recommended = parseInt(csvParts[2]) || 1;
            const importance = parseInt(csvParts[3]) || 50;

            if (term.length >= 2) {
                terms.push({ term, type, recommended, importance });
                continue;
            }
        }

        // Try tab-separated format
        const tabParts = line.split('\t').map(p => p.trim());
        if (tabParts.length >= 2) {
            const term = tabParts[0].replace(/["']/g, '');
            const type = parseTermType(tabParts[1]);
            const recommended = parseInt(tabParts[2]) || 1;
            const importance = parseInt(tabParts[3]) || 50;

            if (term.length >= 2) {
                terms.push({ term, type, recommended, importance });
                continue;
            }
        }

        // Try simple format: just the term
        if (line.length >= 2 && !line.includes(':')) {
            terms.push({
                term: line,
                type: 'basic',
                recommended: 1,
                importance: 50,
            });
        }
    }

    // Remove duplicates
    const seen = new Set<string>();
    return terms.filter(t => {
        const key = t.term.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function parseTermType(typeStr: string): NeuronTerm['type'] {
    const lower = typeStr.toLowerCase();
    if (lower.includes('title')) return 'title';
    if (lower.includes('header') || lower.includes('h2') || lower.includes('h3')) return 'header';
    if (lower.includes('extended') || lower.includes('secondary')) return 'extended';
    return 'basic';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CALCULATE NLP COVERAGE
// ═══════════════════════════════════════════════════════════════════════════════

export interface NLPCoverageResult {
    score: number;
    weightedScore: number;
    totalTerms: number;
    usedTerms: number;
    missingTerms: NeuronTerm[];
    usedDetails: Array<NeuronTerm & { count: number }>;
}

export function calculateNLPCoverage(
    content: string,
    terms: NeuronTerm[]
): NLPCoverageResult {
    if (!content || terms.length === 0) {
        return {
            score: 100,
            weightedScore: 100,
            totalTerms: 0,
            usedTerms: 0,
            missingTerms: [],
            usedDetails: [],
        };
    }

    const contentLower = content.toLowerCase();
    const usedDetails: Array<NeuronTerm & { count: number }> = [];
    const missingTerms: NeuronTerm[] = [];

    let totalWeight = 0;
    let usedWeight = 0;

    for (const term of terms) {
        const termLower = term.term.toLowerCase();
        const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        const matches = contentLower.match(regex);
        const count = matches?.length || 0;

        const weight = term.importance || 50;
        totalWeight += weight;

        if (count > 0) {
            usedDetails.push({ ...term, count });
            usedWeight += weight;
        } else {
            missingTerms.push(term);
        }
    }

    const score = terms.length > 0
        ? Math.round((usedDetails.length / terms.length) * 100)
        : 100;

    const weightedScore = totalWeight > 0
        ? Math.round((usedWeight / totalWeight) * 100)
        : 100;

    return {
        score,
        weightedScore,
        totalTerms: terms.length,
        usedTerms: usedDetails.length,
        missingTerms,
        usedDetails,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    NEURONWRITER_VERSION,
    parseNeuronWriterTerms,
    calculateNLPCoverage,
};
