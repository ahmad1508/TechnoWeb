/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { Box, Grid, Container } from "@mui/material";
import { useCookies } from "react-cookie";
import { CirclePicker } from "react-color";

import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import User from "./User";
import Context from "./Context";

const useStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    overflow: "hidden",
    width: "100%",
    flex: "1 1 auto",
    display: "flex",
    position: "relative",
  },
  container: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: "30px",
    color: theme.palette.primary.contrastText,
  },
  box: {
    marginTop: "10px",
    width: "100%",
  },
  accordion: {
    padding: "10px 20px 10px 20px",
  },
  round: {
    backgroundColor: theme.palette.primary.main,
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    cursor: "pointer",
  },
  wrapper: {
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    position: "relative",
    marginTop: "1rem",
  },
});

export default function Main() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { mode, setMode, primaryColor, setPrimaryColor } = useContext(Context);
  const [, setCookie] = useCookies(["mode"]);
  const [display, setDisplay] = useState(false);
  
  return (
    <main css={styles.root} container>
      <Container css={styles.container}>
        <Typography variant="h4" css={styles.title}>
          Account Settings
        </Typography>
        <User usage="modify" />
        <Box css={styles.box}>

          <Accordion css={styles.accordion}>
            <Grid container>
              <Grid item xs={8} md={10} lg={10}>
                <Typography variant="h6">Dark Mode</Typography>
              </Grid>
              <Grid item xs={4} md={2} lg={2}>
                <FormControlLabel
                  checked={mode === "dark"}
                  control={<Switch color="primary" />}
                  label=""
                  labelPlacement="start"
                  onChange={(e) => {
                    setMode(!e.target.checked ? "light" : "dark");
                    setCookie("mode", !e.target.checked ? "light" : "dark");
                  }}
                />
              </Grid>
            </Grid>
          </Accordion>
          <Accordion css={styles.accordion}>
            <Grid container>
              <Grid item xs={8} md={10} lg={10}>
                <Typography variant="h6">Color</Typography>
              </Grid>
              <Grid item xs={4} md={2} lg={2} css={{ paddingLeft: "30px" }}>
                <Box
                  style={styles.round}
                  onClick={() => {
                    const newState = !display;
                    setDisplay(newState);
                  }}
                />
                {display && (
                  <Box style={styles.wrapper}>
                    <CirclePicker
                      color={primaryColor}
                      onChangeComplete={(color) => {
                        setPrimaryColor(color.hex);
                      }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Accordion>
        </Box>
      </Container>
    </main>
  );
}
