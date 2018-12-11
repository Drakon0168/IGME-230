let xOffset = 0;
let scrollSpeed = 10;

let Scroll = function(direction, deltaTime){
    xOffset += scrollSpeed * deltaTime * direction;
}