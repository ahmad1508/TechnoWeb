/** @jsxImportSource @emotion/react */
import { useTheme } from "@mui/styles";
import Box from "@mui/material/Box";

const useStyles = (theme) => ({
  header: {
    height: "30px",
    flexShrink: 0,
    display: "flex",
    padding: "0.5rem 1rem",
    fontSize: "2rem",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
})

export default function Header() {
  const styles = useStyles(useTheme());
  return <Box style={styles.header}>Messenger</Box>;
}
