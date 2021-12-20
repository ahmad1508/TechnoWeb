import { Box, Typography, useTheme, TextField, Button, styled, IconButton } from "@mui/material";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import Context from "./Context";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from "@mui/material/Tooltip";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  main: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  titlediff: {
    padding: "5px 0px",
    textAlign: "center",
    borderRadius: "5px",
    width: "100%",
    color: theme.palette.primary.contrastText,
  },
  avatar: {
    width: "5rem",
    height: "5rem",
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.primary.contrastText,
    fontSize: "3rem",
  },
  small_avatar: {
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "100%",
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  small_images: {
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "100%",
  },
  big_images: {
    width: "5rem",
    height: "5rem",
    borderRadius: "100%",
  },
  avatar_wrapper: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "17rem",
    gap: "1rem",
    margin: "1rem 0",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 3rem",
  },
});

const defaultAvatar = [
  "/avatars/Profilpic_angel.png",
  "/avatars/Profilpic_base.png",
  "/avatars/Profilpic_demon.png",
  "/avatars/Profilpic_glass.png",
  "/avatars/Profilpic_mexican.png",
  "/avatars/Profilpic_ninja.png",
  "/avatars/Profilpic_witch.png",
];
const Input = styled("input")({
  display: "none",
});
export default function User({ usage, setUserExist = () => { } }) {
  let i = 0;
  const { oauth, setUser, user } = useContext(Context);
  const styles = useStyles(useTheme());
  const isModify = usage === "modify";
  const [username, setUsername] = useState(isModify ? user?.username : "");
  const [selected, setSelected] = useState(isModify ? user?.avatar : "");
  const [files, setFile] = useState(null);
  const [base64, setBase64] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

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
    if (file.size > 70 * 1024) alert('image too big');
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
    setSelected(base64)

  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const onSubmit = async (e) => {
    const us =
      selected === ""
        ? {
          username,
          friends: [],
          invitation: [],
          sentInvites: [],
        }
        : {
          username,
          avatar: selected,
          friends: user.friends || [],
          invitation: user.invitation || [],
          sentInvites: user.sentInvites || [],
        };
    const body = {
      user: us,
      id: oauth.email,
    };
    const body2 = {
      user: us,
      id: oauth.email,
      request: "modify",
    };
    if (isModify) {
      const u = await axios.put(`http://localhost:3001/users/${oauth.email}`, body2);
      console.log(u)
    } else {
      await axios.post("http://localhost:3001/users", body);
      setUserExist(true);
    }
    console.log(us);
    setUser(us);


  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };
  useEffect(() => {
    if (user) return;
    // get user
    const getUser = async () => {
      const res = await axios.get(`http://localhost:3001/users/${oauth.email}`);
      if (res.data !== "") {
        setUser(res.data);
        setUsername(res.data.username);
        setSelected(res.data.avatar);
      }
    };
    getUser();
  }, [oauth.email, setUser, user]);
  return (
    <Box sx={styles.root}>
      {!isModify && (
        <Typography
          id="keep-mounted-modal-title"
          variant="h5"
          component="h5"
          sx={styles.titlediff}
        >
          Let's create your user profile !
        </Typography>
      )}
      <Box sx={styles.main}>
        <Box sx={styles.avatar}>
          {selected === "" ? (
            username === "" ? (
              oauth.email[0].toUpperCase()
            ) : (
              username.split("")[0].toUpperCase()
            )
          ) : (
            <img style={styles.big_images} src={selected} alt={selected} />
          )}
        </Box>
        <Box sx={styles.avatar_wrapper}>
          {defaultAvatar.map((avatar) => {
            return (
              <Box
                key={i++}
                sx={styles.small_avatar}
                onClick={() => {
                  if (selected === avatar) {
                    setSelected("");
                  } else {
                    setSelected(avatar);
                  }
                }}
              >
                <img style={styles.small_images} src={avatar} alt={avatar} />
              </Box>
            );
          })}
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
              <Tooltip title="Add your own photo">
                <AccountCircleIcon />
              </Tooltip>
              <Typography variant="body1" sx={{ marginLeft: '10px' }}> Upload your avatar <Typography variant="body2">Changes on save</Typography></Typography>

            </IconButton>
          </label>
        </Box>
        <Box sx={styles.avatar_wrapper}>

        </Box>
        <TextField
          id="outlined-multiline-flexible"
          label="Username"
          placeholder=""
          value={username}
          onChange={handleUsername}
          sx={styles.formField}
          autoFocus
        />
        <Button
          type="submit"
          sx={styles.button}
          variant="contained"
          onClick={onSubmit}
        >
          {isModify ? "Update" : "Create"}
        </Button>
      </Box>
      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          File too big max 80kb
        </Alert>
      </Snackbar>
    </Box>
  );
}
