require("dotenv").config();
import express from "express";
import WebSocket from "ws";
import http from "http";

const sockets = [];

const PORT = process.env.PORT;
const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use("/static", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (socket) => {
  socket.on("open", () => {
    const id = Math.random().toString().substring(2, 12);
    console.log(id);
    socket.id = id;
  });
  sockets.push(socket);
  socket.send("connection success");
  socket.on("close", () => console.log("closed"));

  socket.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "message") {
      sockets.forEach((s) => {
        console.log(s.id, socket.id);
        if (s.id !== socket.id) {
          s.send(
            JSON.stringify({ ...data, nickName: socket.nickName || "Unknowns" })
          );
        }
      });
    }

    if (data.type === "nickName") {
      socket.nickName = data.data;
    }
  });
});
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
