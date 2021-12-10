/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import axios from "axios";
// Layout
import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  List,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// Local
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";

const styles = {
  channel: {
    padding: "0.25rem 0",
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
};

export default function Channels() {
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
  const clickWelcome = () => {
    setCurrentChannel(null);
  };
  return (
    <List css={styles.root}>
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
      {channels.map((channel, i) => (
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
    </List>
  );
}
