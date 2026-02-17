import { type Config } from 'tailwindcss';
import { join } from 'path';

export default {
  darkMode: ['class'],
  content: [join(__dirname, '{src,lib}/**/*.{ts,tsx,html}')],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {},
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
