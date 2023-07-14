# Todo list using Vite, Material UI, and Express

## 6th commit: Simple Todo App (part 5)

### Stuff to do

Quick follow up from the last step: remember the discussion of `blur` and `focus`?
Let's add the `autoFocus` prop to our main input and also a `onBlur` handler to save stuff.

```jsx
<TextField
  autoFocus // <-- Add this
  placeholder="Don't forget to..."
  value={text}
  onChange={(e) => setText(e.target.value)}
  onKeyUp={(e) => e.key === "Enter" && addToDo()}
  onBlur={() => text && addToDo()} // <-- And add this
/>
```

Try it out: you should notice that just clicking away will also add a new note
(provided you've entered some text) just like <kbd>Enter</kbd> does.

Let's get fancy again with Material UI.
You'll need these imports for fancy checkboxes and delete buttons:

```ts
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
```

and we need some more state-changing helper functions:

```ts
// this can be way up top:
type ListName = "active" | "done" | "deleted";

// ... and this should be inside of App()
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
```

A general "move item from one list to another" helper function: `move`.

- We created a type that can only be a literal string of 3 possible values.
  This lets us safely use variables to index into our `lists` object.
- We can pick which list using a variable with the `lists[from]` syntax!
- Note how you also need the square brackets around `[from]` in the `setLists` call.
- Note we are always moving to the back of the destination list.
  Maybe this is ok, or maybe not? Just something to think about.

And add the update to our active item list:

```jsx
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
            <CheckBoxOutlineBlankIcon />
            <DeleteIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
))}
```

If you look in the JSON output, you should see the items moving into the
different lists.

Let's finish this off with adding the "done" list.

```jsx
{
  lists.done.map((item) => (
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
  ));
}
```

### Finished?

Ok, that should be a pretty decent to-do list app now, so lets start on the
server stuff next.

```sh
yarn next
```

To return to the previous step, run this command:

```sh
yarn prev
```
