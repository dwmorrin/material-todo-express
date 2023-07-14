# Todo list using Vite, Material UI, and Express

## 3nd commit: Simple Todo App (part 2)

### Stuff to do

#### First TypeScript task: define an `interface` for `ToDoItem`

In `App.tsx`, between your `import` statements and the `function App()` definition,
add your first bit of TypeScript:

```ts
interface ToDoItem {
  id: number;
  timestamp: number;
  text: string;
}
```

When you want to group a collection of data together, reach for the `interface`
first. There are other ways to define a type, but `interface` should be your
first choice for custom objects.

This does not create any variables in our JavaScript code. This will enable
the TypeScript compiler to yell at us if we declare something as a `ToDoItem` and
then use it incorrectly.

Below the interface, lets define a blank `ToDoItem`.

```ts
interface ToDoItem {
  id: number;
  timestamp: number;
  text: string;
}

const initialItem: ToDoItem = {
  id: 0,
  timestamp: Date.now(),
  text: "",
};
```

Note the syntax for adding a type: `const identifier: Type`
Also note that the `interface` definition did _not_ have an equals sign _(assignment operator)_.
When we create the `initialItem`, we do use the equals sign _(assignment operator)_ because we
are **assigning** the literal object `{id: 0, timestamp: Date.now(), text: ""}`
to the identifier `initialItem`.

### Our `ToDoItem` component

Next we will need a component to house each `ToDoItem`.
Material UI's `TextField` will do nicely here.
For now we will _not_ create a custom component, but keep in mind you could.

Let's just add a `TextField` and populate it with our `initialItem`.

Delete the `Typography` inside your `Stack`.

Import and add a `TextField` from Material UI.

Add the properties `value={initialItem.text}` and `placeholder="Don't forget to..."`
or whatever fun placeholder you come up with.

You should see a text box now with the placeholder text showing. You can't type
into yet because the value is always going to be `""`, a.k.a. the empty string,
which is what `initialItem.text` was set to (find `text: ""` in the definition).

### Update the `ToDoItem` with `useState`

Uncomment or add `import { useState } from "react";`

Change (or add) the `useState()` call to

```ts
const [item, setItem] = useState(initialItem);
```

Because we pass in a `ToDoItem` type to `useState()`, TypeScript will only allow
us to pass a `ToDoItem` into `setItem`.

Try calling `setItem(0)` and you'll get an error. (Go ahead and try!)

(Take a moment to realize how 1000% better that is than plain JavaScript,
which would allow you to pass ANYTHING into `setItem`!)

Now update your `TextField` to use `item` instead of `initialItem`
and add the `onChange` handler as shown below.

```jsx
<TextField
  placeholder="Don't forget to..."
  value={item.text} // <-- Don't leave this as initialItem.text!
  onChange={(e) => setItem({ ...item, text: e.target.value })}
/>
```

The syntax `{...anotherObject, key: value}` "spreads" (it's called the spread
operator) the keys and values of `anotherObject` into a new object literal
(`{}` is an object literal), and any `key: value` that comes after the spread
will **overwrite** the `key: value` that may have been spread by `anotherObject.`

That `setItem` line reads to me as "copy item, but update the `text` property
to this new value, `e.target.value`". (`e.target.value` is the HTML text input current value.)

### Finished?

At this point you should have a text box you can type into.

Next we need to make a list of text boxes.

We will go ahead and flesh out our entire app plans in the next step.

When you are ready for the next step, run this command:

```sh
yarn next
```

To return to the previous step, run this command:

```sh
yarn prev
```
