/** @jsxImportSource @emotion/react */
import { useState, useContext } from "react";
import axios from "axios";
// Layout
import { Box, styled, IconButton, TextField, Modal } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../Context";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Picker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import GifIcon from "@mui/icons-material/Gif";
import GifPicker from "react-giphy-picker";

const useStyles = (theme) => ({
  form: {
    padding: ".5rem",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    display: "flex",
  },
  content: {
    flex: "1 1 auto",
    "&.MuiTextField-root": {
      marginRight: theme.spacing(1),
    },
    '&:focus': {
      outline: 'none',
      width: '100%',
      transition: 'width 200ms ease-out',
    }
  },
  send: {
    height: "3rem",
    width: "3rem",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& MuiSvgIcon-endIcon": {
      margin: "0",
    },
  },
  sendIcon: {
    fill: theme.palette.primary.main,
  },
  upload: {
    height: "3rem",
    width: "3rem",
    '&:focus': {
      outline: 'none',
      display:'none',
      transition: 'width 200ms ease-out',
    }
  },
  label: {
    display: "flex",
    alignItems: "center",
  },
  picker: {
    position: "absolute",
    bottom: 70,
    left: 150,
  },
  Gif: {
    position: "absolute",
    bottom: 70,
    left: 200,
  },
  opacity: {
    opacity: 0,
  },
});

const Input = styled("input")({
  display: "none",
});

export default function Form({
  messages,
  setMessages,
  addMessage,
  channel,
  content,
  setContent,
  modify,
  setModify,
}) {
  const { oauth, user } = useContext(Context);
  const styles = useStyles(useTheme());
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [gifPicker, setGifPicker] = useState(false);
  const [files, setFile] = useState(null);
  const [base64, setBase64] = useState("");

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load something...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleUpload = (e) => {
    let file = files;
    file = e.target.files[0];
    if (file.size > 70 * 1024) return;
    // TODO: Add a pop-up message that tells the image is too large
    getBase64(file)
      .then((result) => {
        file["base64"] = result;
        setFile(file);
        setBase64(result);
      })
      .catch((err) => {
        console.log(err);
      });

    setFile(e.target.files[0]);
  };

  const onGifSubmit = async (gifObject) => {
    const { data: message } = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`,
      {
        content: `![alt](${gifObject.downsized.url})`,
        author: oauth.email,
      },
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`,
        },
      }
    );
    addMessage(message);
    setContent("");
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (modify !== "") {
      await axios.put(
        `http://localhost:3001/channels/${channel.id}/message/${modify}`,
        {
          content: content,
          author: oauth.email,
          base64: base64 !== "" ? base64 : "",
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      const newMessages = messages.map((msg) => {
        if (msg.creation === modify) {
          msg.content = content;
        }
        return msg;
      });
      setMessages(newMessages);
      setModify("");
    } else {
      const { data: message } = await axios.post(
        `http://localhost:3001/channels/${channel.id}/messages`,
        {
          content: content,
          author: oauth.email,
          base64: base64 !== "" ? base64 : "",
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      addMessage(message);
    }

    setContent("");
    setFile(null);
  };
  const onEmojiClick = (event, emojiObject) => {
    setContent(content + emojiObject.emoji);
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const openEmojiPicker = (e) => {
    e.preventDefault();
    setEmojiPicker(true);
  };

  const openGifPicker = (e) => {
    e.preventDefault();
    setGifPicker(true);
  };
  const handleCloseEmoji = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setEmojiPicker(false);
  };
  const handleCloseGif = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setGifPicker(false);
  };

  
  return (
    <div>
      <form css={styles.form} onSubmit={onSubmit} noValidate>
        
          <label htmlFor="contained-button-file" style={styles.label}>
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple={false}
              type="file"
              css={styles.upload}
              onChange={(e) => handleUpload(e)}
            />
            <IconButton variant="contained" css={styles.upload} component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <label htmlFor="contained-button-emoji" style={styles.label}>
            <IconButton
              variant="contained"
              onClick={openEmojiPicker}
              css={styles.upload}
              component="span"
            >
              <InsertEmoticonIcon />
            </IconButton>
            <Modal open={emojiPicker} onClose={handleCloseEmoji}>
              <Box css={styles.picker}>
                <Picker css={{ boxShadow: 0 }} onEmojiClick={onEmojiClick} />
              </Box>
            </Modal>
          </label>
          <label htmlFor="contained-button-gif" style={styles.label}>
            <IconButton
              variant="contained"
              onClick={openGifPicker}
              css={styles.upload}
              component="span"
            >
              <GifIcon />
            </IconButton>
            <Modal open={gifPicker} onClose={handleCloseGif}>
              <Box css={styles.Gif}>
                <GifPicker css={{ boxShadow: 0 }} onSelected={onGifSubmit} />
              </Box>
            </Modal>
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
            if (ev.key === "Enter" && !ev.shiftKey) {
              onSubmit();
              ev.preventDefault();
            }
          }}
        autoFocus/>
        <div>
          <IconButton type="submit" css={styles.send}>
            <SendIcon css={styles.sendIcon} />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
