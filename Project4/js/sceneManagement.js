"use strict";
//Scene Manager -----------------------------------------------------------------------------
class SceneManager{
    constructor(stage){
        this.menuScene = new MainMenuScreen(this);
        this.gameScene = new GameScreen(this);
        this.upgradeScene = new UpgradeScreen(this);
        this.gameOverScene = new GameOverScreen(this);
        
        this.sceneWidth = app.view.width;
        this.sceneHeight = app.view.height;
            
        this.gameScene.visible = false;
        this.upgradeScene.visible = false;
        this.gameOverScene.visible = false;
        
        app.stage.addChild(this.menuScene);
        app.stage.addChild(this.gameScene);
        app.stage.addChild(this.upgradeScene);
        app.stage.addChild(this.gameOverScene);
        
        this.menuScene.setup();
        this.gameScene.setup();
        this.upgradeScene.setup();
        this.gameOverScene.setup();
        
        this.switchScene("MENU");
    }
    
    switchScene(sceneName){
        switch(sceneName){
            case "MENU":
            default:
                this.menuScene.visible = true;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                break;
            case "GAME":
                this.menuScene.visible = false;
                this.gameScene.visible = true;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                break;
            case "UPGRADE":
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = true;
                this.gameOverScene.visible = false;
                break;
            case "GAMEOVER":
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = true;
                break;
        }
    }
}

//Scene -------------------------------------------------------------------------------------
class Scene extends PIXI.Container{
    constructor(sceneManager, backgroundImage = ""){
        super();
        this.sceneManager = sceneManager;
        if(backgroundImage != ""){
            this.background = new PIXI.Sprite.fromImage(PIXI.loader.resources["UpgradeScreen.png"].texture);
            this.background.anchor.set(0.5,0.5);
            this.background.x = this.sceneManager.sceneWidth / 2;
            this.background.y = this.sceneManager.sceneHeight / 2;
            this.addChild(this.background);
        }
    }
    
    setup(){
        
    }
    
    reset(){
        
    }
    
    centerText(text, x = text.x, y = text.y){
        text.x = x + text.width / 2;
        text.y = y + text.height / 2;
    }
}

//Main Menu ---------------------------------------------------------------------------------
class MainMenuScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    setup(){
        this.playButton = new UIButton(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight / 2, 200, 50, "Play");
        this.playButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
        this.playButton.stageButton(this);
    }
}

//Game Screen -------------------------------------------------------------------------------
class GameScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    setup(){
        this.pauseButton = new UIButton(35, 35, 50, 50, "||");
        this.pauseButton.setAction(function(){
            sceneManager.switchScene("UPGRADE");
        });
        this.pauseButton.stageButton(this);
        
        this.swordButton = new UIButton(this.sceneManager.sceneWidth / 2 - 220, 120, 100, 100, "Sword\nUnit");
        this.swordButton.stageButton(this);
        
        this.spearButton = new UIButton(this.sceneManager.sceneWidth / 2 - 110, 120, 100, 100, "Spear\nUnit");
        this.spearButton.stageButton(this);
        
        this.bowButton = new UIButton(this.sceneManager.sceneWidth / 2, 120, 100, 100, "Bow\nUnit");
        this.bowButton.stageButton(this);
        
        this.flyingButton = new UIButton(this.sceneManager.sceneWidth / 2 + 110, 120, 100, 100, "Flying\nUnit");
        this.flyingButton.stageButton(this);
        
        this.shieldButton = new UIButton(this.sceneManager.sceneWidth / 2 + 220, 120, 100, 100, "Shield\nUnit");
        this.shieldButton.stageButton(this);
    }
}

//Upgrade Screen-----------------------------------------------------------------------------
class UpgradeScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager, "UpgradeScreen.png");
    }
    
    setup(){
        this.returnButton = new UIButton(this.sceneManager.sceneWidth / 2, 35, 200, 50, "Return");
        this.returnButton.setAction(function(){
            sceneManager.switchScene("GAMEOVER");
        });
        this.returnButton.stageButton(this);
    }
}

//Game Over Screen---------------------------------------------------------------------------
class GameOverScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    setup(){
        this.playAgainButton = new UIButton(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight / 2, 200, 50, "Play Again");
        this.playAgainButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
        this.playAgainButton.stageButton(this);
        
        this.menuButton = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 60, 200, 50, "Main Menu");
        this.menuButton.setAction(function(){
            sceneManager.switchScene("MENU");
        });
        this.menuButton.stageButton(this);
    }
}

//UI Button ---------------------------------------------------------------------------------
class UIButton{
    constructor(x = 0, y = 0, width = 100, height = 100, title = "", baseColor=0xFFFFFF, hoverColor=0xDDDDDD, pressedColor=0xAAAAAA){
        this.box = new PIXI.Graphics();
        this.text = new PIXI.Text(title);
        this.title = title;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.baseColor = baseColor;
        this.hoverColor = hoverColor;
        this.pressedColor = pressedColor;
        
        this.drawBox();
        
        this.text.x = this.x - (this.text.width / 2);
        this.text.y = this.y - (this.text.height / 2);
    }
    
    stageButton(stage){
        stage.addChild(this.box);
        stage.addChild(this.text);
    }
    
    drawBox(color = this.baseColor){
        this.box.beginFill(color);
        this.box.drawRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        this.box.endFill();
    }
    
    setAction(action){
        this.box.interactive = true;
        this.box.buttonMode = true;
        this.action = action;
        
        this.box.on('pointerdown', function(){
            action();
        });
    }
}