/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Design system colors — mapped to CSS custom properties
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        on-primary: 'var(--color-on-primary)',

        secondary: 'var(--color-secondary)',
        on-secondary: 'var(--color-on-secondary)',

        accent: 'var(--color-accent)',
        on-accent: 'var(--color-on-accent)',

        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        destructive: 'var(--color-destructive)',
        'on-destructive': 'var(--color-on-destructive)',
        ring: 'var(--color-ring)',

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',

        // Risk tier colors
        'risk-low': 'var(--color-risk-low)',
        'risk-moderate': 'var(--color-risk-moderate)',
        'risk-high': 'var(--color-risk-high)',
        'risk-critical': 'var(--color-risk-critical)',

        // Legacy/navy/slate mappings (kept for backward compatibility with existing class names)
        navy: {
          50: '#f5f7fb',
          100: '#e9edf6',
          200: '#d3dcec',
          300: '#adbedb',
          400: '#7f98c2',
          500: '#526fa0',
          600: '#365282',
          700: '#27416a',
          800: '#1c3052',
          900: '#142440',
          950: '#0d1a30',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}