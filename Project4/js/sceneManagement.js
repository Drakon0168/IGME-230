"use strict";
//Scene Manager -----------------------------------------------------------------------------
class SceneManager{
    constructor(stage){
        this.sceneWidth = app.view.width;
        this.sceneHeight = app.view.height;
        this.deltaTime = 0;
        
        this.menuScene = new MainMenuScreen(this);
        this.gameScene = new GameScreen(this);
        this.upgradeScene = new UpgradeScreen(this);
        this.gameOverScene = new GameOverScreen(this);
        
        this.gameScene.visible = false;
        this.upgradeScene.visible = false;
        this.gameOverScene.visible = false;
        
        app.stage.addChild(this.menuScene);
        app.stage.addChild(this.gameScene);
        app.stage.addChild(this.upgradeScene);
        app.stage.addChild(this.gameOverScene);
        
        this.currentScene = undefined;
        this.switchScene("MENU");
    }
    
    switchScene(sceneName){
        switch(sceneName){
            case "MENU":
            default:
                this.currentScene = this.menuScene;
                this.menuScene.visible = true;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                break;
            case "GAME":
                this.currentScene = this.gameScene;
                this.menuScene.visible = false;
                this.gameScene.visible = true;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                break;
            case "UPGRADE":
                this.currentScene = this.upgradeScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = true;
                this.gameOverScene.visible = false;
                break;
            case "GAMEOVER":
                this.currentScene = this.gameOverScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = true;
                break;
        }
    }
    
    update(deltaTime){
        this.deltaTime = deltaTime;
        
        this.currentScene.update(deltaTime);
    }
}

//Scene -------------------------------------------------------------------------------------
class Scene extends PIXI.Container{
    constructor(sceneManager){
        super();
        this.sceneManager = sceneManager;
        this.setup();
        this.reset();
    }
    
    setup(backgroundImage = ""){
        if(backgroundImage != ""){
            this.background = new PIXI.Sprite(PIXI.loader.resources[`images/${backgroundImage}`].texture);
            this.background.anchor.set(0.5,0.5);
            this.background.scale.set(1024,768);
            this.background.width = this.sceneManager.sceneWidth / 2;
            this.background.height = this.sceneManager.sceneHeight / 2;
        }
        else{
            this.background = new PIXI.Graphics();
            this.background.beginFill(0xAAAAAA);
            this.background.drawRect(this.sceneManager.sceneWidth / -2, this.sceneManager.sceneHeight / -2, this.sceneManager.sceneWidth, this.sceneManager.sceneHeight);
            this.background.x = this.sceneManager.sceneWidth / 2;
            this.background.y = this.sceneManager.sceneHeight / 2;
            this.background.endFill();
        }
        
        this.addChild(this.background);
    }
    
    reset(){
        
    }
    
    update(deltaTime){
        
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
        super.setup();
        
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
        
        this.enemyManager = new EnemyManager(this, ["SWORD", "SPEAR", "FLYING"], 2.5);
        this.reset();
    }
    
    setup(){
        super.setup();
        
        //Setup Buttons
        this.pauseButton = new UIButton(85, 35, 150, 50, "Upgrade");
        this.pauseButton.setAction(function(){
            sceneManager.switchScene("UPGRADE");
        });
        this.pauseButton.stageButton(this);
        
        this.swordButton = new UIButton(90, 120, 160, 100, "Sword\nUnit\n20g");
        this.swordButton.setAction(function(){
            sceneManager.gameScene.spawnUnit("SWORD", 1);
        });
        this.swordButton.stageButton(this);
        
        this.spearButton = new UIButton(260, 120, 160, 100, "Spear\nUnit\n25g");
        this.spearButton.setAction(function(){
            sceneManager.gameScene.spawnUnit("SPEAR", 1);
        });
        this.spearButton.stageButton(this);
        
        this.bowButton = new UIButton(430, 120, 160, 100, "Bow\nUnit\n25g");
        this.bowButton.setAction(function(){
            sceneManager.gameScene.spawnUnit("BOW", 1);
        });
        this.bowButton.stageButton(this);
        
        this.flyingButton = new UIButton(600, 120, 160, 100, "Flying\nUnit\n15g");
        this.flyingButton.setAction(function(){
            sceneManager.gameScene.spawnUnit("FLYING", 1);
        });
        this.flyingButton.stageButton(this);
        
        this.shieldButton = new UIButton(770, 120, 160, 100, "Shield\nUnit\n35g");
        this.shieldButton.setAction(function(){
            sceneManager.gameScene.spawnUnit("SHIELD", 1);
        });
        this.shieldButton.stageButton(this);
        
        //SetupLabels
        this.healthLabel = new UIButton(this.sceneManager.sceneWidth / 2, 35, this.sceneManager.sceneWidth - 340, 50, "Health");
        this.healthLabel.centered = false;
        this.healthLabel.positionText();
        this.healthLabel.stageButton(this);
        
        this.goldLabel = new UIButton(939, 35, 150, 50, "Gold: 100g");
        this.goldLabel.stageButton(this);
        
        this.goldPerSecondLabel = new UIButton(939, 120, 150, 100,"Gold Per\nSecond\n5");
        this.goldPerSecondLabel.stageButton(this);
        
        //Setup Lanes
        this.lane1 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 350, 10, 100);
        this.lane1.setAction(function(){
            sceneManager.gameScene.switchLane(1);
        });
        this.lane1.stageButton(this);
        
