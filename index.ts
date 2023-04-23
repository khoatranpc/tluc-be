import { config } from "dotenv";
import { App } from "./src/app";

// const http = require("http");
// const express = require("express");
// const socketIo = require("socket.io");
// const app_ = express();
// const sever = http.createServer(app_);
// const io = socketIo(sever, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("join", () => {
//     socket.join("alo");
//   });
//   socket.on("quit", () => {
//     socket.leave("alo");
//   });
//   socket.on("sentMsg", (content) => {
//     io.to("alo").emit("newMsg", content);
//   });
// });

config();

const NAME = "Learn TLU APIs";
const PORT = parseInt(process.env.BACKEND_PORT as string) || 8000;
const app = new App(NAME, PORT);

// app.publicFile()
app.listen();
