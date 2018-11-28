let app = new PIXI.Application(1024,768);
document.body.appendChild(app.view);

app.stage.addChild(new UIButton(0,0,"I am a Button!"));