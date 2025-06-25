import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg-plus': '1220px', // Add a custom breakpoint for 1220px
      },
      colors: {
        ctext: {
          DEFAULT: '#2d3748', // Soft dark gray
        },
        accent: {
          DEFAULT: '#8b5a3c', // Warm brown
        },
        disable: {
          DEFAULT: '#a0aec0', // Soft gray
        },
        whitetext: {
          DEFAULT: '#ffffff',
        },
        blacktext: {
          DEFAULT: '#2d3748', // Softer black
        },
        ctitle: {
          DEFAULT: '#4a5568', // Medium gray
        },
        graybg: {
          DEFAULT: '#f7fafc', // Very light blue-gray
        },
        mdgray: {
          DEFAULT: '#718096', // Medium gray
        },
        categories:{
          DEFAULT:'#e6fffa' // Very light mint green
        },
        // New pet-friendly colors
        petBrown: {
          light: '#d4a574', // Light brown
          DEFAULT: '#8b5a3c', // Medium brown
          dark: '#5d4037', // Dark brown
        },
        petGreen: {
          light: '#9ae6b4', // Light green
          DEFAULT: '#48bb78', // Medium green
          dark: '#38a169', // Dark green
        },
        petBlue: {
          light: '#90cdf4', // Light blue
          DEFAULT: '#4299e1', // Medium blue
          dark: '#3182ce', // Dark blue
        },
        petYellow: {
          light: '#faf089', // Light yellow
          DEFAULT: '#ecc94b', // Medium yellow
          dark: '#d69e2e', // Dark yellow
        }
      },
    },
  },
  plugins: [],
};
export default config;
