
/** @jsxImportSource @emotion/react */
import { useContext, useState, createContext, useMemo } from 'react'
// Local
import Oups from './Oups'
//import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
import Settings from "./Settings";
import Friends from "./pages/Friends";
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
// Rooter
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom"
const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: "#8774e1",
            light: "#fff",
            dark: "#eee",
            contrastText: "#000",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#8774e1",
            light: "#222",
            dark: "#111",
            contrastText: "#ffffff",
          },
        }),
  },
});


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
  const { oauth, mode, setMode } = useContext(Context)
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible)
  }

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );
  // Update the theme only if the mode changes
const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

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
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
