/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.18rem',    // 0.125rem * 0.9 = 0.1125rem ≈ 0.18rem
      1: '0.225rem',     // 0.25rem * 0.9
      1.5: '0.338rem',   // 0.375rem * 0.9
      2: '0.45rem',      // 0.5rem * 0.9
      2.5: '0.563rem',   // 0.625rem * 0.9
      3: '0.675rem',     // 0.75rem * 0.9
      3.5: '0.788rem',   // 0.875rem * 0.9
      4: '0.9rem',       // 1rem * 0.9
      5: '1.125rem',     // 1.25rem * 0.9
      6: '1.35rem',      // 1.5rem * 0.9
      7: '1.575rem',     // 1.75rem * 0.9
      8: '1.8rem',       // 2rem * 0.9
      9: '2.025rem',     // 2.25rem * 0.9
      10: '2.25rem',     // 2.5rem * 0.9
      11: '2.475rem',    // 2.75rem * 0.9
      12: '2.7rem',      // 3rem * 0.9
      14: '3.15rem',     // 3.5rem * 0.9
      16: '3.6rem',      // 4rem * 0.9
      20: '4.5rem',      // 5rem * 0.9
      24: '5.4rem',      // 6rem * 0.9
      28: '6.3rem',      // 7rem * 0.9
      32: '7.2rem',      // 8rem * 0.9
      36: '8.1rem',      // 9rem * 0.9
      40: '9rem',        // 10rem * 0.9
      44: '9.9rem',      // 11rem * 0.9
      48: '10.8rem',     // 12rem * 0.9
      52: '11.7rem',     // 13rem * 0.9
      56: '12.6rem',     // 14rem * 0.9
      60: '13.5rem',     // 15rem * 0.9
      64: '14.4rem',     // 16rem * 0.9
      72: '16.2rem',     // 18rem * 0.9
      80: '18rem',       // 20rem * 0.9
      96: '21.6rem',     // 24rem * 0.9
    },
    fontSize: {
      xs: ['0.675rem', { lineHeight: '0.9rem' }],      // 0.75rem * 0.9
      sm: ['0.788rem', { lineHeight: '1.125rem' }],    // 0.875rem * 0.9
      base: ['0.9rem', { lineHeight: '1.35rem' }],     // 1rem * 0.9
      lg: ['1.013rem', { lineHeight: '1.575rem' }],    // 1.125rem * 0.9
      xl: ['1.125rem', { lineHeight: '1.575rem' }],    // 1.25rem * 0.9
      '2xl': ['1.35rem', { lineHeight: '1.8rem' }],    // 1.5rem * 0.9
      '3xl': ['1.688rem', { lineHeight: '2.025rem' }], // 1.875rem * 0.9
      '4xl': ['2.025rem', { lineHeight: '2.25rem' }],  // 2.25rem * 0.9
      '5xl': ['2.7rem', { lineHeight: '1' }],          // 3rem * 0.9
      '6xl': ['3.375rem', { lineHeight: '1' }],        // 3.75rem * 0.9
      '7xl': ['4.05rem', { lineHeight: '1' }],         // 4.5rem * 0.9
      '8xl': ['5.4rem', { lineHeight: '1' }],          // 6rem * 0.9
      '9xl': ['7.2rem', { lineHeight: '1' }],          // 8rem * 0.9
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
