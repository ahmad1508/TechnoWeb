/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { Box, Grid, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Prototype } from "../icons/prototype.svg";
import Context from '../Context'
import Accordion from '@mui/material/Accordion';
import axios from 'axios'

const useStyles = (theme) => ({
  root: {
    backgroundColor: "#111",
    width: "100%",
    flex: "1 1 auto",
    position: "relative",
  },
  container: {
    width: '100%',
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",

  },
  title: {
    margin: "30px"
  },
  box: {
    marginTop: "10px",
    position: "relative",
    margin: 'auto',
    width: '70%',
  },
  accordion: {
    padding: "10px 20px 10px 20px"
  }

});

export default function Main() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { oauth, user, setUser } = useContext(Context)
  
  console.log(user)
  //const [myFriends, setFriends] = useState(haveFriends ? user.friends : [])
  /* useEffect(() => {
    const fetchFriendsInfo =  () => {
      try {
        const { data: friends } =  axios.post(
          'http://localhost:3001/friends',
          {
            friends: user.friends
          },
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          })
          console.log(friends)

      }catch(err){
        console.log(err)
      }}
    fetchFriendsInfo()
  }, [setFriends]) */

  return (
    <main css={styles.root}>
      <Container>
        <Box css={styles.box}>
          <Typography variant="h4" css={styles.title}>
            Friends
          </Typography>
          {/* {user.friends && user.friends.map((friend) => (
            <Accordion css={styles.accordion}>
              <Grid container>
                <Grid xs={8} md={10} lg={10} >
                  <Typography variant="h6">{friend}</Typography>
                </Grid>

              </Grid>
            </Accordion>
          ))} */}
        </Box>
      </Container>
    </main>
  );
}




