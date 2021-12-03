/** @jsxImportSource @emotion/react */
import { createContext, useContext } from "react";
import "./App.css";
// Local
import Main from "./Main";
import Login from "./Login";
import Layout from "./components/Layout";
import LayoutLogin from "./components/LayoutLogin";

import Context from "./Context";
//Context
const styles = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fefefe",
  },
};

export default function App() {
  const { oauth } = useContext(Context);
  return (
    <div className="App" css={styles.root}>
      {oauth ? (
        <Layout>
          <Main />
        </Layout>
      ) : (
        <LayoutLogin>
          <Login />
        </LayoutLogin>
      )}
    </div>
  );
}
