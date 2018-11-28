class UIButton extends PIXI.Graphics{
    constructor(let x = 0, let y = 0, let width = 100, let height = 100, let title = "Button"){
        super();
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.title = title;
        
        this.beginFill(0xFFFFFF);
        
        this.drawRect(width / -2, height / -2, width / 2, height / 2);
        
    }
}