/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lean: {
          primary: '#4B5563',
          secondary: '#6B7280',
          accent: '#3B82F6',
          success: '#10B981',
          error: '#EF4444',
          background: '#1F2937',
          surface: '#374151',
        }
      }
    },
  },
  plugins: [],
}
