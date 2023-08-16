class Mario {
    constructor(game) {
        this.game = game;
        this.start();

        this.jumpActive = false;
    }

    start(){
        this.x = 6;
        this.y = 11;
        this.imgX = 0;
        this.imgY = 0;
    }

    go(speed,imgY){
        if(this.imgX<2||this.imgX>5){
            this.imgX = 2;
        }
        if(this.x+speed+this.game.map.x>=0 && this.x+speed <= this.game.map.data.length-2){
            this.x += speed;
            console.log(this.game.map.data.length)
        }

        if (speed>=0 && this.x + this.game.map.x > 6 && this.game.map.x + this.game.map.data.length > DOTS_ROW+1){
            this.game.map.x -= speed;
        }
        this.imgX += 1;
        if(this.imgX===5){
            this.imgX = 2;
        }
        this.imgY = imgY;

    }

    sit(){
        this.imgX = 1;
        this.imgY = 0;
    }

    draw(){
        this.game.ctx.drawImage(this.game.Images["MarioBig"],
            this.imgX*DOT_IMAGE_WIDTH,
            this.imgY*DOT_IMAGE_HEIGHT,
            DOT_IMAGE_WIDTH,
            DOT_IMAGE_HEIGHT*2,
            (this.x+this.game.map.x)*DOT_SIZE_WIDTH,
            this.y*DOT_SIZE_HEIGHT,
            DOT_SIZE_WIDTH,
            DOT_SIZE_HEIGHT*2);
    }
}