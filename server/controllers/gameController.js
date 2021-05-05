const Router = require("express");
const fs = require("fs");
const config = require("config");
const Game = require("../model/game");

const game = new Game();
game.initGames();


const router = new Router();

const workingDir = __dirname.slice(0, __dirname.lastIndexOf("/"));

exports.getGames = (params, returnFunction) => {
  try {
    returnFunction({
      status: "success",
      message: "Games retrieved successfully",
      payload: game.getGames(),
    });
    //console.log(game.getGames())
  } catch (e) {
    console.log(e);
    returnFunction({
      status: "error",
      message: err,
    });
  }
}; 

exports.addGame = async (gameData, returnFunction) => {
  try {
      let file;
      if (gameData?.file)
             file = gameData?.file[0];
    

    game.newGame(
        gameData.name,
        gameData.genre,
        gameData.developer,
        gameData.description,
        gameData.gameHours
    );

    returnFunction({
      status: "success",
      message: "Game add successfully",
    });
  } catch (e) {
    console.log(e);
    returnFunction({
      status: "error",
      message: err,
    });
  }
};

exports.getEditedGame = (gameData, returnFunction) => {
  try {
    const gameId = gameData.gameId;
    const editedGame = game.getGameByID(gameId);
    console.log(editedGame);

    returnFunction({
      status: "success",
      message: "Edited game retrieved successfully",
      payload: editedGame,
    });
  } catch (e) {
    console.log(e);
    returnFunction({
      status: "error",
      message: err,
    });
  }
};

exports.editGame = async (gameData, returnFunction) => {
  try {
    const file = gameData.file ? gameData.file[0] : null;
    

    game.editGameByID(
        gameData.gameId,
        gameData.name,
        gameData.genre,
        gameData.developer,
        gameData.description,
        gameData.gameHours
    );

    returnFunction({
      status: "success",
      message: "Game edit successfully",
    });
  } catch (e) {
    console.log(e);
    returnFunction({
      status: "error",
      message: err,
    });
  }
};

exports.deleteGame = async (gameData, returnFunction) => {
  try {
    const gameId = gameData.gameId;
    game.deleteGameByID(gameId);

    returnFunction({
      status: "success",
      message: "Game deleted successfully",
      payload: game.getGames(),
    });
  } catch (e) {
    console.log(e);
    returnFunction({
      status: "error",
      message: err,
    });
  }
};

