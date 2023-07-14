# Todo list using Vite, Material UI, and Express

## 2nd commit: Simple Todo App

### Stuff to do

- Add Material UI! Whoops, forgot to do that in the first commit. Run the following:

```sh
yarn add @emotion/react @emotion/styled @fontsource/roboto @mui/material @mui/icons-material
```

- Make sure your editor is setup for formatting-on-save. For my editor, I need to
  add a `.prettierrc` file that just contains an empty JSON object: `{}`.

  - 🔎 _Check your editor preferences and turn on the "format on save" option!_

- `index.html` sets the title for the app. Find the title tag and replace it with your title.
- `src/client` is where our React app lives. In this step, we will make our ToDo list there.
  - delete the `src/client/assets` directory. We won't use it.
  - remove any references to the assets directory (should just be in `src/client/App.tsx`).
  - delete all `src/client/*.css` files (`*` is a wildcard).
  - remove any references to the `*.css` files in `src/client/{App,main}.tsx`
    - 🔎 _`{a,b}` is shell syntax for two things. Try `echo apple{1,2}`_
- `src/client/main.tsx` is our React app entry file.
  - add the `import "@fontsource...` lines as instructed to by Material UI's installation instructions.
  - add the `CssBassline` from Material UI.
  - 🔎 This file should contain setup stuff that doesn't really pertain to the app logic.
- `src/client/App.tsx` is our main React [component](https://react.dev/learn/your-first-component) (check out the link if you forgot what a React component is).
  - You can comment-out or delete the lines for importing `useState` and calling `useState`.
    - _We will use them soon enough, just not in this step._
  - Add a `Box` for the overall container
    - Add an `AppBar` inside the box
      - Add a `Toolbar` inside the `AppBar`
        - Add a `Typography` with "Todo List" inside or whatever app title you want.
        - Try `variant="h5"` to set a nice size for a title, or whatever you like.
        - Try `position="sticky` and `sx={{ flexGrow: 1 }}`. These are suggestions from the Material UI demo page.
    - Add a `Paper` to hold our main context.
      - Add a `Stack` inside the `Paper` to give us an easy vertical stack layout.
        - Add a `Typography` with "Hello" or whatever you want inside.

### Finished?

You should see an app bar with your app title and a body with some text.
Do you see it?

When you are ready for the next step, run this command:

```sh
yarn next
```

To return to the previous step, run this command:

```sh
yarn prev
```
