# Todo list using Vite, Material UI, and Express

## 5nd commit: Simple Todo App (part 4)

### Stuff to do

A way to compare `ToDoItem` instances by value:

```ts
// put this way up top, under the interface definition
// it does not need to be inside the App() function.

const areEqual = (a: ToDoItem, b: ToDoItem) =>
  a.id === b.id && a.timestamp === b.timestamp;
```

Inside `App()`, below the `addToDo` function, let's add `updateActiveItem` which
will make use of `areEqual`:

```ts
const updateActiveItem = (updatedItem: ToDoItem) => {
  const index = lists.active.findIndex((todo) => areEqual(todo, updatedItem));
  if (index === -1)
    return console.error("Application error: can't item", {
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
```

Yikes, that one is a bit messier than I'd like, but we could further clean it up
if we wrote special error handling functions and array helper functions.

The messy spread notation to update `lists.active` is just JavaScript.
We are using the index we found to spread out the array in the same order while
update the place where our old entry was. Google "mdn array prototype slice" and
play with `slice` until you understand how it is working.

Note that we do not _expect_ our error condition to ever run _if our logic is correct_.

When we have an "impossible" condition like this, use a consistent prefix in the
error message (or write a custom error object) to indicate to yourself and others
that this is an "impossible" situation and points to a programming bug.
I'm choosing to use `Application error:` my "impossible" prefix.

Finally, let's "map over" our `lists.active` and have a functioning to-do list:

```jsx
<TextField
  placeholder="Don't forget to..."
  // ... just shown for context... add the next part!
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
```

Does the call to `updateActiveItem` make sense?
Because we create a new object with `{...item, text: e.target.value}`, we
lose the ability to compare items _by reference_ (google it if you don't know what that means),
which is why we wrote a function to compare items _by value_.

Since we already had the `onKeyUp` sitting there, instead of deleting it, I added
the `blur` call. Try it out. It makes your keyboard lose focus of the input element.

A good feature? Not sure, but check out the weird `(e.target as HTMLInputElement).blur()`
part. That is TypeScript. For JavaScript, you just need `e.target.blur()`.

Try removing the `as HTMLInputElement` part and you should get a complaint from TypeScript.
Because the event `target` property can vary, we have to override the type system
and cast the target to be something with a `blur` function. Don't worry about this part
too much, it's not important now, but it will come up again.

### Finished?

You should be able to add new, editable text inputs for your active to do list items.

Next step we will finalize this phase with "done" checkboxes and "delete" buttons.

When you are ready for the next step, run this command:

```sh
yarn next
```

To return to the previous step, run this command:

```sh
yarn prev
```
