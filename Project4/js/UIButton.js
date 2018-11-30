"use strict";

class UIButton extends PIXI.Graphics{
    constructor(x = 0, y = 0, width = 100, height = 100, title = "Button"){
        super();
        
        this.beginFill(0xFFFFFF);
        
        this.drawRect(width * -1 / 2, height * -1 / -2, width / 2, height / 2);
        
        this.endFill();
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.title = title;
    }
}