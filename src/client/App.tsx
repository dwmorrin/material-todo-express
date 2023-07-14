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

interface ToDoLists {
  active: ToDoItem[];
  done: ToDoItem[];
  deleted: ToDoItem[];
}

const initialLists: ToDoLists = {
  active: [],
  done: [],
  deleted: [],
};

function App() {
  const [text, setText] = useState("");
  const [lists, setLists] = useState(initialLists);
  const [id, setId] = useState(1);

  const addToDo = () => {
    setLists({
      ...lists,
      active: [{ id, timestamp: Date.now(), text }, ...lists.active],
    });
    setId(id + 1);
    setText("");
  };

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
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && addToDo()}
          />
        </Stack>
        <pre>{JSON.stringify(lists, null, 2)}</pre>
      </Paper>
    </Box>
  );
}

export default App;
