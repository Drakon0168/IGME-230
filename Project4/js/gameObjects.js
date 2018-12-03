class Unit{
    constructor(lane, height = 75, width = 40, color = 0x777777, type = "", direction){
        this.color = color;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.image = new PIXI.Graphics();
        this.healthBar = new PIXI.Graphics();
        this.healthBarWidth = 50;
        this.lane = lane;
        this.x = lane.x - ((lane.width / 2) * direction);
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
                this.maxHealth = 200;
                this.damage = 25;
                this.attackSpeed = 0.5;
                this.attackRange = 50;
                break;
        }
        
        this.health = this.maxHealth;
    }
    
    drawSelf(){
        this.image.beginFill(this.color);
        this.image.drawRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        this.image.endFill();
        
        this.healthBar.beginFill(0xFF0000);
        this.healthBar.drawRect(this.x - 25, this.y - (this.height), 100, 10);
        this.healthBar.endFill();
    }
    
    update(deltaTime){
        this.attackTimer += deltaTime;
        let currentSection = this.lane.getSection(this.x);
        let collidingUnit = this.lane.sectionFull(currentSection + this.direction);
        if(collidingUnit){
            if(collidingUnit.health != undefined){
                if(this.attackTimer > (1 / this.attackSpeed)){
                    collidingUnit.health -= this.damage;
                    if(collidingUnit.health < 0){
                        collidingUnit.die();
                    }
                    this.attackTimer = 0;
                }
            }
        }
        else{
            this.move(deltaTime);
        }
        
        this.healthBar.width = this.healthBarWidth * (this.health / this.maxHealth);
        
        //Update Image Positions
        if(this.direction == 1){
            this.image.x = this.x;
            this.healthBar.x = this.x;
        }
        else{
            this.image.x = this.x - 1024;
            this.healthBar.x = this.x - 1024;
        }
    }
    
    move(deltaTime){
        this.x += this.speed * this.direction * deltaTime;
    }
    
    die(){
        this.image.visible = false;
        this.healthBar.visible = false;
        this.alive = false;
    }
    
    stageUnit(stage){
        stage.addChild(this.image);
        stage.addChild(this.healthBar);
    }
}