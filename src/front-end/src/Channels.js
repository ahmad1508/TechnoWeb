/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import axios from "axios";
// Layout
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

function getColor() {
  return `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${
    85 + 10 * Math.random()
  }%)`;
}

const styles = {
  root: {
    minWidth: "200px",
  },
  channel: {
    padding: ".2rem .5rem",
    whiteSpace: "nowrap",
  },
  icon: {
    color: "#444",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2rem",
    width: "2rem",
    borderRadius: "2rem",
    fontWeight: "800",
  },
};

export default function Channels({ onChannel }) {
  const [channels, setChannels] = useState([]);
  const [colorChannels, setColorChannels] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data: channels } = await axios.get(
        "http://localhost:3001/channels"
      );
      setChannels(channels);
      setColorChannels(channels.map(getColor))
    };
    fetch();
  }, []);
  return (
    <ul style={styles.root}>
      {channels.map((channel, i) => (
        <ListItem
          button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            onChannel(channel);
          }}
        >
          <ListItemIcon>
            <div style={{...styles.icon ,...{ backgroundColor: colorChannels[i] }}}>
              {channel.name[0]}
            </div>
          </ListItemIcon>
          <ListItemText primary={channel.name} />
        </ListItem>
      ))}
    </ul>
  );
}
