"use strict";
//Scene Manager -----------------------------------------------------------------------------
class SceneManager{
    //Sets up the initial game
    constructor(stage){
        this.sceneWidth = app.view.width;
        this.sceneHeight = app.view.height;
        this.deltaTime = 0;
        
        //load in max level
        this.key = "jxd8037-MaxLevel";
        this.maxLevel = localStorage.getItem(this.key);
        
        if(!this.maxLevel){
            this.maxLevel = 1;
            localStorage.setItem(this.key, this.maxLevel);
        }
        
        this.currentLevel = 1;
        
        this.menuScene = new MainMenuScreen(this);
        this.gameScene = new GameScreen(this);
        this.upgradeScene = new UpgradeScreen(this);
        this.gameOverScene = new GameOverScreen(this);
        this.instructionsScene = new InstructionsScene(this);
        this.levelScene = new LevelsScene(this);
        
        this.gameScene.visible = false;
        this.upgradeScene.visible = false;
        this.gameOverScene.visible = false;
        this.instructionsScene.visible = false;
        this.levelScene.visible = false;
        
        app.stage.addChild(this.menuScene);
        app.stage.addChild(this.gameScene);
        app.stage.addChild(this.upgradeScene);
        app.stage.addChild(this.gameOverScene);
        app.stage.addChild(this.instructionsScene);
        app.stage.addChild(this.levelScene);
        
        this.currentScene = undefined;
        this.switchScene("MENU");
    }
    
    //Switches between screens
    switchScene(sceneName){
        switch(sceneName){
            case "MENU":
            default:
                this.currentScene = this.menuScene;
                this.menuScene.visible = true;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                this.instructionsScene.visible = false;
                this.levelScene.visible = false;
                break;
            case "GAME":
                this.currentScene = this.gameScene;
                this.menuScene.visible = false;
                this.gameScene.visible = true;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                this.instructionsScene.visible = false;
                this.levelScene.visible = false;
                break;
            case "UPGRADE":
                this.currentScene = this.upgradeScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = true;
                this.gameOverScene.visible = false;
                this.instructionsScene.visible = false;
                this.levelScene.visible = false;
                break;
            case "GAMEOVER":
                this.currentScene = this.gameOverScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = true;
                this.instructionsScene.visible = false;
                this.levelScene.visible = false;
                break;
            case "INSTRUCTIONS":
                this.currentScene = this.instructionsScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                this.instructionsScene.visible = true;
                this.levelScene.visible = false;
                break;
            case "LEVEL":
                this.currentScene = this.instructionsScene;
                this.menuScene.visible = false;
                this.gameScene.visible = false;
                this.upgradeScene.visible = false;
                this.gameOverScene.visible = false;
                this.instructionsScene.visible = false;
                this.levelScene.visible = true;
                this.levelScene.updateLevels();
                break;
        }
    }
    
    //Updates the current screen
    update(deltaTime){
        this.deltaTime = deltaTime;
        
        this.currentScene.update(deltaTime);
    }
    
