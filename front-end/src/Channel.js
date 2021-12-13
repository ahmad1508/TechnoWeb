/** @jsxImportSource @emotion/react */
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Fab, Grid } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Local
import Form from "./channel/Form";
import List from "./channel/List";
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dropdown from './components/Dropdown'

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "auto",
  },
  fab: {
    ":hover": {
      backgroundColor: theme.palette.primary.dark,

    },
    backgroundColor: theme.palette.primary.light,
    position: "absolute !important",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: "none !important",
  },
  icon: {
    fill: theme.palette.primary.main,
  },
  delete: {
    cursor: 'pointer'
  },
  dots: {
    cursor: 'pointer'
  },
  header: {
    width: '100%'
  },
  drop:{
    justifyContent:'flex-end'
  }
});

export default function Channel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { channels, oauth, setCurrentChannel } = useContext(Context);
  const channel = channels.find((channel) => channel.id === id);
  setCurrentChannel(channel?.id);
  const styles = useStyles(useTheme());
  const listRef = useRef();
  const [messages, setMessages] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const addMessage = (message) => {
    setMessages([...messages, message]);
  };
  /***********dropdown menu variables */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: messages } = await axios.get(
          `http://localhost:3001/channels/${id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setMessages(messages);
        if (listRef.current) {
          listRef.current.scroll();
        }
      } catch (err) {
        navigate("/oups");
      }
    };
    fetch();
  }, [id, oauth, navigate]);

  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown);
  };

  const onClickScroll = () => {
    listRef.current.scroll();
  };

  // On refresh, context.channel is not yet initialized
  if (!channel) {
    return <div>loading</div>;
  }
  /***********************
   * Delete channel
   *********************/
  /*const handleDelete = async ()=>{
    console.log('run')
    try {
      await axios.delete(
        `http://localhost:3001/channels/${id}`,
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      
    } catch (err) {
      navigate("/oups");
    }
    console.log('end')
  }*/
  return (
    <div css={styles.root}>
      <Grid container css={styles.header}>
        <Grid md={10}>
          <h1 css={{ marginLeft: "1rem" }}>Messages for {channel.name}
            <DeleteIcon css={styles.delete} />
          </h1>
        </Grid>
        <Grid md={2} css={styles.drop}>

          <Dropdown />

        </Grid>
      </Grid>

      <List
        channel={channel}
        messages={messages}
        onScrollDown={onScrollDown}
        ref={listRef}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon css={styles.icon} />
      </Fab>
    </div>
  );
}
