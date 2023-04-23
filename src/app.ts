import create_app, { Application, json } from "express";
const express = require("express");
const path = require("path");
import cors from "cors";
import router from "./router";
import chatRepositories from "./repositories/chat";
const socketIo = require("socket.io");

class App {
  private name: string;
  private port: number;
  private app: Application;
  constructor(name: string, port: number) {
    this.name = name;
    this.port = port;
    this.app = create_app();
    this.setUp();
  }

  private setUp() {
    this.setupMiddleware();
    this.setupRouter();
  }
  private setupMiddleware() {
    this.app.use(json());
    this.app.use(
      cors({
        origin: [process.env.CLIENT_DOMAIN, process.env.CLIENT_HOST],
      })
    );
    this.app.use("/static", express.static(path.join(__dirname, "../scorm")));
  }
  private setupRouter() {
    this.app.use(router);
  }

  public listen() {
    // this.app.use("/static", express.static(path.join(__dirname, "public")));
    const sever = this.app.listen(this.port, () => {
      console.log(`${this.name} is running on port ${this.port}`);
    });
    const io = socketIo(sever, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      socket.on('subcribe', subcribe => {
        socket.join(subcribe.idRoom);
      })
      socket.on('on-chat', data => {
        io.to(data.idRoom).emit('user-chat', data);
      })
    });
  }
}

export { App };