    //Updates the max level stored in local storage
    updateStorage(){
        localStorage.setItem(this.key, this.maxLevel);
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
    
    //Sets the background image
    setup(backgroundImage = ""){
        if(backgroundImage != ""){
            this.background = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/${backgroundImage}`));
            this.background.anchor.set(0.5,0.5);
            this.background.scale.set(1,1);
        }
        else{
            this.background = new PIXI.Graphics();
            this.background.beginFill(0xAAAAAA);
            this.background.drawRect(this.sceneManager.sceneWidth / -2, this.sceneManager.sceneHeight / -2, this.sceneManager.sceneWidth, this.sceneManager.sceneHeight);
            this.background.endFill();
        }
        
        this.background.x = this.sceneManager.sceneWidth / 2;
        this.background.y = this.sceneManager.sceneHeight / 2;
        
        this.addChild(this.background);
    }
    
    //Does any resetting that the screen might need
    reset(){
        
    }
    
    //Updates any objects that may need to be updated
    update(deltaTime){
        
    }
    
    //Centers text on a position
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
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("TitleScreen.png");
        
        this.playButton = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 150, 200, 50, "Play");
        this.playButton.setAction(function(){
            sceneManager.switchScene("LEVEL");
        });
        this.playButton.stageButton(this);
        
        this.instructionsButton = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 210, 200, 50, "Instructions");
        this.instructionsButton.setAction(function(){
            sceneManager.switchScene("INSTRUCTIONS");
        });
        this.instructionsButton.stageButton(this);
    }
}

//Game Screen -------------------------------------------------------------------------------
class GameScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
        
        this.enemyManager = new EnemyManager(this, ["SWORD", "SPEAR", "BOW", "FLYING", "SHIELD"], 2.5);
        this.reset();
    }
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("GameScreen.png");
        
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
        
        this.flyingButton = new UIButton(600, 120, 160, 100, "Fast\nUnit\n15g");
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
        
        this.enemyHealthLabel = new UIButton(this.sceneManager.sceneWidth / 2, 733, this.sceneManager.sceneWidth - 340, 50, "Enemy");
        this.enemyHealthLabel.centered = false;
        this.enemyHealthLabel.positionText();
        this.enemyHealthLabel.stageButton(this);
        
        this.goldLabel = new UIButton(939, 35, 150, 50, "Gold: 100g");
        this.goldLabel.stageButton(this);
        
        this.goldPerSecondLabel = new UIButton(939, 120, 150, 100,"Gold Per\nSecond\n5");
        this.goldPerSecondLabel.stageButton(this);
        
        //Setup Lanes
        this.lane1 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 350, 10, 100);
        this.lane1.setAction(function(){
            sceneManager.gameScene.switchLane(1);
        });
        this.lane1.drawLane();
        this.lane1.stageButton(this);
        
        this.lane2 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 240, 10, 100);
        this.lane2.setAction(function(){
            sceneManager.gameScene.switchLane(2);
        });
        this.lane2.drawLane();
        this.lane2.stageButton(this);
        
        this.lane3 = new Lane(this.sceneManager.sceneWidth / 2, this.sceneManager.sceneHeight - 130, 10, 100);
        this.lane3.setAction(function(){
            sceneManager.gameScene.switchLane(3);
        });
        this.lane3.drawLane();
        this.lane3.stageButton(this);
        
        this.switchLane(2);

        //Setup Castles
        this.friendlyCastle = new Castle(1, 1000);
        this.friendlyCastle.stageCastle(this);
        
        this.enemyCastle = new Castle(-1, 1000);
        this.enemyCastle.stageCastle(this);
    }
    
    // Updates all of the lanes and castles as well as the enemy manager, stats, and labels
    update(deltaTime){
        this.lane1.update(deltaTime);
        this.lane2.update(deltaTime);
        this.lane3.update(deltaTime);
        this.enemyManager.update(deltaTime);
        this.friendlyCastle.update(deltaTime);
        this.enemyCastle.update(deltaTime);
        
        this.goldTimer += deltaTime;
        if(this.goldTimer > 1){
            this.gold += this.goldPerSecond;
            this.goldTimer = 0;
        }
        
        this.goldLabel.setText(`Gold: ${this.gold}g`);
        this.goldPerSecondLabel.setText(`Gold Per\nSecond\n${this.goldPerSecond}`);
    }
    
    //resets all of the lanes and stats back to their default values
    reset(){
        this.lane1.resetLane();
        this.lane2.resetLane();
        this.lane3.resetLane();
        this.friendlyCastle.resetCastle();
        this.enemyCastle.resetCastle();
        
        this.goldPerSecond = 5;
        this.gold = 100;
        this.goldTimer = 0;
        
        this.armyLevel = 2;
        this.bowButton.drawBox(this.bowButton.pressedColor);
        this.flyingButton.drawBox(this.flyingButton.pressedColor);
        this.shieldButton.drawBox(this.shieldButton.pressedColor);
    }
    
    //increments the army level unlocking units accordingly
    upgradeArmy(){
        if(this.armyLevel < 5){
            this.armyLevel++;
        }
        
        if(this.armyLevel >= 3){
            this.bowButton.drawBox(this.bowButton.baseColor);
        }
        else{
            this.bowButton.drawBox(this.bowButton.pressedColor);
        }
        
        if(this.armyLevel >= 4){
            this.flyingButton.drawBox(this.flyingButton.baseColor);
        }
        else{
            this.flyingButton.drawBox(this.flyingButton.pressedColor);
        }
        
        if(this.armyLevel >= 5){
            this.shieldButton.drawBox(this.shieldButton.baseColor);
        }
        else{
            this.shieldButton.drawBox(this.shieldButton.pressedColor);
        }
    }
    
    //selects the specified lane
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
    
    //returns the lane corresponding to the given number, if the number is out of range
    // it will return the selected lane
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
    
    //returns the castle belonging to the opposite team of the given direction
    // -1 will return the player's castle
    //  1 will return the enemy's castle
    getCastle(direction){
        if(direction == -1){
            return this.friendlyCastle;
        }
        else{
            return this.enemyCastle;
        }
    }
    
    //spawns a unit on the specified lane moving in the given direction, if the
    //player purchased the unit it also decrements their gold
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
                    if(this.armyLevel < 3){
                        return false;
                    }
                    
                    if(this.gold < 25){
                        return false;
                    }
                    
                    this.gold -= 25;
                }
                
                newUnit = new Unit(lane, 75, 40, 0x0000FF, "BOW", direction);
                break;
            case "FLYING":
                if(direction == 1){
                    if(this.armyLevel < 4){
                        return false;
                    }
                    
                    if(this.gold < 15){
                        return false;
                    }
                    
                    this.gold -= 15;
                }
                
                newUnit = new Unit(lane, 75, 40, 0xFFFF00, "FLYING", direction);
                break;
            case "SHIELD":
                if(direction == 1){
                    if(this.armyLevel < 5){
                        return false;
                    }
                    
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
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("UpgradeScreen.png");
        
        //Setup Buttons
        this.returnButton = new UIButton(this.sceneManager.sceneWidth / 2, 35, 200, 50, "Return");
        this.returnButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
        this.returnButton.stageButton(this);
        
        this.castleButton = new UIButton(500, 200, 250, 50, "Repair Castle 50g");
        this.castleButton.setAction(function(){
            if(sceneManager.gameScene.gold >= 50 && sceneManager.gameScene.friendlyCastle.health < sceneManager.gameScene.friendlyCastle.maxHealth){
                sceneManager.gameScene.gold -= 50;
            }
            else{
                return;
            }
            
            sceneManager.gameScene.friendlyCastle.health += 50;
            
            if(sceneManager.gameScene.friendlyCastle.health > sceneManager.gameScene.friendlyCastle.maxHealth){
                sceneManager.gameScene.friendlyCastle.health = sceneManager.gameScene.friendlyCastle.maxHealth
            }
        });
        this.castleButton.stageButton(this);
        
        this.goldButton = new UIButton(550, 375, 250, 50, "Upgrade Mines 75g");
        this.goldButton.setAction(function(){
            if(sceneManager.gameScene.gold >= 75){
                sceneManager.gameScene.gold -= 75;
            }
            else{
                return;
            }
            
            sceneManager.gameScene.goldPerSecond += 5;
        });
        this.goldButton.stageButton(this);
        
        this.armyButton = new UIButton(800, 500, 250, 50, "Upgrade Army 50g");
        this.armyButton.setAction(function(){
            if(sceneManager.gameScene.armyLevel >= 5){
                return;
            }
            
            if(sceneManager.gameScene.gold >= 50){
                sceneManager.gameScene.gold -= 50;
            }
            else{
                return;
            }
            
            sceneManager.gameScene.upgradeArmy();
        });
        this.armyButton.stageButton(this);
        
        //Setup Labels
        this.goldLabel = new UIButton(939, 35, 150, 50, "Gold: 100g");
        this.goldLabel.stageButton(this);
        
        this.goldPerSecondLabel = new UIButton(939, 120, 150, 100,"Gold Per\nSecond\n5");
        this.goldPerSecondLabel.stageButton(this);
        
        this.healthLabel = new UIButton(939, 220, 150, 75, "Health\n1000/1000");
        this.healthLabel.stageButton(this);
        
        this.armyLabel = new UIButton(939, 305, 150, 75, "Army Level\n2/5");
        this.armyLabel.stageButton(this);
        
        this.instructionsLabel = new UIButton(310, this.sceneManager.sceneHeight - 72, 600, 125);
        this.instructionsLabel.setText("Repair Castle: Heals 50 damage.\nUpgrade Mines: Increases gold per second by 5.\nUpgrade Army: Unlocks new Unit types.");
        this.instructionsLabel.stageButton(this);
    }
    
    //updates all of the label values to reflect purchased upgrades
    update(){
        this.goldLabel.setText(`Gold: ${sceneManager.gameScene.gold}g`);
        this.goldPerSecondLabel.setText(`Gold Per\nSecond\n${sceneManager.gameScene.goldPerSecond}`);
        this.healthLabel.setText(`Health\n${sceneManager.gameScene.friendlyCastle.health}/${sceneManager.gameScene.friendlyCastle.maxHealth}`);
        this.armyLabel.setText(`Army Level\n${sceneManager.gameScene.armyLevel}/5`);
    }
}

//Game Over Screen---------------------------------------------------------------------------
class GameOverScreen extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("TitleScreen.png");
        
        this.message = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) - 100, 300, 100, "Game Over");
        this.message.stageButton(this);
        
        this.playAgainButton = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 150, 200, 50, "Play Again");
        this.playAgainButton.setAction(function(){
            sceneManager.switchScene("GAME");
        });
        this.playAgainButton.stageButton(this);
        
        this.menuButton = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 210, 200, 50, "Main Menu");
        this.menuButton.setAction(function(){
            sceneManager.switchScene("MENU");
        });
        this.menuButton.stageButton(this);
    }
}

//Instructions Scene-------------------------------------------------------------------------
class InstructionsScene extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("InstructionsScreen.png");
        
        //Setup buttons
        this.menuButton = new UIButton(this.sceneManager.sceneWidth / 2, 35, 200, 50, "Main Menu");
        this.menuButton.setAction(function(){
            sceneManager.switchScene("MENU");
        });
        this.menuButton.stageButton(this);
        
        this.playButton = new UIButton(this.sceneManager.sceneWidth / 2, 95, 200, 50, "Play");
        this.playButton.setAction(function(){
            sceneManager.switchScene("LEVEL");
        });
        this.playButton.stageButton(this);
        
        //Setup labels
        this.instructionsLabel = new UIButton(this.sceneManager.sceneWidth / 2, (this.sceneManager.sceneHeight / 2) + 50, 850, 575);
        this.instructionsLabel.setText("Your Goal: Send your units down the lanes to the enemy's side\nto hurt them while preventing their units from getting to your side.\n" + 
                                      "\nControls: Click the lanes to select them, then click the buttons\nat the top of the screen to send your units down the selected lane.\n" +
                                      "\nClick the upgrade button to access the upgrade screen and use\nyour gold to provide various bonuses to your army and castle.\n" +
                                      "\n                                                Units:\n" + 
                                      "Sword: Basic unit with average speed and health, high damage,\nshort attack range.\n" + 
                                      "Spear: Medium range unit that can hit multiple enemies with each\nattack.\n" +
                                      "Bow: Long range unit that can shoot over allies, deals low damage.\n" +
                                      "Fast: Low health, but very fast movement and attack speed, good\nfor delaying the enemy.\n" +
                                      "Shield: Slow unit with a lot of health but low damage and attack rate.");
        this.instructionsLabel.stageButton(this);
    }
}

//Levels Scene-------------------------------------------------------------------------------
class LevelsScene extends Scene{
    constructor(sceneManager){
        super(sceneManager);
    }
    
    //Sets up all of the buttons and labels on the screen
    setup(){
        super.setup("InstructionsScreen.png");
        
        //Setup Buttons
        this.menuButton = new UIButton(this.sceneManager.sceneWidth / 2, 35, 200, 50, "Main Menu");
        this.menuButton.setAction(function(){
            sceneManager.switchScene("MENU");
        });
        this.menuButton.stageButton(this);
        
        this.levels = [];
        
        let level1Button = new UIButton(this.sceneManager.sceneWidth / 2, 125, 300,50,"Swords and Spears");
        level1Button.setAction(function(){
            if(sceneManager.maxLevel < 1){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 500;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SWORD", "SPEAR"], 4);
            
            sceneManager.currentLevel = 1;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level1Button);
        
        let level2Button = new UIButton(this.sceneManager.sceneWidth / 2, 185, 300,50,"Speed and Range");
        level2Button.setAction(function(){
            if(sceneManager.maxLevel < 2){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 500;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["BOW", "FLYING"], 2.5);

            sceneManager.currentLevel = 2;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level2Button);
        
        let level3Button = new UIButton(this.sceneManager.sceneWidth / 2, 245, 300,50,"Big and Strong");
        level3Button.setAction(function(){
            if(sceneManager.maxLevel < 3){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 750;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SPEAR", "SHIELD"], 3);

            sceneManager.currentLevel = 3;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level3Button);
        
        let level4Button = new UIButton(this.sceneManager.sceneWidth / 2, 305, 300,50,"Bows and Arrows");
        level4Button.setAction(function(){
            if(sceneManager.maxLevel < 4){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 750;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["BOW"], 1.5);

            sceneManager.currentLevel = 4;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level4Button);
        
        let level5Button = new UIButton(this.sceneManager.sceneWidth / 2, 365, 300,50,"+ The Kitchen Sink");
        level5Button.setAction(function(){
            if(sceneManager.maxLevel < 5){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 750;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SWORD", "SPEAR", "BOW", "FLYING", "SHIELD"], 2.5);

            sceneManager.currentLevel = 5;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level5Button);
        
        let level6Button = new UIButton(this.sceneManager.sceneWidth / 2, 425, 300,50,"Death Awaits");
        level6Button.setAction(function(){
            if(sceneManager.maxLevel < 6){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 1000;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SWORD", "SPEAR", "BOW", "FLYING", "SHIELD"], 1);

            sceneManager.currentLevel = 6;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level6Button);
        
        let level7Button = new UIButton(this.sceneManager.sceneWidth / 2, 485, 300,50,"Too Many Shields");
        level7Button.setAction(function(){
            if(sceneManager.maxLevel < 7){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 1000;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SHIELD"], 2);

            sceneManager.currentLevel = 7;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level7Button);
        
        let level8Button = new UIButton(this.sceneManager.sceneWidth / 2, 545, 300,50,"Swordmageddon");
        level8Button.setAction(function(){
            if(sceneManager.maxLevel < 8){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 1250;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SWORD"], 1.5);

            sceneManager.currentLevel = 8;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level8Button);
        
        let level9Button = new UIButton(this.sceneManager.sceneWidth / 2, 605, 300,50,"Long Range Assault");
        level9Button.setAction(function(){
            if(sceneManager.maxLevel < 9){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 1250;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SPEAR", "BOW"], 1.5);

            sceneManager.currentLevel = 9;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level9Button);
        
        let level10Button = new UIButton(this.sceneManager.sceneWidth / 2, 665, 300,50,"Death Came Back");
        level10Button.setAction(function(){
            if(sceneManager.maxLevel < 10){
                return;
            }
            
            sceneManager.gameScene.enemyCastle.maxHealth = 1250;
            sceneManager.gameScene.enemyManager = new EnemyManager(sceneManager.gameScene, ["SWORD", "SPEAR", "SHIELD"], 0.75);

            sceneManager.currentLevel = 10;
            sceneManager.switchScene("GAME");
        });
        this.levels.push(level10Button);
        
        for(let i = 0; i < this.levels.length; i++){
            this.levels[i].stageButton(this);
        }
        
        console.log("Max Level: " + this.sceneManager.maxLevel);
    }
    
    updateLevels(){
        for(let i = 0; i < this.levels.length; i++){
            if(i + 1 > this.sceneManager.maxLevel){
                this.levels[i].drawBox(this.levels[i].pressedColor);
            }
            else{
                this.levels[i].drawBox(this.levels[i].baseColor);
            }
        }
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
        
        this.drawBox(hoverColor);
    }
    
    //stages all of the components of the button
    stageButton(stage){
        stage.addChild(this.box);
        stage.addChild(this.text);
    }
    
    //draws the button and the text on top of it
    drawBox(color = this.baseColor){
        this.box.beginFill(color);
        this.box.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
        this.box.x = this.x;
        this.box.y = this.y;
        this.box.endFill();
        this.positionText();
    }
    
    //Sets the text of the button and positions it
    setText(value){
        this.text.text = value;
        this.positionText();
    }
    
    //positions the text either centered or left aligned
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
    
    //Sets what happens when the button is clicked also changes the color to show that it 
    //is clickable and allows the mouse to recognize that it is clickable
    setAction(action){
        this.box.interactive = true;
        this.box.buttonMode = true;
        this.action = action;
        
        this.box.on('pointerdown', function(){
            action();
        });
        
        this.drawBox(this.baseColor)
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
    
    //draws the lane sprite over the button default box
    drawLane(color = this.baseColor){
        this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/Lane.png`));
        this.image.anchor.set(0.5,0.5);
        this.image.scale.set(1,1);
        this.image.x = this.x;
        this.image.y = this.y;
    }
    
