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
        background: "#F0F2F5", // Light gray background
        text: "#1A202C",       // Dark gray text
        primary: "#3498DB",    // Vibrant blue for primary actions/accents
        secondary: "#2ECC71",  // Vibrant green for secondary accents
        accent: "#E74C3C",     // Vibrant red/orange for attention
        highlight: "#F1C40F",   // Vibrant yellow for highlights
        card: "#FFFFFF",       // White for cards
        border: "#D1D5DB",     // Light border color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideInUp: "slideInUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

