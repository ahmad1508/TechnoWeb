/** @jsxImportSource @emotion/react */
import { useState } from "react";
import Box from "@mui/material/Box";

// Local
import Channel from "./Channel";
import Welcome from "./Welcome";

import MiniDrawer from "./PersistentDrawer";

export default function Main({ onUser, user }) {
  const [channel, setChannel] = useState(null);
  const fetchChannel = async (channel) => {
    setChannel(channel);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <MiniDrawer onChannel={fetchChannel} onUser={onUser}>
        {channel ? <Channel channel={channel} messages={[]} user={user} /> : <Welcome user={user} />}
      </MiniDrawer>
    </Box>
  );
}
