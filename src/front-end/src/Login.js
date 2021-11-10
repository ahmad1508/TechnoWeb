/** @jsxImportSource @emotion/react */
// Layout
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Login({ onUser }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        heigth: "100%"
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
        <TextField
          sx={{
            width: "100%",
          }}
          required
          label="Username"
          autoComplete="username"
        />
        <TextField
          sx={{
            width: "100%",
          }}
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
