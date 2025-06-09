/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  appColors:{
    primary: '#1A6771', // A vibrant blue, similar to the design
    secondary: '#FFFFFF', // White
    textPrimary: '#FFFFFF', // White text on primary background
    textSecondary: '#333333', // Dark text on white background
    accent: '#FFD700', // Gold/Yellow for accents like engine light
    gray: '#CCCCCC',
    lightGray: '#F5F5F5',
    white: '#FFFFFF',
    darkGray: '#555555',
    red: '#FF4136', // For high severity
    orange: '#FF851B', // For medium severity
    green: '#2ECC40', // For low severity
  }
};