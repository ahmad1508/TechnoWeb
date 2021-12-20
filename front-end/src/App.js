/** @jsxImportSource @emotion/react */
import { useContext, useState, createContext, useMemo, useEffect } from "react";
//import socketClient from "socket.io-client";
// Local
import Oups from "./Oups";
//import Footer from './Footer'
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Context from "./Context";
import Settings from "./Settings";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Rooter
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getDesignTokens = (mode, primaryColor) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: primaryColor,
            light: "#fff",
            dark: "#eee",
            contrastText: "#000",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: primaryColor,
            light: "#222",
            dark: "#111",
            contrastText: "#ffffff",
          },
        }),
  },
});

const styles = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#565E71",
  },
};

export default function App() {
  const location = useLocation();
  const [cookies, ,] = useCookies(["mode"]);
  const { oauth, mode, setMode, primaryColor } = useContext(Context);
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false);
  // const socket = socketClient("http://127.0.0.1:8080");
  // useEffect(() =>{
  //   socket.on("connection", () => {
  //     console.log(`I'm connected with the back-end`);
  //   });
  // }, [])
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible);
  };

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [setMode]
  );
  useEffect(() => {
    if (cookies.mode === undefined) return;
    setMode(cookies.mode);
  }, [cookies.mode,setMode]);
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode, primaryColor)), [mode, primaryColor]);

  const gochannels = (
    <Navigate
      to={{
        pathname: "/channels/Welcome",
        state: { from: location },
      }}
    />
  );
  const gohome = (
    <Navigate
      to={{
        pathname: "/",
        state: { from: location },
      }}
    />
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <div className="App" css={styles.root}>
          <Header drawerToggleListener={drawerToggleListener} />
          <Routes>
            <Route path="/" element={oauth ? gochannels : <Login />} />
            <Route path="/channels/*" element={oauth ? <Main /> : gohome} />
            <Route path="/settings" element={oauth ? <Settings /> : gohome} />
            <Route path="/Oups" element={<Oups />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
