class Unit{
    constructor(lane, height = 75, width = 40, color = 0x777777, type = "", direction){
        this.color = color;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.image = new PIXI.Graphics();
        this.lane = lane;
        this.x = lane.x - ((lane.width / 2) * direction);
        this.y = lane.y - (this.height / 2);
        this.type = type;
        
        this.drawSelf();
        
        switch(type){
            case "Sword":
            default:
                this.speed = 100;
                this.health = 100;
                this.damage = 25;
                this.attackSpeed = 1;
                this.attackRange = 50;
                break;
        }
    }
    
    drawSelf(){
        this.image.beginFill(this.color);
        this.image.drawRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        this.image.endFill();
    }
    
    update(deltaTime){
        let currentSection = this.lane.getSection(this.x);
        
        if(!this.lane.sectionFull(currentSection + this.direction)){
            this.move(deltaTime);
        }
        
        this.image.x = this.x;
    }
    
    move(deltaTime){
        this.x += this.speed * this.direction * deltaTime;
        console.log(this.x);
    }
    
    stageUnit(stage){
        stage.addChild(this.image);
    }
}