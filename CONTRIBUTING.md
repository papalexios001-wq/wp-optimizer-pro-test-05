# Contributing to WP Optimizer Pro

Thank you for your interest in contributing to WP Optimizer Pro! This document provides guidelines and standards for contributing to this enterprise-grade WordPress optimization platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow:

- **Be Respectful**: Treat all contributors with respect and professionalism
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Patient**: Remember that everyone was a beginner once

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Git >= 2.30.0
- TypeScript knowledge
- Familiarity with WordPress development

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/wp-optimizer-pro.git
cd wp-optimizer-pro

# Add upstream remote
git remote add upstream https://github.com/papalexios001-wq/wp-optimizer-pro.git
```

---

## 💻 Development Setup

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Required
NODE_ENV=development
API_KEY=your_api_key

# Optional
DEBUG=true
LOG_LEVEL=debug
```

---

## 📝 Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Use interfaces over type aliases for object shapes
- Prefer `const` over `let`, avoid `var`

```typescript
// ✅ Good
interface UserConfig {
  readonly id: string;
  name: string;
  settings: UserSettings;
}

function processConfig(config: UserConfig): ProcessedConfig {
  // Implementation
}

// ❌ Bad
function processConfig(config: any) {
  // No type safety
}
```

### Code Style

- Use 2-space indentation
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### File Organization

```
src/
├── components/     # React components
├── lib/           # Core library code
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── hooks/         # React hooks
└── services/      # API services
```

---

## 🔄 Pull Request Process

### Branch Naming

Use the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

Example: `feature/add-seo-analyzer`

### Commit Messages

Follow Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### PR Checklist

Before submitting:

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] PR description explains changes

---

## 🧪 Testing Requirements

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.spec.ts

# Run tests in watch mode
npm run test:watch
```

### Coverage Requirements

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionToTest } from './module';

describe('Module Name', () => {
  describe('functionToTest', () => {
    it('should handle normal input', () => {
      const result = functionToTest('input');
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

---

## 📚 Documentation

### Code Documentation

Use JSDoc for all public APIs:

```typescript
/**
 * Analyzes SEO metrics for the given content.
 * 
 * @param content - The HTML content to analyze
 * @param options - Configuration options
 * @returns SEO analysis results
 * @throws {ValidationError} If content is invalid
 * 
 * @example
 * ```typescript
 * const results = await analyzeSEO('<html>...</html>', {
 *   includeKeywords: true
 * });
 * ```
 */
export async function analyzeSEO(
  content: string,
  options?: AnalysisOptions
): Promise<SEOResults> {
  // Implementation
}
```

### README Updates

When adding new features, update:

- Feature list in README.md
- API documentation
- Usage examples

---

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Minimal steps to reproduce
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Node version, OS, browser
6. **Screenshots**: If applicable

---

## 💡 Feature Requests

For new features:

1. Check existing issues first
2. Describe the use case
3. Propose implementation approach
4. Consider backward compatibility

---

## 🏆 Recognition

Contributors are recognized in:

- README.md Contributors section
- Release notes
- Project documentation

---

## 📞 Getting Help

- **Documentation**: https://docs.wp-optimizer-pro.com
- **Discussions**: GitHub Discussions
- **Issues**: GitHub Issues
- **Email**: support@wp-optimizer-pro.com

---

Thank you for contributing to WP Optimizer Pro! 🎉
