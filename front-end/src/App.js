
/** @jsxImportSource @emotion/react */
import { useContext, useState, useEffect } from 'react'
// Local
import Oups from './Oups'
//import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
import Settings from "./Settings";
import Friends from "./pages/Friends";
// Rooter
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom"

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
  },
}

export default function App() {
  const location = useLocation()
  const { oauth, user, setUser } = useContext(Context)
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible)
  }

  const gochannels = (<Navigate
    to={{
      pathname: "/channels",
      state: { from: location }
    }}
  />)
  const gohome = (<Navigate
    to={{
      pathname: "/",
      state: { from: location }
    }}
  />)
  return (
    <div className="App" css={styles.root}>

      <Header drawerToggleListener={drawerToggleListener} />
      <Routes>
        <Route path="/" element={oauth ? (gochannels) : (<Login />)} />
        <Route path="/channels/*" element={oauth ? (<Main />) : (gohome)} />
        <Route path="/settings" element={oauth ? (<Settings />) : (gohome)} />
        <Route path="/Friends" element={oauth ? (<Friends />) : (gohome)} />
        <Route path="/Oups" element={<Oups />} />
      </Routes>

    </div>
  );
}
