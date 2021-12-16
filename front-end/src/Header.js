/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Avatar, Grid } from "@mui/material";
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
  avatar: {
    width: "2rem",
    height: "2rem",
    fontSize: "1rem",
    backgroundColor: "#fff",
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
        <div css={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div css={{ marginTop: "5px" }}>
            <LogoutIcon
              onClick={onClickLogout}
              css={{ marginLeft: "0.5rem", cursor: "pointer" }}
            />
          </div>
          <div>
            <Grid container css={{ display: 'flex' }}>
              <Grid >
                <Avatar css={styles.avatar}>
                  {oauth.email[0].toUpperCase()}
                </Avatar>
              </Grid>
              <Grid css={{ margin: "5px 10px 0px 10px" }}>
                {oauth.email}
              </Grid>

            </Grid>
          </div>
        </div>
      )}


    </header>
  );
}
