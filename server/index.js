const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const authRouter = require("./routes/auth.routes")

const fileUpload = require("express-fileupload")
const app = express()
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')
const gameEndpoints = require("./config/gameEndpoints");
const gameController = require("./controllers/gameController");

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.static('uploads'));
app.use(express.json())
app.use("/api/auth", authRouter);


app.set("port", PORT);
const http = require("http").Server(app);
const socket = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

socket.on("connection", (socket) => {
    console.log("User connected");
    socket.on(gameEndpoints.getGames, (params) => {
      console.log("User get all");
      gameController.getGames(params, (data) =>
        socket.emit(gameEndpoints.sendGame, data)
      );
    });
    socket.on(gameEndpoints.addGame, (game) => {
      console.log("gameEndpoints.addGame");
      gameController.addGame(game, (data) =>
        socket.emit(gameEndpoints.sendGame, data)
      );
    });
    socket.on(gameEndpoints.getEditedGame, (params) => {
      console.log("gameEndpoints.getEditedGame", params);
      gameController.getEditedGame(params, (data) =>
        socket.emit(gameEndpoints.sendEditedGame, data)
      );
    });
    socket.on(gameEndpoints.editGame, (game) => {
      console.log("gameEndpoints.editGame");
      gameController.editGame(game, (data) =>
        socket.emit(gameEndpoints.sendGame, data)
      );
    });
    socket.on(gameEndpoints.deleteGame, (game) => {
      console.log("gameEndpoints.deleteGame");
      gameController.deleteGame(game, (data) => {
        console.log(data);
        return socket.emit(gameEndpoints.sendGame, data);
      });
    });
    socket.on("disconnect", function () {
      console.log("user disconnected");
    });
  });


const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"));
        http.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
