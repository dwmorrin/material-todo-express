import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// import { useState } from "react";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h5" position="sticky" sx={{ flexGrow: 1 }}>
            Todo list
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {/* Extra Toolbar is a spacer, see Material UI AppBar demo page for more info */}
      <Paper>
        <Stack>
          <Typography>Hello. You are at step 2.</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;
