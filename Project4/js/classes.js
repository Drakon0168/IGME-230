"use strict";

class SceneManager{
    constructor(stage){
        this.menuScene = new PIXI.Container();
        this.gameScene = new PIXI.Container();
        this.upgradeScene = new PIXI.Container();
        this.gameOverScene = new PIXI.Container();
        this.sceneWidth = app.view.width;
        this.sceneHeight = app.view.height;
            
        this.gameScene.visible = false;
        this.upgradeScene.visible = false;
        this.gameOverScene.visible = false;
        
        app.stage.addChild(this.menuScene);
        app.stage.addChild(this.gameScene);
        app.stage.addChild(this.upgradeScene);
        app.stage.addChild(this.gameOverScene);
        
        this.setupMenuScene();
        this.setupGameScene();
        this.setupUpgradeScene();
        this.setupGameOverScene();
        
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
    
    setupMenuScene(){
        let playButton = new UIButton(this.sceneWidth / 2, this.sceneHeight / 2, 200, 50, "Play");
        playButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
        playButton.stageButton(this.menuScene);
    }
    
    setupGameScene(){
        let pauseButton = new UIButton(25, 25, 50, 50, "||");
        pauseButton.setAction(function(){
            sceneManager.switchScene("UPGRADE");
        });
        pauseButton.stageButton(this.gameScene);
    }
    
    setupUpgradeScene(){
        let returnButton = new UIButton(this.sceneWidth / 2, 35, 200, 50, "Return");
        returnButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
    }
    
    setupGameOverScene(){
        let menuButton = new UIButton(this.sceneWidth / 2, this.sceneHeight / 2, 200, 50, "Menu");
        menuButton.setAction(function(){
            sceneManager.switchScene("MENU");
        });
        menuButton.stageButton(this.gameOverScene);
    }
}

class UIButton{
    constructor(x = 0, y = 0, width = 100, height = 100, title = "Button", baseColor=0xFFFFFF, hoverColor=0xDDDDDD, pressedColor=0xAAAAAA){
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