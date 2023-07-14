# Todo list using Vite, Material UI, and Express

## 7th commit: Saving our work

Let's meet the server!

### Stuff to do

`src/server/main.ts` is where our server code lives.

`const app = express();` creates an `app` object that we can use to
declare routes where we can read and write data.

The template gives us a `"/hello"` route.
An HTTP GET message sent to `http://localhost:3000/hello` will get
"Hello Vite + React + TypeScript!" sent in reply.

Let's try that first.

#### How do you contact the server from the client?

Short answer `fetch` and `useEffect`.

`fetch` you can read about on MDN. The browser provides this for you. Node and other
JavaScript environments do not. `fetch` is for clients to reach out to other points of
interest on the network.

`useEffect` is from React and you will use it all the time. It is short for "side effect"
(google functional programming, pure functions, side effect, etc to learn more
about the terminology).

Let's call the `/hello` route as an example.

```ts
// update your react import to include useEffect:
import { useEffect, useState } from "react";

//...
function App() {
  // our state stuff here...

  // add this "fetch guard" bit of state...
  const [gettingHello, setGettingHello] = useState(false);

  useEffect(() => {
    if (gettingHello) return;
    setGettingHello(true);
    fetch("/hello")
      .then(console.log)
      .catch(console.error)
      .finally(() => setGettingHello(false));
  }, []);

  // our addToDo and other function here...
}
```

Now when you refresh the page you get this call to "/hello" and the response
is logged to the console.

You can study the ins and outs of `fetch` on MDN.

Note that `useEffect` has an array as the 2nd argument. You always want to have
this array, otherwise you'll end up with infinite looping.

I'd say studying the React docs on `useEffect`. I'll merely show how I use it here.

#### Save state to a file

Let's write a useful route: save our `ToDoLists` to disk!

I'm out of time, so here's a quick look at what to add:

On the server add these routes:

```ts
import { readdir, readFile, writeFile } from "fs";
//...
// this line is after you declare const app = express()
app.use(express.urlencoded({ extended: true }));
//...
// below hello

// get a list of our .json files
app.get("/lists", (_, res) =>
  readdir(".", (error, files) => {
    if (error) return res.json({ error });
    return res.json({ files: files.filter((file) => file.endsWith(".json")) });
  })
);

// get the text inside a file
app.get("/lists/:filename", (req, res) => {
  if (!req.params.filename.endsWith(".json"))
    return res.json({ error: "Sorry, just reading JSON files here." });
  readFile(req.params.filename, "utf8", (error, file) => {
    if (error) return res.json({ error });
    return res.json({ file });
  });
});

app.post("/lists", (req, res) =>
  writeFile("todo-lists.json", JSON.stringify(req.body, null, 2), (error) =>
    res.json({ error })
  )
);
```

And in our client side...

```ts
// way up top...
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

// down in App()...
const [saving, setSaving] = useState(false);
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
  if (saving) return; // maybe call this savingOrLoading...
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
```

And give yourself save/load buttons!

```jsx
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
```

### Finished?

This is the end. You should be able to save and load to disk now.

To return to the previous step, run this command:

```sh
yarn prev
```
