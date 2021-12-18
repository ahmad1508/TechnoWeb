/** @jsxImportSource @emotion/react */
import { useState, useContext } from "react";
import axios from "axios";
// Layout
import { styled, IconButton, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../Context";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { isTyping } from "react-chat-engine";
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
    height: "100%",
    width: "auto",
    margin: "0px 5px 0px 5px",
  },
});

const Input = styled("input")({
  display: "none",
});

export default function Form({ addMessage, channel }, props) {
  const [content, setContent] = useState("");
  const { oauth, user } = useContext(Context);
  const styles = useStyles(useTheme());
  const [files, setFile] = useState(null);
  const [base64, setBase64] = useState("");

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
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

  const onSubmit = async (e) => {
    e?.preventDefault();

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
    setContent("");
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <label htmlFor="contained-button-file">
        <Input
          accept="image/*"
          id="contained-button-file"
          multiple={false}
          type="file"
          onChange={(e) => handleUpload(e)}
        />
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
          if (ev.key === "Enter" && !ev.shiftKey) {
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