    //tints the lane to show that it is selected and un-tints it when it is deselected
    select(value){
        if(value){
            this.image.tint = this.hoverColor;
        }
        else{
            this.image.tint = this.baseColor;
        }
    }
    
    //updates all of the units on the lane
    update(deltaTime){
        for(let i = 0; i < this.units.length; i++){
            this.units[i].update(deltaTime);
        }
        
        this.units = this.units.filter(u=>u.alive);
    }
    
    //returns whether or not the specified section of the lane contains any units
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
    
    //returns the index of the section of the lane that corresponds to the given xPosition
    getSection(xValue){
        let currentSection = Math.floor((xValue - (this.x - (this.pixelLength / 2))) / this.sectionLength);
        return currentSection;
    }
    
    //returns the closest unit in front of the given unit
    getForwardUnit(unit){
        let closestUnit = false;
        let closestDistance = this.pixelLength;
        
        for(let i = 0; i < this.units.length; i++){
            if(unit != this.units[i]){
                let distance = this.units[i].x - unit.x;
                if(distance * unit.direction > 0){
                    if(Math.abs(distance) < Math.abs(closestDistance)){
                        closestDistance = distance;
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
    
    //stages the lane
    stageButton(stage){
        stage.addChild(this.box);
        stage.addChild(this.text);
        stage.addChild(this.image);
    }
    
    //returns all of the enemy units in front of the given unit
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
    
    //removes all units and clears the lane
    resetLane(){
        for(let i = 0; i < this.units.length; i++){
            this.units[i].unstageUnit();
        }
        
        this.units = [];
    }
}