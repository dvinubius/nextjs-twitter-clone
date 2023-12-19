import { type Config } from "tailwindcss";

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
export default {
  content: [
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('tailwindcss-all')],
} satisfies Config;
