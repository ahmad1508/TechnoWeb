/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// Layout
import { useTheme } from "@mui/styles";
import { Box, Grid, Container, Typography, Button, TextField, IconButton, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ReactComponent as Prototype } from "../icons/prototype.svg";
import Context from '../Context'
import Accordion from '@mui/material/Accordion';
import axios from 'axios'
import Gravatar from 'react-gravatar'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from '@mui/icons-material/Delete';
const useStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
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
    margin: "30px",
    color: theme.palette.primary.contrastText
  },
  box: {
    marginTop: "10px",
    position: "relative",
    margin: 'auto',
    width: '70%',
  },
  accordion: {
    padding: "10px 20px 10px 20px"
  },
  avatar: {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "0.5rem",
  },
  field: {
    width: '100%',
    margin: '0px 0px 10px 0px',
    borderRadius: '10px',
    background: theme.palette.primary.light
  },
  accept: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'felx-end',
    color: theme.palette.primary.main,
    cursor: "pointer"

  }

});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



export default function Main() {
  const theme = useTheme();
  const navigate = useNavigate()
  const styles = useStyles(theme);
  const { oauth, user, setUser } = useContext(Context)
  const haveFriends = user.friends !== []
  const haveInvitation = user.Invitation !== []
  const [myFriends, setFriends] = useState([])
  const [open, setOpen] = useState(false)
  const [i, SetI] = useState(0)
  const [addFriend, setAddFriend] = useState()
  const [person, setPerson] = useState()
  const [openD, setOpenD] = useState(false);
  let j = 0

  useEffect(() => {
    const fetch = async (friendId) => {
      try {
        const { data: friend } = await axios.get(
          `http://localhost:3001/users/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        )
        setFriends(myFriends => {
          return [...myFriends, friend]
        })
      } catch (err) {
        console.log(err)
      }
    }
    if (i === 0) {
      user.friends.forEach(friend => fetch(friend))
      SetI(1)
    }
  }, [user.friends])

  const handleCloseD = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };


  const handleClick = (e) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const handleChange = (e) => {
    setAddFriend(e.target.value)
    console.log(addFriend)

  }


  const addFriendSubmit = async (e) => {
    e.preventDefault()
    addFriend.split(",").map(async (friend) => {
      const { data: person } = await axios.get(
        `http://localhost:3001/users/${friend}`,
        { headers: { Authorization: `Bearer ${oauth.access_token}` } })
      if (person !== "") {

        await axios.put(
          `http://localhost:3001/users/${friend}`,
          {
            user: person,
            invitationFrom: oauth.email,
            request: "invited"
          },
          { headers: { Authorization: `Bearer ${oauth.access_token}` } })
        /*const { data: person } = await axios.put(
          `http://localhost:3001/users/${friend}`,
          {
            user: person,
            invitationTo: oauth.email,
            request: "invitee"
          },
          { headers: { Authorization: `Bearer ${oauth.access_token}` } })*/
      }

    })
  }

  const acceptInvitation = async (e, invite) => {
    e.preventDefault()
    await axios.put(
      `http://localhost:3001/users/${invite}`,
      {
        user: user,
        request: 'accept'
      },
      { headers: { Authorization: `Bearer ${oauth.access_token}` } })
    const { data: person } = await axios.get(
      `http://localhost:3001/users/${invite}`,
      { headers: { Authorization: `Bearer ${oauth.access_token}` } })
    console.log(person)

    await axios.put(
      `http://localhost:3001/users/${user.id}`,
      {
        user: person,
        request: 'accept'
      },
      { headers: { Authorization: `Bearer ${oauth.access_token}` } })

    navigate('/channels/friends')
  }

  const rejectInvitation = async (e, invite) => {
    e.preventDefault()
    const { data: person } = await axios.put(
      `http://localhost:3001/users/${invite}`,
      {
        user: user,
        request: 'reject'
      },
      { headers: { Authorization: `Bearer ${oauth.access_token}` } })

  }

  const removeFriend = async (e,friendID)=>{
    e.preventDefault()

    await axios.put(
      `http://localhost:3001/users/${friendID}`,
      {
        user: user,
        request: 'delete'
      },
      { headers: { Authorization: `Bearer ${oauth.access_token}` } })

      const newFriends = myFriends.filter((friend)=>friend.id!==friendID)
      setFriends(newFriends)
      const { data: person } = await axios.get(
        `http://localhost:3001/users/${friendID}`,
        { headers: { Authorization: `Bearer ${oauth.access_token}` } })
      await axios.put(
        `http://localhost:3001/users/${user.id}`,
        {
          user: person,
          request: 'delete'
        },
        { headers: { Authorization: `Bearer ${oauth.access_token}` } })
  
  }



  return (
    <main css={styles.root}>
      <Container>
        <Box css={styles.box}>
          <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" css={styles.title}>
              Friends
            </Typography>

            <Box css={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleClick}>
                <PersonAddIcon />
                <Typography variant="body1" css={{ justifyContent: "flex-start", marginLeft: '10px' }}>
                  Add Friends
                </Typography>
              </Button>
            </Box>

          </Box>
          {open && (
            <Box >
              <form onSubmit={addFriendSubmit} css={{ display: 'flex' }}>
                <TextField
                  id="outlined-basic"
                  label={<PersonAddIcon />}
                  variant="outlined"
                  css={styles.field}
                  onChange={(e) => handleChange(e)}
                />
                <IconButton type="submit" css={{ background: theme.palette.primary.main, width: "55px", height: '55px', marginLeft: "20px" }}>
                  <SendIcon css={styles.sendIcon} />
                </IconButton>
              </form>
            </Box>
          )}

          {haveFriends && myFriends.map((friend) => (
            <Accordion css={styles.accordion} key={j++}>

              <Grid container>
                <Grid item xs={3} md={2} lg={1} >
                  <Gravatar email={friend.id} css={styles.avatar} />
                </Grid>
                <Grid item xs={7} md={8} lg={9} css={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">{friend.id}</Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2} css={{ display: 'flex', alignItems: 'center' }} >
                  <Button onClick={(e)=>removeFriend(e,friend.id)}>
                    <Typography variant="h6"><DeleteIcon /></Typography>
                  </Button>
                </Grid>
              </Grid>
            </Accordion>
          ))}
        </Box>


        <Box css={styles.box}>
          <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" css={styles.title}>
              Invitations
            </Typography>
          </Box>

          {haveInvitation && user.invitation.map((invite) => (
            <Accordion css={styles.accordion} key={j++}>

              <Grid container>
                <Grid item xs={3} md={2} lg={1} >
                  <Gravatar email={invite} css={styles.avatar} />
                </Grid>
                <Grid item xs={7} md={8} lg={9} css={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">{invite}</Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2} >
                  <Box onClick={(e) => acceptInvitation(e, invite)} css={styles.accept}>
                    <Typography variant="body1">Accept</Typography>
                  </Box>
                  <Box onClick={(e) => rejectInvitation(e, invite)} css={styles.accept}>
                    <Typography variant="body1">Reject</Typography>
                  </Box>

                </Grid>
              </Grid>
            </Accordion>
          ))}
        </Box>


      </Container>

      <Snackbar open={openD} autoHideDuration={6000} onClose={handleCloseD}>
        <Alert onClose={handleCloseD} severity="info" sx={{ width: "100%" }}>
          Invotation Sent
        </Alert>
      </Snackbar>
    </main >
  );
}




