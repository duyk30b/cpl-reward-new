class Dot {
    constructor(game,row,col,color) {
        this.game = game;
        this.row = row;
        this.col = col;
        this.color = color;
    }

    canMoveLeft(){
        return this.game.board.isEmptyDot(this.row, this.col - 1);
    }
    canMoveRight(){
        return this.game.board.isEmptyDot(this.row, this.col + 1);
    }
    canFall(){
        return this.game.board.isEmptyDot(this.row + 1, this.col);
    }

    moveLeft(){
        if(this.canMoveLeft()) this.col--;
    }
    moveRight(){
        if(this.canMoveRight()) this.col++;
    }
    fall(){
        if(this.canFall()) this.row++;
    }
    moveDown(){
        while (this.canFall()) this.fall();
    }


    draw(){
        let x = this.col * DOT_SIZE;
        let y = (this.row - 4) * DOT_SIZE;
        switch (this.color) {
            case "bomb": this.game.canvas.drawBomb(x,y); break;
            case "spreadBoom": this.game.canvas.drawSpreadBomb(x,y); break;
            case "shadow": this.game.canvas.drawShadow(x,y); break;
            case "gun": this.game.canvas.drawGun(x,y); break;
            case "hide": this.game.canvas.drawHideDot(x,y); break;
            default: this.game.canvas.drawNormalDot(x,y,this.color); break;
        }
    }
}