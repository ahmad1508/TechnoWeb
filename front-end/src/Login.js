/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from '@mui/styles';
import { Button, Grid, TextField } from '@mui/material';
import { styled } from '@mui/styles';
import Box from '@mui/material/Box';

const useStyles = (theme)=>({
  Button: {
    background: theme.palette.blue,
  }
})


export default function Login({
  onUser
}) {
  const styles = useStyles(useTheme())
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1>Login to your account</h1>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: "1rem",
        width: '15rem',
      }}>
        <TextField
          id="Username"
          label="Username"
          name="username"
          autoComplete="username"
          fullWidth
          required
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          name="password"
          autoComplete="current-password"
          fullWidth
          required
        />
        <Button variant="contained" onClick={(e) => {
          onUser({ username: "David" })
        }} css={styles.Button}>Login</Button>
        <a href="#" style={{ fontSize: '0.8rem', margin: '0.7rem' }}>Don't have an account ? Create One</a>
      </Box>
    </Box>
  );
}