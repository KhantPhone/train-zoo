import '@/global.css';

export const Colors = {
  light: {
    text: '#3F3F3F',
    background: '#FCF9EE',
    backgroundElement: '#DFF4ED',
    backgroundSelected: '#5DCAA5',
    textSecondary: '#3F3F3F99',
  },
  dark: {
    text: '#FCF9EE',
    background: '#2a2a2a',
    backgroundElement: '#3a3a3a',
    backgroundSelected: '#5DCAA5',
    textSecondary: '#FCF9EEaa',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: 'Zen Maru Gothic',
  display: 'RocknRoll One',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;