        this.lane2 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 240, 10, 100);
        this.lane2.setAction(function(){
            sceneManager.gameScene.switchLane(2);
        });
        this.lane2.stageButton(this);
        
        this.lane3 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 130, 10, 100);
        this.lane3.setAction(function(){
            sceneManager.gameScene.switchLane(3);
        });
        this.lane3.stageButton(this);
        
        this.switchLane(2);

        //Setup Castle
    }
    
    update(deltaTime){
        this.lane1.update(deltaTime);
        this.lane2.update(deltaTime);
        this.lane3.update(deltaTime);
        this.enemyManager.update(deltaTime);
        
        
        this.goldTimer += deltaTime;
        if(this.goldTimer > 1){
            this.gold += this.goldPerSecond;
            this.goldTimer = 0;
        }
        
        this.goldLabel.setText(`Gold: ${this.gold}g`);
    }
    
    reset(){
        this.lane1.resetLane();
        this.lane2.resetLane();
        this.lane3.resetLane();
        
        this.goldPerSecond = 5;
        this.gold = 100;
        this.goldTimer = 0;
    }
    
    switchLane(lane){
        switch(lane){
            case 1:
            default:
                this.selectedLane = this.lane1;
                this.lane1.select(true);
                this.lane2.select(false);
                this.lane3.select(false);
                break;
            case 2:
                this.selectedLane = this.lane2;
                this.lane1.select(false);
                this.lane2.select(true);
                this.lane3.select(false);
                break;
            case 3:
                this.selectedLane = this.lane3;
                this.lane1.select(false);
                this.lane2.select(false);
                this.lane3.select(true);
                break;
        }
    }
    
    getLane(laneNum = 4){
        switch(laneNum){
            case 1:
                return this.lane1;
            case 2:
                return this.lane2;
            case 3:
                return this.lane3;
        }
        return this.selectedLane;
    }
    
    spawnUnit(unitType, direction, lane = this.selectedLane){
        if(direction == 1){
            if(lane.sectionFull(0)){
                return false;
            }
        }
        else{
            if(lane.sectionFull(lane.laneLength - 1)){
                return false;
            }
        }
        
        let newUnit = undefined;
        
        switch(unitType){
            case "SWORD":
            default:
                if(direction == 1){
                    if(this.gold < 20){
                        return false;
                    }
                    
                    this.gold -= 20;
                }
                
                newUnit = new Unit(lane, 75, 40, 0xFF0000, "SWORD", direction);
                break;
            case "SPEAR":
                if(direction == 1){
                    if(this.gold < 25){
                        return false;
                    }
                    
                    this.gold -= 25;
                }
                
                newUnit = new Unit(lane, 75, 40, 0x00FF00, "SPEAR", direction);
                break;
            case "BOW":
                if(direction == 1){
                    if(this.gold < 25){
                        return false;
                    }
                    
                    this.gold -= 25;
                }
                
                newUnit = new Unit(lane, 75, 40, 0x0000FF, "BOW", direction);
                break;
            case "FLYING":
                if(direction == 1){
                    if(this.gold < 15){
                        return false;
                    }
                    
                    this.gold -= 15;
                }
                
                newUnit = new Unit(lane, 75, 40, 0xFFFF00, "FLYING", direction);
                break;
            case "SHIELD":
                if(direction == 1){
                    if(this.gold < 35){
                        return false;
                    }
                    
                    this.gold -= 35;
                }
                
                newUnit = new Unit(lane, 75, 40, 0xDD00DD, "SHIELD", direction);
                break;
        }
        
        lane.units.push(newUnit);
        newUnit.stageUnit(this);
        return true;
    }
}

