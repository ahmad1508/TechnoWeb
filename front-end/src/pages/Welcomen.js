/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { Box, Grid, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Prototype } from "../icons/prototype.svg";
/* import Simple from '../icons/Simple.png';
import Private from '../icons/private.png';
import Synced from '../icons/Synced.png';
import Powerful from '../icons/Powerful.png';
import Fast from '../icons/Fast.png';
import Secure from '../icons/Secure.png';
 */

const useStyles = (theme) => ({
  root: {
    backgroundColor: "#111",
    width: "100%",
    flex: "1 1 auto",
    position: "relative",
  },

  title: {
    fontWeight: "600",
    fontSize: "20px",
    marginBottom: "14px",
  },
  Grid1: {
    padding: "177px 3rem 0rem 0rem",
  },
  Grid2: {
    padding: "61px 3rem 0rem 3rem",
  },
  Grid3: {
    paddingTop: "71px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageDiv: {
    height: "250px",
    width: "250px",
    marginBottom: "14px",
  },
  desc: {
    width: "250px",
    fontWeight: "300",
    textAlign:'center'
  },
});

export default function Main({
  config,
  codeVerifier,
  base64URLEncode,
  sha256,
}) {
  const theme = useTheme();
  const styles = useStyles(theme);

  console.log(config);
  console.log(codeVerifier);
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join("");

    window.location = url;
  };
  return (
    <main css={styles.root}>
      <Container>
        <Grid container>
          <Grid xs={12} md={6} lg={7} css={styles.Grid1}>
            <Typography variant="h3" css={{ fontWeight: "600" }}>
              Messecure
            </Typography>
            <Typography variant="h5" css={{ fontWeight: "600" }}>
              The futuristic way to communicate
            </Typography>
            <Typography
              variant="body2"
              css={{ fontWeight: "400", paddingTop: "33px" }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
              porro eos culpa qui odio iusto veniam neque laboriosam. Adipisci
              dolorem quos illum consectetur molestias autem iusto aliquid
              dolore pariatur beatae.
            </Typography>
            <Button
              variant="contained"
              css={{ marginTop: "33px" }}
              onClick={redirect}
            >
              <Typography variant="body3" css={{ fontWeight: "700" }}>
                Get Started
              </Typography>
            </Button>
          </Grid>

          <Grid xs={12} md={6} lg={5} css={styles.Grid2}>
            <Prototype />
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          css={{ marginTop: "27px", textAlign: "center", fontWeight: "600" }}
        >
          Why messecure ?
        </Typography>

        <Grid container css={{ marginBottom: "5rem" }}>
          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img
              src="/cats/Simple_cat.png"
              alt="Simple cat"
              css={styles.imageDiv}
            />
            <Typography variant="h6" css={styles.title}>
              Simple
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              Easy to use, you already know how to get started
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img src="/cats/Fast_cat.png"
              alt="Fast cat" css={styles.imageDiv}/>
            <Typography variant="h6" css={styles.title}>
              Fast
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              Delivers messages instantly, in a blink of an eye
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img
              src="/cats/Synced_cat.png"
              alt="Secure cat"
              css={styles.imageDiv}
            />
            <Typography variant="h6" css={styles.title}>
              Synced
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              Access your chats from multiple devices
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img src="/cats/Free_cat.png"
              alt="Free cat" css={styles.imageDiv}/>
            <Typography variant="h6" css={styles.title}>
              Free
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              Just create your account and get started
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img
              src="/cats/Gamer_cat.png"
              alt="secure cat"
              css={styles.imageDiv}
            />
            <Typography variant="h6" css={styles.title}>
              Gamer friendly
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              An gamer way to communicate with your team
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
            <img
              css={styles.imageDiv}
              src="/cats/Secure_Cat.png"
              alt="secure cat"
            />
            <Typography variant="h6" css={styles.title}>
              Secure
            </Typography>
            <Typography variant="body1" css={styles.desc}>
              Don't worry about your data, they're safe from hackers
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
