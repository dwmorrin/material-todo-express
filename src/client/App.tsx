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

const areEqual = (a: ToDoItem, b: ToDoItem) =>
  a.id === b.id && a.timestamp === b.timestamp;

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

  const updateActiveItem = (updatedItem: ToDoItem) => {
    const index = lists.active.findIndex((todo) => areEqual(todo, updatedItem));
    if (index === -1)
      return console.error("Application error: can't find item", {
        item: updatedItem,
      });
    setLists({
      ...lists,
      active: [
        ...lists.active.slice(0, index),
        updatedItem,
        ...lists.active.slice(index + 1),
      ],
    });
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
          {lists.active.map((item) => (
            <TextField
              key={`${item.id}-${item.timestamp}`}
              value={item.text}
              onChange={(e) =>
                updateActiveItem({ ...item, text: e.target.value })
              }
              onKeyUp={(e) =>
                e.key === "Enter" && (e.target as HTMLInputElement).blur()
              }
            />
          ))}
        </Stack>
        <pre>{JSON.stringify(lists, null, 2)}</pre>
      </Paper>
    </Box>
  );
}

export default App;