//Upgrade Screen-----------------------------------------------------------------------------
class UpgradeScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    setup(){
        super.setup("UpgradeScreen.png");
        
        this.returnButton = new UIButton(this.sceneManager.sceneWidth / 2, 35, 200, 50, "Return");
        this.returnButton.setAction(function(){
            sceneManager.switchScene("GAME");
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
        super.setup();
        
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
    constructor(x = 0, y = 0, width = 100, height = 100, title = "", baseColor=0xFFFFFF, hoverColor=0xDDDDDD, pressedColor=0xAAAAAA, centered = true){
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
        this.centered = true;
        
        this.drawBox();
    }
    
    stageButton(stage){
        stage.addChild(this.box);
        stage.addChild(this.text);
    }
    
    drawBox(color = this.baseColor){
        this.box.beginFill(color);
        this.box.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
        this.box.x = this.x;
        this.box.y = this.y;
        this.box.endFill();
        this.positionText();
    }
    
    setText(value){
        this.text.text = value;
        this.positionText();
    }
    
    positionText(){
        this.text.y = this.y - (this.text.height / 2);
        
        if(this.centered){
            this.text.x = this.x - (this.text.width / 2);
        }
        else{
            let margin = (this.box.height - this.text.height) / 2;
            this.text.x = (this.x - (this.box.width / 2)) + margin;
        }
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

//Lane --------------------------------------------------------------------------------------
class Lane extends UIButton{
    constructor(x = 510, y = 384,laneLength=10, height=100){
        super(x, y,laneLength * 100, height, "");
        this.sectionLength = 100;
        
        this.selected = false;
        this.laneLength =laneLength;
        this.pixelLength =laneLength * this.sectionLength;
        this.units = [];
    }
    
    select(value){
        if(value){
            super.drawBox(this.hoverColor);
        }
        else{
            super.drawBox(this.baseColor);
        }
    }
    
    update(deltaTime){
        for(let i = 0; i < this.units.length; i++){
            this.units[i].update(deltaTime);
        }
        
        this.units = this.units.filter(u=>u.alive)
    }
    
    sectionFull(index){
        if(index >= this.laneLength || index < 0){
            return true;
        }
        
        let sectionMin = (this.x - (this.pixelLength / 2)) + (index * this.sectionLength);
        let sectionMax = (this.x - (this.pixelLength / 2)) + ((index + 1) * this.sectionLength);
        
        for(let i = 0; i < this.units.length; i++){
            if(this.units[i].x > sectionMin && this.units[i].x < sectionMax){
                return this.units[i];
            }
        }
        return false;
    }
    
    getSection(xValue){
        let currentSection = Math.floor((xValue - (this.x - (this.pixelLength / 2))) / this.sectionLength);
        return currentSection;
    }
    
    getForwardUnit(unit){
        let closestUnit = undefined;
        let closestDistance = this.pixelLength;
        
        for(let i = 0; i < this.units.length; i++){
            if(unit != this.units[i]){
                let direction = this.units[i].x - unit.x;
                if(direction * unit.direction > 0){
                    if(Math.abs(direction) < closestDistance){
                        closestDistance = direction;
                        closestUnit = this.units[i];
                    }
                }
            }
        }
        
        if(closestUnit){
            return closestUnit;
        }
        else{
            return false;
        }
    }
    
    getEnemies(unit){
        let enemies = [];
        
        for(let i = 0; i < this.units.length; i++){
            if(this.units[i].direction != unit.direction){
                if(Math.abs(this.units[i].x - unit.x) <= unit.attackRange){
                    enemies.push(this.units[i]);
                }
            }
        }
        
        enemies.sort(function(a,b){
            return Math.abs(a.x - unit.x) - Math.abs(b.x - unit.x);
        });
        
        return enemies;
    }
    
    resetLane(){
        
        for(let i = 0; i < this.units.length; i++){
            this.units[i].unstageUnit();
        }
        
        this.units = [];
    }
}

class Camera{
    constructor(){
        this.xOffset = 0;
        this.scrollSpeed = 100;
    }
    
    static getOffset(){
        return this.xOffset;
    }
    
    static Scroll(direction){
        this.xOffset += this.scrollSpeed * direction * SceneManager.getDeltaTime();
    }
}