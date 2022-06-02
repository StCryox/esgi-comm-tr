const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const notifications = [];
let LastModified;
let subscribers = [];

app.post("/notifications", (req, res) => {
  // create id
  const id = Date.now();
  // create notif
  const notif = { id, ...req.body };
  notifications.push(notif);
  LastModified = new Date();
  res.setHeader("Last-Modified", LastModified.toUTCString());
  res.json(notif);
  subscribers.forEach((sub) => {
    sub.json(notif);
  });
});

app.get("/notifications", (req, res) => {
  //const { lastId } = req.query;
  //res.json(notifications.filter((notif) => notif.id > lastId));
  if (
    req.headers["if-modified-since"] !== "null" &&
    new Date(req.headers["if-modified-since"]) > LastModified
  ) {
    res.sendStatus(304);
  } else {
    if (LastModified)
      res.setHeader("Last-Modified", LastModified.toUTCString());
    res.json(
      notifications.filter(
        (notif) =>
          req.headers["if-modified-since"] === "null" ||
          new Date(Math.floor(notif.id / 1000) * 1000) >
            new Date(req.headers["if-modified-since"])
      )
    );
  }
});

app.get("/notifications_sub", (req, res) => {
  subscribers.push(res);
  req.on("end", () => {
    subscribers = subscribers.filter((sub) => sub !== res);
  });
});

app.listen(3000, () => console.log("Server listening on port 3000"));
