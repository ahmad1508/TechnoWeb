/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Link } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Context from "./Context";
import { ReactComponent as LogoIcon } from "./icons/logo-cropped.svg";

const useStyles = (theme) => ({
  header: {
    padding: theme.spacing(1),
    backgroundColor: "#222",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  menu: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
});

export default function Header({ drawerToggleListener }) {
  const styles = useStyles(useTheme());
  const { oauth, setOauth, drawerVisible, setDrawerVisible } =
    useContext(Context);
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <header css={styles.header}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={drawerToggle}
        css={styles.menu}
      >
        <MenuIcon />
      </IconButton>
      <LogoIcon
        css={{
          with: "2rem",
          height: "1rem",
          margin: "0.5rem",
        }}
      />
      {oauth && (
        <LogoutIcon
          onClick={onClickLogout}
          css={{ marginLeft: "0.5rem", cursor: "pointer" }}
        />
      )}
    </header>
  );
}
