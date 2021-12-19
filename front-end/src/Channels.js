/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// Layout
import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  List,
  Typography,
  Box,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const useStyles = (theme) => ({
  channel: {
    padding: "0.25rem 0",
  },
  addChannel: {
    position: "fixed",
    bottom: 0,
  },
  line: {
    color: theme.palette.primary.contrastText,
  },
  avatar: {
    width: "2.25rem",
    height: "2.25rem",
    fontSize: "1rem",
    backgroundColor: theme.palette.primary.contrastText,
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "white",
    transform: "translate(-50%, -50%)",
    width: 500,
    background: theme.palette.primary.dark,

    borderRadius: "10px",
    padding: "20px",
  },
  title: {
    padding: "5px 0px",
    textAlign: "center",
    borderRadius: "5px",
  },
  formField: {
    width: "95%",
    margin: "15px auto",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    background: theme.palette.primary.main,
  },
  addButtonChannel: {
    borderRadius: "5px",
    margin: "0 10px",
    maxWidth: "180px",
    cursor: "pointer",
    border: `1px solid ${theme.palette.primary.light}`,
    ":hover": {
      border: `1px solid ${theme.palette.primary.contrastText}`,
    },
  },
  addButton: {
    borderRadius: "5px",
    margin: "0 10px",
    maxWidth: "180px",
    background: theme.palette.primary.main,
    opacity: 1,
    cursor: "pointer",
  }
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Channels() {
  const theme = useTheme();
  const styles = useStyles(theme);
  
  const [content, setContent] = useState("");
  const [participants, setParticipants] = useState("");
  const [open, setOpen] = useState(false);
  const [openVerif, setOpenVerif] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const naviate = useNavigate();
  const [page,setPage] = useState('Welcome')
  const { oauth, channels, setChannels, currentChannel, setCurrentChannel } =
    useContext(Context);

  const handleCloseVerif = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenVerif(false);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: channels } = await axios.get(
          "http://localhost:3001/channels",
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setChannels(channels);

        console.log(channels)
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, setChannels]);

  const clickWelcome = () => {
    setCurrentChannel(null);
    setPage('Welcome')
  };
  const clickFriends = ()=>{
    setCurrentChannel(null);
    setPage('Friends')
  }

  /************************
   * Handle creation submit
   *************************/
  const handleChannelName = (e) => {
    setContent(e.target.value);
  };
  const handleParticipants = (e) => {
    setParticipants(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    //formatParticipants()
    handleClose();
    const { data: channel } = await axios.post(
      `http://localhost:3001/channels`,
      {
        name: content,
        participants: participants,
        email: oauth.email, // a changer selon l'utilisateur
      }
    );

    setChannels([...channels, channel]);
    setOpenVerif(true);
  };

  return (
    <List css={styles.root}>
      <Box css={styles.channel}>
        <Link
          to="/channels/Welcome"
          component={RouterLink}
          underline="none"
          onClick={clickWelcome}
        >
          <ListItem
            css={{
              backgroundColor:
              (page === 'Welcome' && currentChannel === undefined) ||
              (page === 'Welcome' && currentChannel === null)
                  ? theme.palette.primary.main
                  : theme.palette.primary.dark,
              borderRadius: "5px",
              margin: "0 10px",
              maxWidth: "180px",
            }}
          >
            <ListItemIcon>
              <Avatar sx={styles.avatar}>W</Avatar>
            </ListItemIcon>
            <ListItemText primary="Welcome" css={styles.line} />
          </ListItem>
        </Link>
      </Box>
      <Box css={styles.channel}>
        <Link
          to="/channels/friends"
          component={RouterLink}
          underline="none"
          onClick={clickFriends}
        >
          <ListItem
            css={{
              backgroundColor:
              (page === 'Friends' && currentChannel === undefined) ||
              (page === 'Friends' && currentChannel === null)
                  ? theme.palette.primary.main
                  : theme.palette.primary.dark,
              borderRadius: "5px",
              margin: "0 10px",
              maxWidth: "180px",
            }}
          >
            <ListItemIcon>
              <Avatar sx={styles.avatar}>F</Avatar>
            </ListItemIcon>
            <ListItemText primary="Friends" css={styles.line} />
          </ListItem>
        </Link>
      </Box>
      <Box css={styles.channel}>
        <ListItem
          css={{
            borderRadius: "5px",
            margin: "0px 15px",
            marginTop: "10px",
            maxWidth: "180px",
            fontSize: "1.5rem",
          }}
        >
          Discussions
        </ListItem>
      </Box>
      {channels &&
        channels.map((channel, i) => (
          <List key={i} css={styles.channel}>
            <Link
              underline="none"
              href={`/channels/${channel.id}`}
              onClick={(e) => {
                e.preventDefault();
                naviate(`/channels/${channel.id}`);
              }}
            >
              <ListItem
                css={{
                  backgroundColor:
                    currentChannel?.id === channel.id
                      ? theme.palette.primary.main
                      : theme.palette.primary.dark,
                  borderRadius: "5px",
                  margin: "0 10px",
                  maxWidth: "180px",
                }}
              >
                <ListItemIcon>
                  <Avatar css={styles.avatar}>
                    {channel.name[0].toUpperCase()}
                    {channel.name[channel.name.length - 1].toUpperCase()}
                  </Avatar>
                </ListItemIcon>

                <ListItemText primary={channel.name} css={styles.line}/>
              </ListItem>
            </Link>
          </List>
        ))}

      <List css={styles.addChannel} onClick={handleOpen}>
        <ListItem
          css={styles.addButton}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText css={styles.line}>Add channel</ListItemText>
        </ListItem>
      </List>

      {/*****************************************
              Modal for channel creation
      ***************************************** */}
      <div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box css={styles.modal}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h3"
              component="h2"
              css={styles.title}
            >
              Create Channel
            </Typography>

            <form css={styles.form} onSubmit={onSubmit} noValidate>
              <TextField
                id="outlined-multiline-flexible"
                label="Channel Name"
                multiline
                maxRows={4}
                onChange={handleChannelName}
                css={styles.formField}
                required
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Partcipants"
                placeholder="Separate by , "
                multiline
                maxRows={4}
                onChange={handleParticipants}
                css={styles.formField}
              />

              <Button
                variant="contained"
                type="submit"
                css={styles.button && styles.formField}
              >
                Create
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
      <Snackbar
        open={openVerif}
        autoHideDuration={6000}
        onClose={handleCloseVerif}
      >
        <Alert
          onClose={handleCloseVerif}
          severity="success"
          sx={{ width: "100%" }}
        >
          Channel added
        </Alert>
      </Snackbar>
    </List>
  );
}
