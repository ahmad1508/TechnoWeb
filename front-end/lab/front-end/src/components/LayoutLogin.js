import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';


const useStyles = (theme) =>({
    toolbar:theme.mixins.toolbar
  })

export default function LayoutLogin({children}) {
    const styles = useStyles(useTheme())
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Messaging App
          </Typography>
        </Toolbar>
      </AppBar>

        <div>
        <div css={styles.toolbar}> </div>
        {children}
        </div>


    </Box>
  );
}