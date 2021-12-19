/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Avatar, Grid, Divider, Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { ReactComponent as LogoIcon } from "./icons/logo-cropped.svg";
import { ReactComponent as LogoIconLight } from "./icons/logo-cropped_light.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ListItemIcon from "@mui/material/ListItemIcon";
import Context from "./Context";


const useStyles = (theme) => ({
  header: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
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
    backgroundColor: theme.palette.primary.light,
    border: `1px solid ${theme.palette.primary.dark}`,
    margin: "auto",
  },
  drawer: {
    width: "150px",
    margin: "10px 20px 10px 20px",
    cursor: "pointer",
    color: theme.palette.primary.contrastText,
  },
  link: {
    textDecoration: "none",
  },
  logo: {
    with: "2rem",
    height: "1rem",
    margin: "0.5rem",
  },
});

export default function Header({ drawerToggleListener }) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [, , removeCookies] = useCookies([]);
  const {
    oauth,
    setOauth,
    drawerVisible,
    setDrawerVisible,
    user,
    setUser,
    setCurrentChannel,
    mode,
  } = useContext(Context);
  const [open, setOpen] = useState(false);
  const drawerToggle = () => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
    setUser(null);
    setOpen(false);
    removeCookies("mode");
  };


  const toggleDrawer = (bool) => (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setOpen(bool);
  };

  const handleClick = () => {
    setOpen(false);
    setCurrentChannel(null);
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
      <Link
        to="/channels/Welcome"
        onClick={() => {
          setCurrentChannel(null);
        }}
      >
        {mode === "dark" ? (
          <LogoIcon css={styles.logo} />
        ) : (
          <LogoIconLight css={styles.logo} />
        )}
      </Link>
      {oauth && (
        <div
          css={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div css={{ marginTop: "5px" }}>
            <LogoutIcon
              onClick={onClickLogout}
              css={{
                marginLeft: "0.5rem",
                cursor: "pointer",
                fill: theme.palette.primary.contrastText,
              }}
            />
          </div>
          <div onClick={toggleDrawer(true)} css={{ cursor: "pointer" }}>
            <Grid container>
              <Grid item xs={2} md={3} lg={3}>
                <Avatar css={styles.avatar}>
                  {user?.avatar ? (
                    <img
                      style={styles.avatar}
                      src={user.avatar}
                      alt="user avatar"
                    />
                  ) : (
                    oauth.email[0].toUpperCase()
                  )}
                </Avatar>
              </Grid>

              <Grid
                item
                xs={10}
                md={9}
                lg={9}
                css={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  heigth: "100%",
                  color: theme.palette.primary.contrastText,
                }}
              >
                {user?.username}
              </Grid>
            </Grid>
          </div>
        </div>
      )}
      <div>
        <React.Fragment>
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            <List>
              <Link to="/channels/Welcome" css={styles.link}>
                <Button onClick={handleClick} css={styles.drawer}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </Button>
              </Link>
              <Divider css={{ my: 0.5 }} />
              <Link to="/settings" css={styles.link}>
                <Button onClick={handleClick} css={styles.drawer}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </Button>
              </Link>
              <Divider css={{ my: 0.5 }} />
              {/* <Link to="/friends" css={styles.link}>
                <Button onClick={handleClick} css={styles.drawer}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Friends" />
                </Button>
              </Link> */}
              <Divider css={{ my: 0.5 }} />
              <Button onClick={onClickLogout} css={styles.drawer}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </Button>
            </List>
          </Drawer>
        </React.Fragment>
      </div>
    </header>
  );
}
