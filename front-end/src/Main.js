
/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from 'react'
// Layout
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer } from '@mui/material';
// Local
import Context from './Context'
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'
import Welcomen from './pages/Welcomen'
import Settings from './Settings'
import {
  Route,
  Routes,
} from 'react-router-dom'
import axios from 'axios';

const useStyles = (theme) => ({
  root: {
    backgroundColor: '#111',
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  drawer: {
    width: '200px',
    display: 'none',
  },
  drawerVisible: {
    display: 'block',
  },
})

export default function Main() {
  const {
    oauth,
    // currentChannel, not yet used
    drawerVisible,
  } = useContext(Context)
  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  const isDrawerVisible = alwaysOpen || drawerVisible
  
  /* const createUser = async () => {
    axios.post(
      'http://localhost:3001/users',
      {
        username: "rami",
        email: 'ramisonji@gmail.com',
      },
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`
        }
      },
    )
  } */
 
  return (
    <main css={styles.root}>
      <Drawer
        PaperProps={{ style: { position: 'relative', backgroundColor: '#222', } }}
        BackdropProps={{ style: { position: 'relative' } }}
        ModalProps={{
          style: { position: 'relative' }
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels />
      </Drawer>
      <Routes>
        <Route path=":id" element={<Channel />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </main>
  );
}
