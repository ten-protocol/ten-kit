/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tc-',
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    ...(process.env.NODE_ENV !== 'production' ? ['./stories/**/*.{js,ts,jsx,tsx}'] : []),
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--tc-border))',
        input: 'hsl(var(--tc-input))',
        ring: 'hsl(var(--tc-ring))',
        background: 'hsl(var(--tc-background))',
        foreground: 'hsl(var(--tc-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--tc-primary))',
          foreground: 'hsl(var(--tc-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--tc-secondary))',
          foreground: 'hsl(var(--tc-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--tc-destructive))',
          foreground: 'hsl(var(--tc-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--tc-muted))',
          foreground: 'hsl(var(--tc-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--tc-accent))',
          foreground: 'hsl(var(--tc-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--tc-popover))',
          foreground: 'hsl(var(--tc-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--tc-card))',
          foreground: 'hsl(var(--tc-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--tc-radius)',
        md: 'calc(var(--tc-radius) - 2px)',
        sm: 'calc(var(--tc-radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
