/** @jsxImportSource @emotion/react */
import { useTheme } from "@mui/styles";
import Box from "@mui/material/Box";

const useStyles = (theme) => ({
  footer: {
    height: "30px",
    flexShrink: 0,
    display: "flex",
    padding: "0.25rem 1rem",
    alignItems: "center",
    fontSize: "0.75rem",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

export default function Footer() {
  const styles = useStyles(useTheme());
  return <Box style={styles.footer}>Do magna aliquip culpa est laboris cupidatat consequat.</Box>;
}
