class Unit extends PIXI.Graphics{
    constructor(lane, unitHeight = 75, unitWidth = 40, color = 0x777777, type = ""){
        super();
        
        this.color = color;
        this.unitWidth = unitWidth;
        this.unitHeight = unitHeight;
        this.x = lane.x;
        this.y = lane.y - (this.height / 2);
        this.type = type;
        
        this.drawSelf();
        
        console.log(`Spawned ${this.type} unit at (${this.x},${this.y}, ${this.unitWidth}, ${this.unitHeight})`);
    }
    
    drawSelf(){
        this.beginFill(this.color);
        this.drawRect(this.x - (this.unitWidth / 2), this.y - (this.unitHeight / 2), this.unitWidth, this.unitHeight);
        this.endFill();
    }
    
    die(){
        
    }
}