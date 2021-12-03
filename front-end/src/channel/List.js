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
    width: "60%",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: "1rem 0rem 1rem 1rem",
    backgroundColor: "#2196f3",
    boxShadow: 3,
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  },
  message2: {
    width: "",
    alignItems: "flex-end",
    margin: "1rem 1rem 1rem 30%",
    backgroundColor: "#fefefe",
    boxShadow: 3,
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    ":hover": {
      backgroundColor: "",
    },
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
    <div css={styles.root} ref={rootEl}>
      <h1>Messages for {channel.name}</h1>
      <div css={styles.layout}>
        {messages.map((message, i) => {
          const { value } = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);
          return (
            <div
              key={i}
              css={
                message.author === val.username.toLowerCase()
                  ? styles.message2
                  : styles.message
              }
            >
              <p>
                <span>{message.author}</span>
                {" - "}
                <span>{dayjs().calendar(message.creation)}</span>
              </p>
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </div>
          );
        })}
      </div>
      <div ref={scrollEl} />
    </div>
  );
});
