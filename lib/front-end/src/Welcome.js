/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import { Box, Grid, Typography, Card, CardActionArea } from "@mui/material";
import { ReactComponent as ChannelIcon } from "./icons/channel.svg";
import { ReactComponent as FriendsIcon } from "./icons/friends.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    background: "rgba(0,0,0,.3)",
  },
  card: {
    textAlign: "center",
    backgroundColor: theme.palette.primary.contrastText,
  },
  icon: {
    width: "30%",
    fill: theme.palette.primary.main,
  },
});

const CardButton = ({ text, Icon }) => {
  const styles = useStyles(useTheme());
  return (
    <Grid item xs>
      <Card css={styles.card} variant="outlined">
        <CardActionArea>
          <Icon css={styles.icon} />
          <Typography>{text}</Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default function Welcome({ user }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        width="100%"
        fontSize="3rem"
        textAlign="left"
        marginBottom="1rem"
      >
        Welcome {user.name}
      </Typography>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <CardButton text="Create channels" Icon={ChannelIcon} />
        <CardButton text="Invite friends" Icon={FriendsIcon} />
        <CardButton text="Settings" Icon={SettingsIcon} />
      </Grid>
    </Box>
  );
}
