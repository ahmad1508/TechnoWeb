/** @jsxImportSource @emotion/react */
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Fab, Grid, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Local
import Form from "./channel/Form";
import List from "./channel/List";
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

import Dropdown from "./Dropdown";

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
    cursor: "pointer",
  },
  dots: {
    cursor: "pointer",
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    justifyContent: "space-between",
  },
  drop: {
    justifyContent: "flex-end",
  },
  headerTitle: {
    marginLeft: "1rem",
    color: theme.palette.primary.contrastText,
  },
  divider: {
    my: 0.5,
    color: theme.palette.primary.contrastText,
  },
});

export default function Channel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { channels, oauth, setCurrentChannel } = useContext(Context);
  const channel = channels.find((channel) => channel.id === id);
  setCurrentChannel(id);
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const listRef = useRef();
  const [messages, setMessages] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const [modify, setModify] = useState("");
  const addMessage = (message) => {
    setMessages([...messages, message]);
  };
  /*useEffect(() => {
    const fetchFriendsInfo = async () => {
      try {
        const { data: friends } = await axios.put(
          `http://localhost:3001/users/${oauth.email}`,
          {
            username:user.username,
            id:user.id,
            avatar:user.avatar,
            friends: [],
            invitation:[],
            sentInvites:[]
          },
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          })

      }catch(err){
        console.log(err)
      }}
    fetchFriendsInfo()
  }, [setUser])*/
  
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
        listRef.current.scroll()

      } catch (err) {
        navigate("/oups");
      }
    };
    fetch();
  }, [id, oauth.access_token, navigate]);

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

  return (
    <div css={styles.root}>
      <Grid container css={styles.header}>
        <Grid item>
          <h1 css={styles.headerTitle}>{channel.name}</h1>
        </Grid>
        <Box css={styles.drop}>
          <Dropdown channel={channel} />
        </Box>
      </Grid>
      <Divider sx={styles.divider} />
      <List
        channel={channel}
        messages={messages}
        setMessages={setMessages}
        onScrollDown={onScrollDown}
        ref={listRef}
        setContent={setContent}
        modify={modify}
        setModify={setModify}
      />
      <Form
        messages={messages}
        setMessages={setMessages}
        addMessage={addMessage}
        channel={channel}
        content={content}
        setContent={setContent}
        modify={modify}
        setModify={setModify}
      />
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
