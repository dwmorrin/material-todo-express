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

// All responses from the server may contain an error string
interface ErrorResponse {
  error: string;
}

interface ToDoItem {
  id: number;
  timestamp: string;
  text: string;
}

const areEqual = (a: ToDoItem, b: ToDoItem) =>
  a.id === b.id && a.timestamp === b.timestamp;

interface ToDoLists {
  active: ToDoItem[];
  done: ToDoItem[];
  deleted: ToDoItem[];
}

type ListName = keyof ToDoLists;

const initialLists: ToDoLists = {
  active: [],
  done: [],
  deleted: [],
};

const isToDoLists = (obj: unknown): obj is ToDoLists => {
  const keys: ListName[] = ["active", "done", "deleted"];
  return (
    !!obj &&
    typeof obj === "object" &&
    keys.every((k) => k in obj && Array.isArray((obj as ToDoLists)[k]))
  );
};

const readListsFromFile = (file: unknown): ToDoLists => {
  try {
    const maybeLists: ToDoLists = JSON.parse(file as string); // Danger!
    if (isToDoLists(maybeLists)) return maybeLists; // we've proven this works as a ToDoLists
    throw "File is not a valid to-do list";
  } catch (e) {
    console.error(e);
    return initialLists;
  }
};

const isStringArray = (array: unknown): array is string[] =>
  Array.isArray(array) && array.every((x) => typeof x === "string");

function App() {
  const [text, setText] = useState("");
  const [lists, setLists] = useState(initialLists);
  const [id, setId] = useState(1);

  const [gettingFileNames, setGettingFileNames] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [savingOrLoading, setSavingOrLoading] = useState(false);

  const onFileNames = ({
    error,
    files,
  }: ErrorResponse & { files: string[] }) => {
    if (error) throw error;
    if (!isStringArray(files)) throw "Failed to get list of files.";
    setFileNames(files);
  };

  useEffect(() => {
    if (gettingFileNames) return;
    setGettingFileNames(true);
    fetch("/lists")
      .then((res) => res.json())
      .then(onFileNames)
      .catch(console.error)
      .finally(() => setGettingFileNames(false));
  }, []);

  const onSave = () => {
    if (savingOrLoading) return;
    setSavingOrLoading(true);
    fetch("/lists", {
      method: "POST",
      body: JSON.stringify({ title: "my-first-list", lists }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(onFileNames)
      .catch(console.error)
      .finally(() => setSavingOrLoading(false));
  };

  const onLoad = () => {
    if (savingOrLoading) return;
    setSavingOrLoading(true);
    fetch("/lists/todo-lists.json")
      .then((res) => res.json())
      .then(({ error, file }) => {
        if (error) throw error;
        setLists(readListsFromFile(file));
      })
      .catch(console.error)
      .finally(() => setSavingOrLoading(false));
  };

  const addToDo = () => {
    setLists({
      ...lists,
      active: [{ id, timestamp: new Date().toJSON(), text }, ...lists.active],
    });
    setId(id + 1);
    setText("");
  };

  const updateActiveItem = (index: number, updatedItem: ToDoItem) =>
    setLists({
      ...lists,
      active: [
        ...lists.active.slice(0, index),
        updatedItem,
        ...lists.active.slice(index + 1),
      ],
    });

  const move = (from: ListName, to: ListName, item: ToDoItem) =>
    setLists({
      ...lists,
      [from]: lists[from].filter((other) => !areEqual(other, item)),
      [to]: [...lists[to], item],
    });

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h5" position="sticky" sx={{ flexGrow: 1 }}>
            Todo list
          </Typography>
          <Button color="inherit" disabled={savingOrLoading} onClick={onSave}>
            Save
          </Button>
          <Button color="inherit" disabled={savingOrLoading} onClick={onLoad}>
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
          {lists.active.map((item, index) => (
            <TextField
              key={`${item.id}-${item.timestamp}`}
              value={item.text}
              onChange={(e) =>
                updateActiveItem(index, { ...item, text: e.target.value })
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
        <pre>{JSON.stringify({ lists, fileNames }, null, 2)}</pre>
      </Paper>
    </Box>
  );
}

export default App;
