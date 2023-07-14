# Todo list using Vite, Material UI, and Express

## 4nd commit: Simple Todo App (part 3)

### Stuff to do

After looking at the last commit, I realized we didn't need the ID or timestamp
for our new item entry box. Let's forgot about those for the first text input.

We won't actually need that `initialItem` after all... we can get away with
just tracking the new text.

Delete `initialItem`.

Update our `useState` and our `TextField` like so:

```ts
const [text, setText] = useState("");
```

```jsx
<TextField
  placeholder="Don't forget to..."
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

#### App structure: lists of to-do items

Let's add an overall structure or "state" for our app.

Since people normally add items, mark items done, and maybe delete items,
we should model that with three lists:

```ts
interface ToDoLists {
  active: ToDoItem[];
  done: ToDoItem[];
  deleted: ToDoItem[];
}
```

and make an initial app state:

```ts
const initialLists: ToDoLists = {
  active: [],
  done: [],
  deleted: [],
};
```

and add a `useState` to establish our initial state:

```ts
const [text, setText] = useState("");
const [lists, setLists] = useState(initialLists);
```

Note the syntax for array types: `Type[]`.
An array of string would be `string[]`.
By saying `ToDoItem[]`, we declare that only `ToDoItem` instances will go in those arrays.

#### Sneak peak our app state with `JSON.stringify`

Add this weird line near the bottom of our app:

```jsx
<Paper>
  <Stack>
    <TextField {/* details not shown */} />
  </Stack>
  <pre>{JSON.stringify(lists, null, 2)}</pre>
</Paper>
```

And now you should be getting a sneak peak of the `lists` variable in your
browser. This is a handy tool to use while building a UI.

#### Add an item!

To wrap this step up, lets do the following:

1. Add an `id` with `useState`. Just a number that keeps going up.
1. Listen for a <kbd>Enter<kbd> key and use that to signal we have a new to-do item.
1. Update our `lists`: create a new `ToDoItem` and move it into `lists.active`
1. Reset our input

Let's make a function to encapsulate the dirty work of creating and updating
our data. Add an new `useState` and a `addToDo` function like this:

```ts
const [id, setId] = useState(1);

const addToDo = () => {
  setLists({
    ...lists,
    active: [{ id, timestamp: Date.now(), text }, ...lists.active],
  }); // setLists moves the new entry into the active list
  setId(id + 1); // updates ID so each entry in this session is unique
  setText(""); // resets input for the next new entry
};
```

You may need to carefully study the syntax used for the `setLists` call.

`{...lists}` would just make a shallow copy of the `lists` object.

`{...lists, active: [...lists.active]}` similarly would just be a copy.

`{...lists, active: [NEW_TODO_ITEM, ...lists.active]}` is where the party starts!
Now we are **INSERTING** `NEW_TODO_ITEM` into our active list.

`{...lists, active: [{ id, timestamp: Date.now(), text}, ...lists.active]}`
is the final new state. Does it make sense? If not, review it until it does
because this is **core** of how state updates look in React.

Finally, update our `TextField` to listen for the <kbd>Enter</kbd> key and
call `addToDo`:

```jsx
<TextField
  placeholder="Don't forget to..."
  value={text}
  onChange={(e) => setText(e.target.value)}
  onKeyUp={(e) => e.key === "Enter" && addToDo()}
/>
```

### Finished?

At this point you should be able to type into the box, then hit enter and see
and new entry in the "active" list in the JSON below the text box.

In our next step, we will display our "active" list properly.

When you are ready for the next step, run this command:

```sh
yarn next
```

To return to the previous step, run this command:

```sh
yarn prev
```
