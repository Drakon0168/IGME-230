"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

//Constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//Preload the images
PIXI.loader.add(["images/Spaceship.png","images/Explosions.png"]).on("progress",e=>{console.log(`progress=${e.progress}`)}).load(setup);

//Aliases
let stage;

//Game Variables