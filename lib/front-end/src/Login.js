/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    background: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& > div": {
      margin: `${theme.spacing(1)}`,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& fieldset": {
      border: "none",
      "& label": {
        marginBottom: theme.spacing(0.5),
        display: "block",
      },
    },
  },
});

export default function Login({ onUser }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          gap: "1rem",
          display: "flex",
          width: "18rem",
          flexDirection: "column",
        }}
      >
        <TextField required label="Username" autoComplete="username" />
        <TextField
          required
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Button
          variant="contained"
          onClick={() => {
            onUser({ name: "david" });
          }}
          sx={{
            width: "100%",
          }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
}
