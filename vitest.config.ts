/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Test file patterns
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    
    // Watch mode configuration
    watch: false,
    
    // Reporter configuration
    reporters: ['default', 'html'],
    
    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@lib': path.resolve(__dirname, './lib'),
      '@components': path.resolve(__dirname, './components'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
