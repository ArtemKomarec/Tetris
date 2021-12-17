import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const element = document.querySelector('#root');

const game = new Game();
const view = new View(element, 480, 640, 20, 10);
const controller = new Controller(game, view);