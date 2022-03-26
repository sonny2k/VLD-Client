import PropTypes from 'prop-types';
// @mui
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
// hooks
import { viVN } from '@mui/material/locale';


// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
  children: PropTypes.node,
};

export default function ThemeLocalization({ children }) {
  const defaultTheme = useTheme();

  const theme = createTheme(defaultTheme, viVN);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
