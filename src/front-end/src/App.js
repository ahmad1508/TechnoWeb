/** @jsxImportSource @emotion/react */
import { useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
// Local
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column"
    }}>
      <Header />
      {user ? <Main onUser={setUser} user={user} /> : <Login onUser={setUser} />}
      <Footer />
    </Box>
  );
}
