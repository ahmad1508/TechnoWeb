/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from 'react'
// Layout
import { useTheme } from '@mui/styles';
import { Box, Grid, Container } from '@mui/material'

import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import User from './User';

const useStyles = (theme) => ({
    root: {
        backgroundColor: '#111',
        overflow: 'hidden',
        width: "100%",
        flex: '1 1 auto',
        display: 'flex',
        position: 'relative',

    },
    container: {
        width: '70%',
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
    },
    title: {
        margin: "30px"
    },
    box: {
        marginTop: "10px",
        width: '100%',
    },
    accordion: {
        padding: "10px 20px 10px 20px"
    }
})

export default function Main() {
    const theme = useTheme()
    const styles = useStyles(theme)
    
    return (
        <main css={styles.root} container>
            <Container css={styles.container}>
                <Typography variant="h4" css={styles.title}>
                    Account Settings
                </Typography>
                <User usage="modify"/>
                <Box css={styles.box}>
                    <Accordion css={styles.accordion}>
                        <Grid container>
                            <Grid xs={8} md={10} lg={10} >
                                <Typography variant="h6">Account Information</Typography>
                            </Grid>
                            <Grid xs={4} md={2} lg={2} css={{ paddingLeft: "30px" }} >
                                <AutoFixHighIcon />
                            </Grid>
                        </Grid>
                    </Accordion>
                    <Accordion css={styles.accordion}>
                        <Grid container>
                            <Grid xs={8} md={10} lg={10}>
                                <Typography variant="h6">Dark Mode</Typography>
                            </Grid>
                            <Grid xs={4} md={2} lg={2}>
                                <FormControlLabel
                                    value="start"
                                    control={<Switch color="primary" />}
                                    label=""
                                    labelPlacement="start"
                                />
                            </Grid>
                        </Grid>
                    </Accordion>
                    <Accordion css={styles.accordion}>
                        <Grid container>
                            <Grid xs={8} md={9} lg={10}>
                                <Typography variant="h6">Language</Typography>
                            </Grid>
                            <Grid xs={4} md={3} lg={2} css={{ paddingLeft: "30px" }}>
                                <GTranslateIcon/>
                            </Grid>
                        </Grid>
                    </Accordion>
                </Box>
            </Container>

        </main>
    );
}




