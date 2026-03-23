/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        background: "var(--color-bg)",
        foreground: "var(--color-text-primary)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--color-surface-2)",
          foreground: "var(--color-text-primary)",
        },
        muted: {
          DEFAULT: "var(--color-surface-1)",
          foreground: "var(--color-text-secondary)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
    },
  },
  plugins: [],
}
