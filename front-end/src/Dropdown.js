import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// Styles
import { styled } from "@mui/material/styles";
import {
  Grid,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Divider,
  List,
  Typography,
  Box,
  Modal,
  TextField,
  Snackbar,
} from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
// Local
import { ReactComponent as DotIcon } from "./icons/dot.svg";
import { ReactComponent as DotIconLight } from "./icons/dot_light.svg";
import Context from "./Context";
import PeopleIcon from "@mui/icons-material/People";

const useStyles = (theme) => ({
  root: {
    width: "100 %",
  },
  container: {
    width: "70%",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: theme.palette.primary.contrastText,
    transform: "translate(-50%, -50%)",
    width: 500,
    background: theme.palette.primary.dark,
    borderRadius: "10px",
    padding: "20px",
  },
  modal_participants: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: theme.palette.primary.contrastText,
    transform: "translate(-50%, -50%)",
    width: 350,
    background: theme.palette.primary.dark,
    borderRadius: "5px",
  },
  title: {
    padding: "5px 0px",
    textAlign: "center",
    borderRadius: "5px",
  },
  formField: {
    width: "95%",
    margin: "15px auto",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    background: theme.palette.primary.light,
  },
  addButton: {
    borderRadius: "5px",
    margin: "0 10px",
    maxWidth: "180px",
    cursor: "pointer",
    border: `1px solid ${theme.palette.primary.light}`,
    ":hover": {
      border: `1px solid ${theme.palette.primary.contrastText}`,
    },
  },
  titlediff: {
    padding: "5px 0px",
    textAlign: "center",
    borderRadius: "5px",
  },
  participants: {
    padding: "20px",
    position: "relative",
    margin: "auto",
    width: "90%",
  },
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "#000000",
      },
    },
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Dropdown({ channel }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTop, setOpenTop] = useState(false);
  const [Open, setOpen] = useState(false);
  const [OpenDelete, setOpenDelete] = useState(false);
  const [invitation, setInvitation] = useState("");
  const [openD, setOpenD] = useState(false);
  const scroll = "paper";
  const open = Boolean(anchorEl);
  const { oauth, currentChannel, setChannels, channels, mode } =
    useContext(Context);
  const { id } = useParams();
  const styles = useStyles(useTheme());

  const handleOpenAdd = () => setOpen(true);
  const handleCloseAdd = () => setOpen(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [button, setButton] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleInvitation = (e) => {
    setInvitation(e.target.value);
  };
  const handleYes = () => {
    setButton("yes");
  };
  const handleNo = () => {
    setButton("no");
  };
  const handleCloseD = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  /****************************
   *        Update channel
   ***************************/
  const onSubmit = (e) => {
    e?.preventDefault();
    handleCloseAdd();
    const { data: channel } = axios.put(
      `http://localhost:3001/channels/${id}`,
      {
        invitation: invitation,
      }
    );
    setInvitation("");
  };
  const handleClickOpenTop = () => {
    setOpenTop(true);
  };
  const handleCloseTop = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenTop(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openTop]);

  const toggleDrawer = (bool) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenTop(bool);
  };

  /****************************
   *        Delete channel
   ***************************/
  const handleDelete = async (e) => {
    e.preventDefault();
    handleCloseDelete();
    console.log(button);
    if (button === "yes") {
      const { data: channel } = await axios.delete(
        `http://localhost:3001/channels/${id}`,
        {
          channel: currentChannel,
        },
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      const newChannels = channels.filter((chnl) => chnl.id !== channel.id);
      setChannels(newChannels);
      navigate("/channels");
      setOpenDelete(true);
    }
  };

  return (
    <List css={styles.root}>
      <Button
        type="submit"
        sx={[styles.addButton, styles.button]}
        onClick={handleClick}
      >
        {mode === "dark" ? <DotIcon /> : <DotIconLight />}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <Button onClick={handleClickOpenTop}>
            <PeopleIcon />
            View participants
          </Button>
        </MenuItem>
        <Divider sx={{ my: 0.5, color: "#ffffff" }} />
        <MenuItem onClick={handleClose} disableRipple>
          <Button onClick={handleOpenAdd}>
            <PersonAddAltRoundedIcon />
            Invite someone
          </Button>
        </MenuItem>
        <Divider sx={{ my: 0.5, color: "#ffffff" }} />
        <MenuItem onClick={handleClose} disableRipple>
          <Button onClick={handleOpenDelete}>
            <DeleteIcon />
            Delete Channel
          </Button>
        </MenuItem>
      </StyledMenu>

      {/**** Invite Div modal *****/}
      <Modal
        keepMounted
        open={Open}
        onClose={handleCloseAdd}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="keep-mounted-modal-title"
            variant="h3"
            component="h2"
            sx={styles.title}
          >
            Invite people
          </Typography>

          <form sx={styles.form} onSubmit={onSubmit} noValidate>
            <TextField
              id="outlined-multiline-flexible"
              label="Partcipants"
              placeholder="Separate by , "
              multiline
              value={invitation}
              maxRows={4}
              onChange={handleInvitation}
              sx={styles.formField}
            />

            <Button
              variant="contained"
              type="submit"
              sx={styles.addButton && styles.formField}
            >
              Add
            </Button>
          </form>
        </Box>
      </Modal>

      {/**** delete Div modal *****/}
      <Modal
        keepMounted
        open={OpenDelete}
        onClose={handleCloseDelete}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="keep-mounted-modal-title"
            variant="h5"
            component="h5"
            sx={styles.titlediff}
          >
            Are you sure you want to delete this channel
          </Typography>

          <form sx={styles.form} onSubmit={handleDelete} noValidate>
            <Grid container>
              <Grid md={6}>
                <Button
                  type="submit"
                  value="yes"
                  id="yes"
                  onClick={handleYes}
                  sx={styles.addButton && styles.formField}
                >
                  Yes
                </Button>
              </Grid>
              <Grid md={6}>
                <Button
                  variant="contained"
                  type="submit"
                  value="no"
                  id="no"
                  onClick={handleNo}
                  sx={styles.addButton && styles.formField}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openTop}
        onClose={handleCloseTop}
        scroll={scroll}
        css={{ minWidth: "500px", maxWidth: "300px" }}
      >
        <Box sx={styles.modal_participants}>
          <Box sx={{ padding: "10px" }}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Channel Participant
            </Typography>
          </Box>
          <Divider sx={{ width: "100%", my: 0.5 }} />

          {channel.participants.map((participant) => (
            <Box sx={styles.participants}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {participant}
              </Typography>
              <Divider sx={{ my: 0.5 }} />
            </Box>
          ))}
        </Box>
      </Modal>

      {/*  <Container css={styles.container}>
        <div>
          <React.Fragment>
            <Drawer css={styles.topDrawer} anchor="top" open={openTop} onClose={toggleDrawer(false)}>
              <List>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Home" />
                <Divider css={{ my: 0.5 }} />
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </List>
            </Drawer>
          </React.Fragment>
        </div>
      </Container> */}

      <Snackbar open={openD} autoHideDuration={6000} onClose={handleCloseD}>
        <Alert onClose={handleCloseD} severity="info" sx={{ width: "100%" }}>
          Channel Deleted
        </Alert>
      </Snackbar>
    </List>
  );
}
