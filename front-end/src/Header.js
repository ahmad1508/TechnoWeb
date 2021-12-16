/** @jsxImportSource @emotion/react */
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Avatar, Grid, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Context from "./Context";
import { ReactComponent as LogoIcon } from "./icons/logo-cropped.svg";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Divider, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios'

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
    margin: 'auto'
  },
  drawer: {
    width: "150px",
    margin: "10px 20px 10px 20px",
    cursor: "pointer",
    color: "#fff"
  },
  link: {
    textDecoration: "none"
  }
});

export default function Header({ drawerToggleListener }) {
  const styles = useStyles(useTheme());
  const navigate = useNavigate()
  const { oauth, setOauth, drawerVisible, setDrawerVisible, user, setUser } =
    useContext(Context);
  const [open, setOpen] = useState(false)
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
    setOpen(false)
  };
  const toggleDrawer = (bool) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(bool);
  };

  const handleClick = () => {
    setOpen(false)
  }

  const getUser = async () => {
    if (oauth) {
      const { data: users } = await axios.get(
        'http://localhost:3001/users',
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`
          }
        }
      )
      const thisUser = users.filter(user => oauth.email === user.email)
      setUser(thisUser)

    }
  }


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
      <Link to="/" >
        <LogoIcon

          css={{
            with: "2rem",
            height: "1rem",
            margin: "0.5rem",
          }}
        />
      </Link>
      {oauth && (
        <div css={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <div css={{ marginTop: "5px" }}>
            <LogoutIcon
              onClick={onClickLogout}
              css={{ marginLeft: "0.5rem", cursor: "pointer" }}
            />
          </div>
          <div onClick={toggleDrawer(true)} css={{ cursor: 'pointer' }}>
            <Grid container >
              <Grid xs={2} md={3} lg={3} >
                <Avatar css={styles.avatar}>
                  {oauth.email[0].toUpperCase()}
                </Avatar>
              </Grid>

              <Grid xs={10} md={9} lg={9} css={{ paddingTop: "5px", paddingRight: "30px" }} >
                {oauth.email}
              </Grid>

            </Grid>
          </div>
        </div>
      )}
      <div>
        <React.Fragment>
          <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
          >
            <List>
              <Link to="/" css={styles.link}>
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


    </header >
  );
}
