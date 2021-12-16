/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
// Layout
import { useContext } from "react";
import Context from "../Context";
import { useTheme } from "@mui/styles";
import { Box, Grid } from "@mui/material";
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
    maxWidth: "70%",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: theme.palette.primary.light,
    borderRadius: "15px 15px 15px 0px",
    padding: "0 10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },

  message_author: {
    maxWidth: "70%",
    alignItems: "flex-end",
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
    "& p": { margin: "0.5rem 0" },
  },
});

export default forwardRef(({ channel, messages, onScrollDown }, ref) => {
  const styles = useStyles(useTheme());
  const val = useContext(Context);

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
            i < messages.length && messages[i + 1]?.author === message?.author;
          const isMessagesConsecutive =
            i > 1 && messages[i - 1]?.author === message?.author;
          if (i > 1)
            console.log(
              isMessagesConsecutive,
              messages[i - 1]?.author,
              message?.author
            );
          return (
            <Box
              key={message.creation}
              css={isTheAuthor ? styles.container_author : styles.container}
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
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box ref={scrollEl} />
    </Box>
  );
});
