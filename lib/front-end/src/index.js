import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "typeface-roboto";
// Layout
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  // palette: {
  //   type: "dark",
  //   primary: {
  //     main: "#694fde",
  //   },
  //   secondary: {
  //     main: "#9d2bdc",
  //   },
  //   error: {
  //     main: "#c62828",
  //   },
  //   background: {
  //     default: "#151221",
  //     paper: "#30324a",
  //   },
  //   divider: "#1e1e33",
  // },
  palette: {
    type: 'light',
    primary: {
      main: '#694fde',
      light: '#8772e4',
      dark: '#49379b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9d2bdc',
      light: '#b055e3',
      dark: '#6d1e9a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#c62828',
      light: '#d15353',
      dark: '#8a1c1c',
      contrastText: '#ffffff',
    },
    divider: '#EEEEEE',
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.54)',
      disabled: 'rgba(0,0,0,0.38)',
      hint: 'rgba(0,0,0,0.38)',
    },
  },
  props: {
    MuiAppBar: {
      color: 'transparent',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
