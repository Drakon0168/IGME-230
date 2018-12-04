class Unit{
    constructor(lane, height = 75, width = 40, color = 0x777777, type = "", direction){
        this.color = color;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.image = new PIXI.Graphics();
        this.healthBar = new PIXI.Graphics();
        this.healthBarWidth = 100;
        this.lane = lane;
        this.x = lane.x + ((lane.pixelLength / 2) * direction*-1);
        this.y = lane.y - (this.height / 2);
        
        this.type = type;
        this.attackTimer = 0;
        this.alive = true;
        
        this.drawSelf();
        
        switch(type){
            case "SWORD":
            default:
                this.speed = 100;
                this.maxHealth = 100;
                this.damage = 20;
                this.attackSpeed = 1;
                this.attackRange = 50;
                break;
            case "SPEAR":
                this.speed = 75;
                this.maxHealth = 100;
                this.damage = 15;
                this.attackSpeed = 1;
                this.attackRange = 100;
                break;
            case "BOW":
                this.speed = 75;
                this.maxHealth = 75;
                this.damage = 10;
                this.attackSpeed = 1;
                this.attackRange = 300;
                break;
            case "FLYING":
                this.speed = 150;
                this.maxHealth = 50;
                this.damage = 30;
                this.attackSpeed = 1;
                this.attackRange = 50;
                break;
            case "SHIELD":
                this.speed = 50;
                this.maxHealth = 150;
                this.damage = 25;
                this.attackSpeed = 0.5;
                this.attackRange = 50;
                break;
        }
        
        this.health = this.maxHealth;
    }
    
    drawSelf(){
        this.image.beginFill(this.color);
        this.image.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
        this.image.x = this.x;
        this.image.y = this.y;
        this.image.endFill();
        
        this.healthBar.beginFill(0xFF0000);
        this.healthBar.drawRect(-(this.healthBarWidth / 2), -(this.height), this.healthBarWidth, 10);
        this.healthBar.x = this.x;
        this.healthBar.y = this.y + 10;
        this.healthBar.scale.x = this.health / this.maxHealth;
        this.healthBar.endFill();
    }
    
    update(deltaTime){
        this.attackTimer += deltaTime;
        let currentSection = this.lane.getSection(this.x);
        let collidingUnit = this.lane.sectionFull(currentSection + this.direction);
        if(collidingUnit){
            if(collidingUnit.health != undefined && collidingUnit.direction != this.direction){
                if(this.attackTimer > (1 / this.attackSpeed)){
                    collidingUnit.health -= this.damage;
                    this.attackTimer = 0;
                    
                    if(collidingUnit.type == "SHIELD"){
                        console.log("Enemy Tank Health: " + collidingUnit.health);
                    }
                    
                    if(collidingUnit.health <= 0){
                        collidingUnit.die();
                    }
                }
            }
        }
        else if((currentSection > 1 && this.direction == -1) || (currentSection < this.lane.laneLength - 2 && this.direction == 1)){
            this.move(deltaTime);
        }
        else{
            this.image.parent.sceneManager.switchScene("GAMEOVER");
            this.image.parent.reset();
        }
        
        //Update Image Positions
        this.image.x = this.x;
        this.healthBar.x = this.x;
        this.healthBar.scale.x = this.health / this.maxHealth;
    }
    
    move(deltaTime){
        this.x += this.speed * this.direction * deltaTime;
    }
    
    die(){
        this.alive = false;
        this.unstageUnit();
    }
    
    stageUnit(stage){
        stage.addChild(this.image);
        stage.addChild(this.healthBar);
    }
    
    unstageUnit(){
        this.image.parent.removeChild(this.image);
        this.healthBar.parent.removeChild(this.healthBar);
    }
}

class EnemyManager{
    constructor(gameScene, enemyTypes, spawnRate){
        this.gameScene = gameScene;
        this.enemyTypes = enemyTypes;
        this.spawnRate = spawnRate;
        this.spawnTimer = 0;
    }
    
    update(deltaTime){
        this.spawnTimer += deltaTime;
        
        if(this.spawnTimer > this.spawnRate){
            if(this.spawnUnit()){
                this.spawnTimer = 0;
            }
        }
    }
    
    spawnUnit(){
        let laneNum = Math.floor(Math.random() * 3) + 1;
        console.log(laneNum);
        return this.gameScene.spawnUnit(this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)], -1, this.gameScene.getLane(laneNum));
    }
}