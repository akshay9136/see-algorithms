import { useMediaQuery, useTheme } from "@mui/material";

export default function useBreakpoints() {
  const theme = useTheme();
  const lgdown = useMediaQuery(theme.breakpoints.down('lg'));
  const lgup = useMediaQuery(theme.breakpoints.up('lg'));
  const xlup = useMediaQuery(theme.breakpoints.up('xl'));

  return { lgdown, lgup, xlup };
}
