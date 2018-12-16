class Unit{
    constructor(lane, height = 75, width = 40, color = 0x777777, type = "", direction){
        this.color = color;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.healthBar = new PIXI.Graphics();
        this.healthBarWidth = 75;
        this.separationDistance = 85;
        this.lane = lane;
        this.x = lane.x + ((lane.pixelLength / 2) * direction*-1);
        this.y = lane.y - (this.height / 2);
        
        this.type = type;
        this.attackTimer = 0;
        this.alive = true;
        
        switch(type){
            case "SWORD":
            default:
                this.speed = 100;
                this.maxHealth = 100;
                this.damage = 20;
                this.attackSpeed = 1.25;
                this.attackRange = 50;
                this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/SwordUnit.png`));
                break;
            case "SPEAR":
                this.speed = 75;
                this.maxHealth = 100;
                this.damage = 15;
                this.attackSpeed = 0.75;
                this.attackRange = 150;
                this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/SpearUnit.png`));
                break;
            case "BOW":
                this.speed = 75;
                this.maxHealth = 75;
                this.damage = 10;
                this.attackSpeed = 1;
                this.attackRange = 300;
                this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/BowUnit.png`));
                break;
            case "FLYING":
                this.speed = 150;
                this.maxHealth = 50;
                this.damage = 15;
                this.attackSpeed = 1;
                this.attackRange = 50;
                this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/FastUnit.png`));
                break;
            case "SHIELD":
                this.speed = 50;
                this.maxHealth = 175;
                this.damage = 25;
                this.attackSpeed = 0.5;
                this.attackRange = 50;
                this.image = new PIXI.Sprite(new PIXI.Texture.fromImage(`images/ShieldUnit.png`));
                break;
        }
        
        this.image.anchor.set(0.5,0.5);
        
        if(direction == -1){
            this.image.scale.set(-1,1);
        }
        
        this.drawSelf();
        
        this.health = this.maxHealth;
    }
    
    drawSelf(){
        this.image.x = this.x;
        this.image.y = this.y;
        
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
        let forwardUnit = this.lane.getForwardUnit(this);
        let canMove = true;
        
        if(forwardUnit){
            let enemies = this.lane.getEnemies(this);
            let distance = Math.abs(forwardUnit.x - this.x);
            
            if(enemies.length > 0){
                let enemyDistance = Math.abs(enemies[0].x - this.x);
                if(enemyDistance < this.attackRange + (this.width / 2) + (enemies[0].width / 2)){
                    if(this.attackTimer > 1 / this.attackSpeed){
                        enemies[0].health -= this.damage;
                        
                        if(this.type == "SPEAR"){
                            for(let i = 1; i < enemies.length; i++){
                                if(Math.abs(enemies[i].x - this.x) <= this.attackRange){
                                    enemies[i].health -= this.damage;
                                }
                            }
                        }
                        
                        this.attackTimer = 0;
                    }
                    
                    canMove = false;
                }
            }
            
            if(forwardUnit.direction == this.direction){
                if(distance <= this.separationDistance){
                    canMove = false;
                }
            }
        }
        
        if((currentSection > 1 && this.direction == -1) || (currentSection < this.lane.laneLength - 2 && this.direction == 1)){
            if(canMove){
                this.move(deltaTime);
            }
        }
        else{
            if(this.attackTimer > 1 / this.attackSpeed){
                this.image.parent.getCastle(this.direction).health -= this.damage;
                this.attackTimer = 0;
            }
        }
        
        //Update healthbar
        this.healthBar.scale.x = this.health / this.maxHealth;
        
        //Check for death
        if(this.health <= 0){
            this.die();
        }
    }
    
    move(deltaTime){
        this.x += this.speed * this.direction * deltaTime;
        
        //Update Image Positions
        this.image.x = this.x;
        this.healthBar.x = this.x;
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
        return this.gameScene.spawnUnit(this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)], -1, this.gameScene.getLane(laneNum));
    }
}

class Castle{
    constructor(direction, maxHealth=1000){
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.direction = direction;
        this.healthBar = new PIXI.Graphics();
        
        if(direction == 1){
            this.x = 265;
            this.y = 35;
        }
        else{
            this.x = 265;
            this.y = 733;
        }
        
        this.drawHealthBar();
    }
    
    drawHealthBar(){
        this.healthBar.beginFill(0xFF0000);
        this.healthBar.drawRect(0, -12, 575, 25);
        this.healthBar.x = this.x;
        this.healthBar.y = this.y;
        this.healthBar.scale.x = this.health / this.maxHealth;
        this.healthBar.endFill();
    }
    
    update(deltaTime){
        this.healthBar.scale.x = this.health / this.maxHealth;
        if(this.health <= 0){
            this.die();
        }
        
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
    }
    
    resetCastle(){
        this.health = this.maxHealth;
    }
    
    stageCastle(stage){
        stage.addChild(this.healthBar);
    }
    
    die(){
        if(this.direction == 1){
            this.healthBar.parent.sceneManager.gameOverScene.message.setText("You Lose!");
        }
        else{
            this.healthBar.parent.sceneManager.gameOverScene.message.setText("You Win!");
        }
        
        this.healthBar.parent.sceneManager.switchScene("GAMEOVER");
        this.healthBar.parent.reset();
    }
}