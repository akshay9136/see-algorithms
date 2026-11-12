import { useMediaQuery, useTheme } from "@mui/material";

export default function useBreakpoints() {
  const theme = useTheme();
  const mdup = useMediaQuery(theme.breakpoints.up('md'));
  const lgdown = useMediaQuery(theme.breakpoints.down('lg'));
  const lgup = useMediaQuery(theme.breakpoints.up('lg'));
  const xlup = useMediaQuery(theme.breakpoints.up('xl'));
  const xldown = useMediaQuery(theme.breakpoints.down('xl'));
  const xxlup = useMediaQuery(theme.breakpoints.up('xxl'));
  const xxldown = useMediaQuery(theme.breakpoints.down('xxl'));

  return { mdup, lgdown, lgup, xlup, xldown, xxlup, xxldown };
}
