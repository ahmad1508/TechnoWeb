/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import axios from "axios";
// Layout
import { IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";

const useStyles = (theme) => {
  // See https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/OutlinedInput/OutlinedInput.js
  const borderColor =
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.23)"
      : "rgba(255, 255, 255, 0.23)";
  return {
    form: {
      borderTop: `2px solid ${borderColor}`,
      padding: ".5rem",
      display: "flex",
    },
    content: {
      flex: "1 1 auto",
      "&.MuiTextField-root": {
        marginRight: theme.spacing(1),
      },
    },
    send: {
      height: "3rem",
      width: "3rem",
      borderRadius: "50%",
      backgroundColor: "#222",
      "&:hover": {
        backgroundColor: "#111",
      },
      "& MuiSvgIcon-endIcon": {
        margin: "0",
      },
    },
    sendIcon: {
      fill: theme.palette.primary.main,
    },
  };
};

export default function Form({ addMessage, channel }) {
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const onSubmit = async (e) => {
    e?.preventDefault();
    const { data: message } = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`,
      {
        content: content,
        author: "david",
      }
    );
    addMessage(message);
    setContent("");
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        id="outlined-multiline-flexible"
        label="Message"
        multiline
        maxRows={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            onSubmit();
            ev.preventDefault();
          }
        }}
      />
      <div>
        <IconButton type="submit" css={styles.send}>
          <SendIcon css={styles.sendIcon} />
        </IconButton>
      </div>
    </form>
  );
}
