/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
// Layout
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
import { Divider } from "@mui/material";
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
    <div css={styles.root} ref={rootEl}>
      <h1>Messages for {channel.name}</h1>
      <Divider></Divider>
      <ul>
        {messages.map((message, i) => {
          const { value } = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);
          console.log(
            messages[i--]?.author,
            messages[i]?.author,
            messages[i--]?.author === message[i]?.author
          );
          let consec;
          if (i > 1) {
            consec = messages[i--]?.author === message[i]?.author;
          }
          return (
            <li key={i
            }>
              {consec && (
                <div>
                  <div css={styles.date}>
                    {dayjs(message.creation).calendar()}
                  </div>
                  <div css={user.name === message.author && styles.user}>
                    {user.name === message.author ? "You" : message.author}
                  </div>
                </div>
              )}
              <div
                css={
                  user.name === message.author
                    ? styles.user_message
                    : styles.message
                }
                dangerouslySetInnerHTML={{ __html: value }}
              ></div>
            </li>
          );
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  );
});
