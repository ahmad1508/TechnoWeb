
/** @jsxImportSource @emotion/react */
import { useContext, useEffect, } from 'react'
// Layout
import { useTheme } from '@mui/styles';
import { Box, Grid, Container, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Prototype } from '../icons/prototype.svg';
/* import Simple from '../icons/Simple.png';
import Private from '../icons/private.png';
import Synced from '../icons/Synced.png';
import Powerful from '../icons/Powerful.png';
import Fast from '../icons/Fast.png';
import Secure from '../icons/Secure.png';
 */

const useStyles = (theme) => ({
    root: {
        backgroundColor: '#111',
        width: "100%",
        flex: '1 1 auto',
        position: 'relative',
    },

    title: {
        fontWeight: "600",
        fontSize: "22px",
        marginBottom: "14px"
    },
    Grid1: {
        padding: "177px 3rem 0rem 0rem",
    },
    Grid2: {
        padding: "61px 3rem 0rem 3rem",
    },
    Grid3: {
        paddingTop: "71px",
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center'
    },
    imageDiv: {
        height: "250px",
        width: "250px",
        marginBottom: "14px",
        background:'#222'
    },
    desc: {
        width: '250px',
        fontWeight: "300"
        
    }


})

export default function Main({ config, codeVerifier, base64URLEncode, sha256 }) {
    const theme = useTheme()
    const styles = useStyles(theme)
    
    console.log(config)
    console.log(codeVerifier)
    const redirect = (e) => {
        e.stopPropagation()
        const code_challenge = base64URLEncode(sha256(codeVerifier))
        const url = [
            `${config.authorization_endpoint}?`,
            `client_id=${config.client_id}&`,
            `scope=${config.scope}&`,
            `response_type=code&`,
            `redirect_uri=${config.redirect_uri}&`,
            `code_challenge=${code_challenge}&`,
            `code_challenge_method=S256`,
        ].join('')

        window.location = url
    }
    return (
        <main css={styles.root}>
            <Container >
                <Grid container>



                    <Grid xs={12} md={6} lg={7} css={styles.Grid1}>
                        <Typography variant="h3" css={{ fontWeight: "600" }}>
                            Notre slogan manifique
                        </Typography>
                        <Typography variant="body1" css={{ fontWeight: "400", paddingTop: "33px" }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit porro eos culpa qui odio iusto veniam neque laboriosam. Adipisci dolorem quos illum consectetur molestias autem iusto aliquid dolore pariatur beatae.
                        </Typography>
                        <Button variant="contained" css={{ marginTop: "33px" }} onClick={redirect}>
                            <Typography variant="body1" css={{ fontWeight: "700" }}>
                                Get Started
                            </Typography>
                        </Button>
                    </Grid>



                    <Grid xs={12} md={6} lg={5} css={styles.Grid2}>
                        <Prototype />
                    </Grid>
                </Grid>



                <Typography variant="h3" css={{ marginTop: '27px', textAlign: 'center', fontWeight: "600" }}>
                    Why messecure ?
                </Typography>



                <Grid container css={{ marginBottom: "5rem" }}>
                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Simple
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>



                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Fast
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>



                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Synced
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>



                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Private
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>



                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Powerful
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>



                    <Grid xs={12} md={6} lg={4} css={styles.Grid3}>
                        <div css={styles.imageDiv}>
                        </div>
                        <Typography variant='h6' css={styles.title}>
                            Secure
                        </Typography>
                        <Typography variant="body1" css={styles.desc}>
                            Un petit text descriptif qui decrira blablabla
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </main >
    );
}

