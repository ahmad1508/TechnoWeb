/** @jsxImportSource @emotion/react */
import { useState, useContext } from "react";
import axios from "axios";
// Layout
import { styled, IconButton, TextField, Button, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../Context";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import imageCompression from 'browser-image-compression';
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';



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
    upload: {
      height: "100%",
      width: "auto",
      margin: "0px 5px 0px 0px"
    },
    show: {
      position: 'absolute'
    },
    hide: {
      display:'none'
    }

  };
};

const Input = styled('input')({
  display: 'none',
});

export default function Form({ addMessage, channel }, props) {
  const [content, setContent] = useState("");
  const { oauth } = useContext(Context)
  const styles = useStyles(useTheme());
  const [compressedImage, setCompressedImage] = useState("")
  const [files, setFile] = useState(null)
  const [base64, setBase64] = useState("")
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);

  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        //console.log("Called", reader);
        baseURL = reader.result;
        //console.log(baseURL);
        resolve(baseURL);
      };
      //console.log(fileInfo);
    });
  };


  const handleUpload = (e) => {

    let file = files
    file = e.target.files[0]

    getBase64(file)
      .then(result => {
        file["base64"] = result;
        setFile(file)
        setBase64(result)
      })
      .catch(err => {
        console.log(err);
      });

    setFile(e.target.files[0])

  };
  /*const handleCompressImage = (file)=>{
    const options = {
      maxSizeMB :0.08,
      maxWidthOrHeight:400,
      useWebWorker:true,
    }
    if(options.maxSizeMB >= file/1024){
      alert("image too small can't compress")
    }

    let output;
    imageCompression(file,options).then(result=>{
      output = result;
      setCompressedImage(output)
    })
  }*/




  const onSubmit = async (e) => {
    e?.preventDefault();

    const { data: message } = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`,
      {
        content: content,
        author: oauth.email,
        base64: base64 !== "" ? base64 : ""
      },
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`,
        },
      },
    );
    addMessage(message);
    setContent("");
    setFile(null)
    /*
      a changer selon l'utilisateur*/
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const openEmojiPicker = (e) => {
    e.preventDefault()
    if (emojiPicker === false) {
      setEmojiPicker(true)
    }
    else {
      setEmojiPicker(false)
    }

  }

  const onEmojiClick = (event, emojiObject) => {
    setContent(emojiObject.emoji);
  };

  return (
    <div>
      {/* <Picker css={styles.show} open={emojiPicker} /> */}

      <form css={styles.form} onSubmit={onSubmit} noValidate>
        <label htmlFor="contained-button-file">
          <Input accept="image/*" id="contained-button-file" multiple={false} type="file" onChange={(e) => handleUpload(e)} />
          <Button variant="contained" css={styles.upload} component="span">
            <AddPhotoAlternateIcon />
          </Button>
        </label>
        <label htmlFor="contained-button-file">

          <Button variant="contained" onClick={openEmojiPicker} css={styles.upload} component="span">
            <InsertEmoticonIcon />
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
    </div>
  );
}
