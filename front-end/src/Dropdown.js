import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Context from "./Context"
import {
    List,
    Typography,
    Box,
    Modal,
    TextField,
} from "@mui/material";

const useStyles = (theme) => ({
    modal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        color: "#ffffff",
        transform: "translate(-50%, -50%)",
        width: 500,
        background: theme.palette.primary.dark,
        borderRadius: "10px",
        padding: "20px",
    },
    title: {
        background: theme.palette.primary.main,
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
        background: theme.palette.primary.main,
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

});

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: '#000000'
            },
        },
    },

}));




export default function Dropdown() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [Open, setOpen] = useState(false)
    const [OpenDelete, setOpenDelete] = useState(false)
    const styles = useStyles(useTheme());
    const [invitation, setInvitation] = useState("")
    const open = Boolean(anchorEl);
    const { id } = useParams()
    const { oauth, currentChannel } = useContext(Context)
    const handleOpenAdd = () => setOpen(true)
    const handleCloseAdd = () => setOpen(false)
    const handleOpenDelete = () => setOpenDelete(true)
    const handleCloseDelete = () => setOpenDelete(false)
    const [button, setButton] = useState('')
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleInvitation = (e) => {
        setInvitation(e.target.value)
    }
    const handleYes = () => {
        setButton('yes')
    }
    const handleNo = () => {
        setButton('no')
    }

    /****************************
    *        Update channel
    ***************************/
    const onSubmit = (e) => {
        e?.preventDefault()
        handleCloseAdd()
        const { data: channel } = axios.put(
            `http://localhost:3001/channels/${id}`,
            {
                invitation: invitation,// a changer selon l'utilisateur
            }
        )
        setInvitation("")
    }

    /****************************
    *        Delete channel
    ***************************/
    const handleDelete = async (e) => {
        e.preventDefault()
        handleCloseDelete()
        console.log(button)
        if (button === 'yes') {
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
            navigate("/");
            console.log(channel)
        }

        console.log('end')
    }


    return (
        <List css={styles.root}>
            <Button
                sx={{ background: "#8774e1", height: '50px', width: "50px", position: 'fixed', right: 0, margin: '15px' }}
                id="demo-customized-button"
                aria-controls="demo-customized-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
            >
                <img src='/dot.svg' alt="click me" />
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
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
                                    variant="contained"
                                    type="submit"
                                    value='yes'
                                    id='yes'
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
                                    id='no'
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
        </List>
    );
}