import express from "express";
import ViteExpress from "vite-express";

import { readdir, readFile, writeFile } from "fs";

const app = express();

// enables JSON in POST bodies
app.use(express.json());

// route demo
app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

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

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
