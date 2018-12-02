"use strict";

const app = new PIXI.Application(1024,768);
document.body.appendChild(app.view);
    
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let sceneManager = new SceneManager(app);