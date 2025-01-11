export default {
  content: [
    "./index.html",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "370px", // Small devices
      md: "768px", // Medium devices
      lg: "1024px", // Large devices
      xl: "1280px", // Extra large devices
      "2xl": "1536px", // 2X extra large devices
    },
    extend: {},
  },
  plugins: [],
};
