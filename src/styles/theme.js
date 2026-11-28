import { createTheme } from '@mui/material/styles';
import localFont from 'next/font/local';

export const nunito = localFont({
  src: [
    { path: '../fonts/nunito-variable.woff2', weight: '500' },
    { path: '../fonts/nunito-variable.woff2', weight: '600' },
    { path: '../fonts/nunito-variable.woff2', weight: '700' },
  ],
  style: 'normal',
  display: 'swap',
});

export function getTheme(darkMode) {
  return createTheme({
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, xxl: 1920 },
    },
    palette: { mode: darkMode ? 'dark' : 'light' },
    typography: { fontFamily: nunito.style.fontFamily },
    components: {
      MuiTypography: {
        styleOverrides: {
          h4: {
            fontSize: '2rem',
          },
          h5: {
            fontSize: '1.4rem',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            lineHeight: 1.5,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          sizeSmall: {
            fontSize: '0.875rem',
            fontWeight: 700,
            lineHeight: 1.4,
            borderRadius: 6,
          },
        },
      },
    },
  });
}
