import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { useEffect, useState } from "react";

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

type ListName = "active" | "done" | "deleted";

const initialLists: ToDoLists = {
  active: [],
  done: [],
  deleted: [],
};

const readListFromFile = (file: unknown): ToDoLists => {
  try {
    const maybeLists: ToDoLists = JSON.parse(file as string); // Danger!
    const keys: ListName[] = ["active", "done", "deleted"];
    if (keys.every((k) => k in maybeLists && Array.isArray(maybeLists[k])))
      return maybeLists; // we've proven this works as a ToDoLists
    return initialLists;
  } catch (e) {
    return initialLists;
  }
};

function App() {
  const [text, setText] = useState("");
  const [lists, setLists] = useState(initialLists);
  const [id, setId] = useState(1);

  const [gettingHello, setGettingHello] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (gettingHello) return;
    setGettingHello(true);
    fetch("/hello")
      .then((res) => res.text())
      .then(console.log)
      .catch(console.error)
      .finally(() => setGettingHello(false));
  }, []);

  const onSave = () => {
    if (saving) return;
    setSaving(true);
    fetch("/lists", {
      method: "POST",
      body: JSON.stringify(lists),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(({ error }) => {
        if (error) throw error;
        console.log("saved");
      })
      .catch(console.error)
      .finally(() => setSaving(false));
  };

  const onLoad = () => {
    if (saving) return;
    setSaving(true);
    fetch("/lists/todo-lists.json")
      .then((res) => res.json())
      .then(({ error, file }) => {
        if (error) throw error;
        setLists(readListFromFile(file));
      })
      .catch(console.error)
      .finally(() => setSaving(false));
  };

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

  const move = (from: ListName, to: ListName, item: ToDoItem) => {
    const index = lists[from].findIndex((todo) => areEqual(todo, item));
    if (index === -1)
      return console.error("Application error: can't find item", { item });
    setLists({
      ...lists,
      [from]: lists[from].filter((other) => !areEqual(other, item)),
      [to]: [...lists[to], item],
    });
  };

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h5" position="sticky" sx={{ flexGrow: 1 }}>
            Todo list
          </Typography>
          <Button color="inherit" disabled={saving} onClick={onSave}>
            Save
          </Button>
          <Button color="inherit" disabled={saving} onClick={onLoad}>
            Load
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {/* Extra Toolbar is a spacer, see Material UI AppBar demo page for more info */}
      <Paper>
        <Stack>
          <TextField
            autoFocus
            placeholder="Don't forget to..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && addToDo()}
            onBlur={() => text && addToDo()}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => move("active", "done", item)}>
                      <CheckBoxOutlineBlankIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => move("active", "deleted", item)}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
          {lists.done.map((item) => (
            <TextField
              disabled
              key={`${item.id}-${item.timestamp}`}
              value={item.text}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => move("done", "active", item)}>
                      <CheckBoxIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => move("done", "deleted", item)}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
        </Stack>
        <pre>{JSON.stringify(lists, null, 2)}</pre>
      </Paper>
    </Box>
  );
}

export default App;
