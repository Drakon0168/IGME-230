"use strict";

window.onload = (e) => {
    const app = new PIXI.Application(600,600);
    document.body.appendChild(app.view);
    
    let button1 = new UIButton(0,0, 100, 100, "I am a Button!");
    app.stage.addChild(button1);
}