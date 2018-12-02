class Unit extends PIXI.Graphics{
    constructor(lane, height = 75, width = 40, color = 0x777777, type = ""){
        super();
        
        this.color = color;
        this.width = width;
        this.height = height;
        this.x = lane.x;
        this.y = lane.y - (this.height / 2);
        
        this.drawSelf();
        
        console.log(`Spawned ${type} unit at (${this.x},${this.y})`);
    }
    
    drawSelf(){
        this.beginFill(this.color);
        this.drawRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        this.endFill();
    }
    
    die(){
        
    }
}