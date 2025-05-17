/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,jsx,ts,js}",
    "./src/options.tsx",
    "./components/**/*.{tsx,jsx,ts,js}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        scrollbar: {
          track: "hsl(var(--secondary))",
          thumb: "hsl(var(--muted-foreground))",
        },
        'prompt-accent': {
          DEFAULT: 'hsl(var(--prompt-accent))',
          foreground: 'hsl(var(--prompt-foreground))',
        },
      },
      fontSize: {
        base: '1rem',      // 16px
        sm: '0.875rem',    // 14px
        lg: '1.125rem',    // 18px
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      // Add your typography plugin configuration here
    })
  ],
};
