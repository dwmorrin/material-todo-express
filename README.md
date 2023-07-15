# Todo list using Vite, Material UI, and Express

## ? commit: Cleaning up, listing files

I noticed I we didn't really need to find our items in the arrays.

I updated the updating and moving functions to take the index as an argument.

```ts
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
```

I also replaced the "/hello" call with a list of the filenames.
We are still going to just use a hardcoded file name in this commit,
but this sets us up to have the user save multiple files.

```ts
const [gettingFileNames, setGettingFileNames] = useState(false);
const [fileNames, setFileNames] = useState<string[]>([]);
const [savingOrLoading, setSavingOrLoading] = useState(false);

const onFileNames = ({ error, files }: ErrorResponse & { files: string[] }) => {
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
```

The `onFileNames` function is also used after saving to get the updated
list of file names. (Not needed yet, but soon.)
