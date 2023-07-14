import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useState } from "react";

interface ToDoItem {
  id: number;
  timestamp: number;
  text: string;
}

const initialItem: ToDoItem = {
  id: 0,
  timestamp: Date.now(),
  text: "",
};

function App() {
  const [item, setItem] = useState(initialItem);

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
          <TextField
            placeholder="Don't forget to..."
            value={item.text}
            onChange={(e) => setItem({ ...item, text: e.target.value })}
          />
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;
