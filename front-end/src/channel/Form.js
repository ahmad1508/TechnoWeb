/** @jsxImportSource @emotion/react */
import { useState, useContext } from "react";
import axios from "axios";
// Layout
import { styled, IconButton, TextField, Button, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../Context";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; const useStyles = (theme) => {
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
    upload: {
      height: "100%",
      width: "auto",
      margin: "0px 5px 0px 5px"
    }

  };
};

const Input = styled('input')({
  display: 'none',
});

export default function Form({ addMessage, channel }) {
  const [content, setContent] = useState("");
  const { oauth } = useContext(Context)
  const styles = useStyles(useTheme());
  const [file, setFile] = useState({})

  const fileUploaded = (e) => {
    setFile(e.target.files[0])
  }



  const onSubmit = async (e) => {
    e?.preventDefault();
      const { data: message } = await axios.post(
        `http://localhost:3001/channels/${channel.id}/messages`,
        {
          content: content,
          author: oauth.email,
        }
      );
      addMessage(message);
      setContent("");
      // a changer selon l'utilisateur */
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file" multiple type="file" />
        <Button variant="contained" css={styles.upload} component="span">
          <AddPhotoAlternateIcon />
        </Button>
      </label>

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
          if ((ev.key === "Enter") && !ev.shiftKey) {
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
