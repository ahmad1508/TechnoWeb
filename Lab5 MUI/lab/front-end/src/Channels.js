
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Drawer } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from '@mui/material';
// Layout
const styles = {
  root: {
    minWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap',
  }
}

export default function Channels({
  onChannel
}) {
  const [channels, setChannels] = useState([])
  const [state, setState] = useState(false);
  const toggleDrawer = (open) => (e) => {
    setState(open);
  }

  useEffect(() => {
    const fetch = async () => {
      const { data: channels } = await axios.get('http://localhost:3001/channels')
      setChannels(channels)
    }
    fetch()
  }, [])

  return (
    <ul style={styles.root}>
      {channels.map((channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onChannel(channel)
            }}
          >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
