"use strict";

const app = new PIXI.Application(1024,768);
document.body.appendChild(app.view);
    
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

PIXI.loader.add(["images/UpgradeScreen.png", "images/TitleScreen.png", "images/GameScreen.png", "images/InstructionsScreen.png", "images/Lane.png",
                 "images/SwordUnit.png", "images/SpearUnit.png", "images/BowUnit.png", "images/FastUnit.png", "images/ShieldUnit.png"]).

on("progress",e=>{console.log(`progress=${e.progress}`)});

let sceneManager = new SceneManager(app);

//Update Loop
function update(){
    let deltaTime = 1/app.ticker.FPS;
    if(deltaTime > 1/12){
        deltaTime = 1/12;
    }
    
    sceneManager.update(deltaTime);
}

app.ticker.add(update);