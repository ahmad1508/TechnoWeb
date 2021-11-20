/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
// Layout
import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/styles";
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
  message: {
    padding: ".2rem 1rem",
    marginRight: "4rem",
    marginTop: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: theme.palette.background.paper,
  },
  date: {
    color: theme.palette.text.hint,
    textAlign: "center",
    fontSize: "0.75rem",
  },
  user: {
    color: theme.palette.primary.dark,
    textAlign: "right",
  },
  user_message: {
    padding: ".2rem 1rem",
    marginLeft: "4rem",
    marginTop: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
});

export default forwardRef(({ channel, messages, onScrollDown, user }, ref) => {
  const styles = useStyles(useTheme());
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
      <h1>{channel.name}</h1>
      <Divider></Divider>
      <ul>
        {messages.map((message, i) => {
          const { value } = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);

          console.log(messages[i - 1]?.author, message?.author)
          const isMessagesLate =
            i > 1 && message.creation - messages[i - 1]?.creation > 1000 * 60;
          const isMessagesConsecutive =
            i > 1 && messages[i - 1]?.author === message?.author;
          return (
            <li>
              {(i < 1 || !isMessagesConsecutive || isMessagesLate) && (
                <Box>
                  <Box css={styles.date}>
                    {dayjs(message.creation).calendar()}
                  </Box>

                  {!isMessagesLate && (
                    <Box css={user.name === message.author && styles.user}>
                      {user.name === message.author ? "You" : message.author}
                    </Box>
                  )}
                </Box>
              )}
              <Box
                css={
                  user.name === message.author
                    ? styles.user_message
                    : styles.message
                }
                dangerouslySetInnerHTML={{ __html: value }}
              ></Box>
            </li>
          )
        })}
      </ul>
      <Box ref={scrollEl} />
    </Box>
  );
});
