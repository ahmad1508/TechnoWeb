
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import axios from 'axios';
// Layout
import { Link,ListItem,ListItemIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';

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
        <div key={i} css={styles.channel}>

          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onChannel(channel)
            }}
            underline="none"
          >
            <ListItem >
              <ListItemIcon>
                <Avatar sx={{width:"30px",height:"30px",fontSize:"1rem"}}>{channel.name[0].toUpperCase()}{channel.name[channel.name.length-1].toUpperCase()}</Avatar>
              </ListItemIcon>
              {channel.name}

            </ListItem>


          </Link>
        </div>
      ))}
    </ul>
  );
}
