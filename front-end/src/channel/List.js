/** @jsxImportSource @emotion/react */
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Layout
import { useContext } from "react";
import Context from "../Context";
import { useTheme } from "@mui/styles";
import { Box } from "@mui/material";
// Markdown
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
// Time
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    sameElse: "DD/MM/YYYY hh:mm A",
  },
});

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    overflow: "auto",
    "& ul": {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
    },
  },
  layout: {
    display: "flex",
    flexDirection: "Column",
  },
  message: {
    maxWidth: "60%",
    overflowWrap: "anywhere",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: theme.palette.primary.light,
    borderRadius: "15px 15px 15px 0px",
    padding: "0 10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },

  message_author: {
    maxWidth: "60%",
    alignItems: "flex-end",
    overflowWrap: "anywhere",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "15px 15px 0 15px",
    padding: "0 10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    margin: "0 0 0.5rem 1rem",
    alignItems: "flex-end",
  },
  container_author: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "0 0.25rem 0.5rem 1rem",
  },
  empty_avatar: {
    width: "3rem",
    height: "0.25rem",
    marginRight: "0.5rem",
  },
  avatar: {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "0.5rem",
  },
  avatar_author: {
    display: "none",
  },
  user: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
    marginTop: "0.25rem",
  },
  date: {
    fontSize: "0.75rem",
    color: "#888",
    textAlign: "right",
    marginBottom: "0.25rem",
  },
  date_author: {
    fontSize: "0.75rem",
    color: theme.palette.primary.light,
    textAlign: "right",
    marginBottom: "0.25rem",
  },
  message_content: {
    fontSize: "20px",
    "& p": { margin: "0.5rem 0" },
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default forwardRef(
  ({ channel, messages, setMessages, onScrollDown }, ref) => {
    const styles = useStyles(useTheme());
    const val = useContext(Context);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = useState("");
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    // Expose the `scroll` action
    useImperativeHandle(ref, () => ({
      scroll: scroll,
    }));
    const rootEl = useRef(null);
    const scrollEl = useRef(null);
    const scroll = () => {
      scrollEl.current.scrollIntoView();
    };
    // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
    const throttleTimeout = useRef(null); // react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const rootNode = rootEl.current; // react-hooks/exhaustive-deps
      const handleScroll = () => {
        if (throttleTimeout.current === null) {
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
            const { scrollTop, offsetHeight, scrollHeight } = rootNode; // react-hooks/exhaustive-deps
            onScrollDown(scrollTop + offsetHeight < scrollHeight);
          }, 200);
        }
      };
      handleScroll();
      rootNode.addEventListener("scroll", handleScroll);
      return () => rootNode.removeEventListener("scroll", handleScroll);
    });

    /****************************
     *        Delete message
     ***************************/
    const handleDeleteMessage = async (e, creation) => {
      e.preventDefault();
      const { data: message } = await axios.delete(
        `http://localhost:3001/channels/${channel.id}/message/${creation}`,
        {
          headers: {
            Authorization: `Bearer ${val.oauth.access_token}`,
          },
        }
      );
      const newMessages = messages.filter((msg) => msg.creation !== creation);
      setMessages(newMessages);
      setOpen(true);

      console.log("end");
    };

    const handleContextMenu = (e, id) => {
      e.preventDefault();
      setSelected(selected === id ? "" : id);
    };

    return (
      <Box css={styles.root} ref={rootEl}>
        <Box css={styles.layout}>
          {messages.map((message, i) => {
            const { value } = unified()
              .use(markdown)
              .use(remark2rehype)
              .use(html)
              .processSync(message.content);
            const isTheAuthor =
              message?.author === val.oauth.email?.toLowerCase();
            const isLastMessageUser =
              i < messages.length &&
              messages[i + 1]?.author === message?.author;
            const isMessagesConsecutive =
              i > 1 && messages[i - 1]?.author === message?.author;
            const isMenuVisible = message.creation === selected;
            return (
              <Box
                key={message.creation}
                css={isTheAuthor ? styles.container_author : styles.container}
                onContextMenu={(e) => handleContextMenu(e, message.creation)}
              >
                {!isLastMessageUser ? (
                  <Box css={isTheAuthor ? styles.avatar_author : styles.avatar}>
                    {message?.author.split("")[0].toUpperCase()}
                  </Box>
                ) : (
                  <Box css={styles.empty_avatar}></Box>
                )}
                <Box css={isTheAuthor ? styles.message_author : styles.message}>
                  {(i < 1 || !isMessagesConsecutive) && (
                    <Box>
                      <Box css={styles.user}>
                        {!isTheAuthor && message.author}
                      </Box>
                    </Box>
                  )}

                  <Box
                    dangerouslySetInnerHTML={{ __html: value }}
                    css={styles.message_content}
                  ></Box>
                  <Box css={isTheAuthor ? styles.date_author : styles.date}>
                    {dayjs(
                      new Date(Math.floor(parseInt(message.creation) / 1000))
                    ).calendar()}
                  </Box>

                  {isMenuVisible && (
                    <>
                      <Button css={{ color: "#111", height: "1rem" }}>
                        <AutoFixNormalIcon />
                        Modify
                      </Button>
                      <Button
                        css={{ color: "#111", height: "1,5rem" }}
                        onClick={(e) =>
                          handleDeleteMessage(e, message.creation)
                        }
                      >
                        <DeleteOutlinedIcon />
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              css={{ background: "#111" }}
              sx={{ width: "100%" }}
            >
              Message Deleted
            </Alert>
          </Snackbar>
        </Box>
        <Box ref={scrollEl} />
      </Box>
    );
  }
);
