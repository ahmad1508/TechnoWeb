/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from '@mui/styles';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import crypto from 'crypto'
import qs from 'qs'
import axios from 'axios'

const useStyles = (theme) => ({
  root: {
    color: theme.palette.primary
  },
  Button: {
    background: theme.palette.blue,
  }
})


const base64URLEncode = (str) => {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const sha256 = (buffer) => {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest()
}


const Redirect = ({
  config,
  codeVerifier,

}) => {
  const styles = useStyles(useTheme())
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
    <div css={styles.Button}>
      <Button onClick={redirect} color="secondary">Login with OpenID Connect and OAuth2</Button>
    </div>
  )
}

const Tokens = ({
  oauth,
  onUser
}) => {
  const [, , removeCookie] = useCookies([]);
  const { id_token } = oauth
  const id_payload = id_token.split('.')[1]
  const { email } = JSON.parse(atob(id_payload))
  const logout = (e) => {
    e.stopPropagation()
    removeCookie('oauth')
  }
  
    onUser({ username: "David" })
  
  return (
    <div>
      
    </div>

  )
}

const LoadToken = function ({
  code,
  codeVerifier,
  config,
  removeCookie,
  setCookie
}) {
  const styles = useStyles(useTheme())
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: oauth } = await axios.post(
          config.token_endpoint
          , qs.stringify({
            grant_type: 'authorization_code',
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          }))
        removeCookie('code_verifier')
        setCookie('oauth', oauth)
        window.location = '/'
      } catch (err) {
        console.error(err)
      }
    }
    fetch()
  })
  return (
    <div >Loading tokens</div>
  )
}






export default function Login({
  onUser
}) {
  const styles = useStyles(useTheme())
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const config = {
    authorization_endpoint: 'http://127.0.0.1:5556/dex/auth',
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    client_id: 'webtech-frontend',
    redirect_uri: 'http://127.0.0.1:3000',
    scope: 'openid%20email%20offline_access',
  }
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) { // No: we are no being redirected from an oauth server
    if (!cookies.oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32))
      setCookie('code_verifier', codeVerifier)
      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: "black"
        }}>
          <h1>Login to your account</h1>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: "1rem",
            width: '15rem',
          }}>

            <Redirect codeVerifier={codeVerifier} config={config} />
          </Box>
        </Box>
      )
    } else { // Yes: user is already logged in, great, is is working
      return (
        <Tokens oauth={cookies.oauth} css={styles.root} onUser={onUser}/>


      )
    }
  } else { // Yes, we are coming from an oauth server
    return (
      <LoadToken
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setCookie={setCookie}
        removeCookie={removeCookie} />
    )
  }
}