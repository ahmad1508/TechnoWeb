
/** @jsxImportSource @emotion/react */
// Layout
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { Grid, Typography, } from '@mui/material';
import { ReactComponent as ChannelIcon } from './icons/channel.svg';
import { ReactComponent as FriendsIcon } from './icons/friends.svg';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    backgroundColor: theme.palette.primary.dark
  },
  card: {
    textAlign: 'center',
  },
  icon: {
    width: '30%',
    fill: theme.palette.primary.contrastText,
  }
})

export default function Welcome() {
  const styles = useStyles(useTheme())


  return (
    <div css={styles.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs={12} md={4} lg={4}>

          <div css={styles.card}>
            <ChannelIcon css={styles.icon} />
            <Typography color="textPrimary">
              Create channels
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Link
            to="/channels/friends"
            css={{ cursor: 'pointer' }}

          >
            <div css={styles.card}>
              <FriendsIcon css={styles.icon} />
              <Typography color="textPrimary">
                Invite friends
              </Typography>
            </div>
          </Link>

        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Link
            to="/settings"
            css={{ cursor: 'pointer' }}

          >
            <div css={styles.card}>
              <SettingsIcon css={styles.icon} />
              <Typography color="textPrimary">
                Settings
              </Typography>
            </div>
          </Link>
        </Grid>
      </Grid>
    </div >
  );
}
