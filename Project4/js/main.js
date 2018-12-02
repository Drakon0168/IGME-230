"use strict";

const app = new PIXI.Application(1024,768);
document.body.appendChild(app.view);
    
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

PIXI.loader.
add(["images/UpgradeScreen.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)});

let sceneManager = new SceneManager(app);