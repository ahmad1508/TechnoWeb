/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import axios from "axios";
// Layout
import { Link, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const styles = {
  root: {
    minWidth: "200px",
  },
  channel: {
    padding: ".1rem .2rem",
    whiteSpace: "nowrap",
  },
};

export default function Channels({ onChannel }) {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data: channels } = await axios.get(
        "http://localhost:3001/channels"
      );
      setChannels(channels);
    };
    fetch();
  }, []);

  return (
    <ul style={styles.root}>
      {channels.map((channel, i) => (
        <div key={i} css={styles.channel}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChannel(channel);
            }}
            underline="none"
          >
            <ListItem>
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: "2.25rem",
                    height: "2.25rem",
                    fontSize: "1rem",
                    backgroundColor: "#1f1a17",
                  }}
                >
                  {channel.name[0].toUpperCase()}
                  {channel.name[channel.name.length - 1].toUpperCase()}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={channel.name} />
            </ListItem>
          </Link>
        </div>
      ))}
    </ul>
  );
}
