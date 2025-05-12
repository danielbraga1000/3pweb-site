import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBackground: "#F9FAFB",      // Light Gray for main background
        brandBackgroundAlt: "#F3F4F6", // Slightly darker gray for alternate sections
        brandText: "#1F2937",           // Dark Gray for main text
        brandTextSecondary: "#6B7280", // Medium Gray for secondary text
        brandPrimary: "#00E5FF",        // Cyan
        brandPrimaryDark: "#00B8D4",   // Darker Cyan
        brandSecondary: "#FF007F",      // Pink
        brandAccent: "#7F00FF",         // Purple
        brandCard: "#FFFFFF",           // White for cards, with shadow
        brandBorder: "#E5E7EB",         // Light Gray for borders

        // RGB values for use in boxShadow with opacity
        "primary-rgb": "0, 229, 255",
        "secondary-rgb": "255, 0, 127",
        "accent-rgb": "127, 0, 255",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        slideInUp: "slideInUp 0.7s ease-out forwards",
        gradientShift: "gradientShift 15s ease infinite",
        pulseGlow: "pulseGlow 2s infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        pulseGlow: {
          "0%": { boxShadow: "0 0 5px rgba(var(--color-primary-rgb, 0 229 255), 0.2), 0 0 10px rgba(var(--color-primary-rgb, 0 229 255), 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(var(--color-primary-rgb, 0 229 255), 0.5), 0 0 30px rgba(var(--color-primary-rgb, 0 229 255), 0.3)" },
        },
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;

