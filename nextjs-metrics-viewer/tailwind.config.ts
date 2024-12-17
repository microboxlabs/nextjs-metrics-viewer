import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#024959", // Primary Color
        secondary: "#026773", // Secondary Color
        tertiary: "#3CA6A6", // Tertiary Color
        quaternary: "#F2E3D5", // Fourth Color
      },
    },
  },
  plugins: [flowbite.plugin()],
};
export default config;
