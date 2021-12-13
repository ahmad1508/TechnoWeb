/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

const useStyles = (theme) => ({
  channel: {
    padding: "0.25rem 0",
  },
  addChannel: {
    position: "fixed",
    bottom: 0,
  },
  line: {
    color: "#fff",
  },
  avatar: {
    width: "2.25rem",
    height: "2.25rem",
    fontSize: "1rem",
    backgroundColor: "#fff",
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
    background: theme.palette.primary.main,
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
});

export default function Channels() {
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const naviate = useNavigate();
  const { oauth, channels, setChannels, currentChannel, setCurrentChannel } =
    useContext(Context);
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
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, setChannels]);

  const myChannels = channels.filter(
    (channel) => channel.email === oauth.email
  );

  const clickWelcome = () => {
    setCurrentChannel(null);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const onSubmit = async (e) => {
    const { data: channel } = await axios.post(
      `http://localhost:3001/channels`,
      {
        name: content,
        email: oauth.email, // a changer selon l'utilisateur
      }
    );
    console.log("all good");
  };
  console.log(channels);
  return (
    <List css={styles.root} css={{}}>
      <li css={styles.channel}>
        <Link
          to="/channels"
          component={RouterLink}
          underline="none"
          onClick={clickWelcome}
        >
          <ListItem
            css={{
              backgroundColor:
                currentChannel === undefined || currentChannel === null
                  ? "#8774e1"
                  : "#222",
              borderRadius: "5px",
              margin: "0 10px",
              maxWidth: "180px",
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: "2.25rem",
                  height: "2.25rem",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                }}
              >
                W
              </Avatar>
            </ListItemIcon>
            <ListItemText primary="Welcome" css={styles.line} />
          </ListItem>
        </Link>
      </li>
      {myChannels.map((channel, i) => (
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
                  currentChannel?.id === channel.id ? "#8774e1" : "#222",
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
              <ListItemText primary={channel.name} css={styles.line} />
            </ListItem>
          </Link>
        </List>
      ))}

      <List css={styles.addChannel} onClick={handleOpen}>
        <ListItem css={styles.addButtonChannel}>
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
                onChange={handleChange}
                css={styles.formField}
                required
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Partcipants"
                placeholder="Separate by , "
                multiline
                maxRows={4}
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
    </List>
  );
}
