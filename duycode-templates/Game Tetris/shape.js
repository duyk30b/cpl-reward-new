class Shape {
    constructor(game, shape) {
        this.game = game;
        this.shape = shape;

        // this.baseShape = JSON.parse(JSON.stringify(shape));

        this.createBrick();
        this.getDotsForDraw();
    }

    createBrick(){
        this.random = Math.floor(Math.random() * this.shape.length);
        this.getBrick = this.randomRotate(this.shape[this.random]);

        // get position before fall
        this.row = 3;
        this.col = Math.floor(5 - this.getBrick[0].length/2);
    }

    getDotsForDraw(){
        this.listDotsForDraw = [];
        for(let row = 0; row < this.getBrick.length; row++){
            for(let col = 0; col < this.getBrick[0].length; col++){
                if(this.getBrick[row][col]===_) continue;
                let newDot = new Dot(this.game,this.row+row,this.col+col,this.getBrick[row][col]);
                this.listDotsForDraw.push(newDot);
            }
        }
    }

    oneRotate(brick){
        let brickRotate = [];
        for(let i=0;i<brick[0].length;i++){
            let newRow =[];
            for(let j = brick.length - 1; j >= 0; j--){
                let newDot = brick[j][i];
                newRow.push(newDot);
            }
            brickRotate.push(newRow);
        }
        return brickRotate;
    }

    randomRotate(brick){
        let rotate = brick;
        let random = Math.floor(Math.random()*4);
        for (let i = 0; i < random; i++){
            rotate = this.oneRotate(rotate);
        }
        return rotate;
    }

    rotate(){
        let brickRotate = this.oneRotate(this.getBrick);
        let checkRotate = true;
        for(let i=0;i<brickRotate.length;i++){
            for (let j=0;j<brickRotate[0].length;j++){
                if(brickRotate[i][j]===_) continue;
                if(!this.game.board.isEmptyDot(i+this.row,j+this.col)) {
                    checkRotate = false;
                    break;
                }
            }
        }
        if(checkRotate){
            this.getBrick = brickRotate;
            this.getDotsForDraw();
        }
    }

    canMoveLeft(){
        for (let i=0;i<this.listDotsForDraw.length;i++){
            if(this.listDotsForDraw[i].color===_) continue;
            if(!this.listDotsForDraw[i].canMoveLeft()) return false;
        }
        return true;
    }
    canMoveRight(){
        for (let i=0;i<this.listDotsForDraw.length;i++){
            if(this.listDotsForDraw[i].color===_) continue;
            if(!this.listDotsForDraw[i].canMoveRight()) return false;
        }
        return true;
    }
    canFall(){
        for (let i=0;i<this.listDotsForDraw.length;i++){
            if(this.listDotsForDraw[i].color===_) continue;
            if(!this.listDotsForDraw[i].canFall()) return false;
        }
        return true;
    }

    moveRight(){
        if (this.canMoveRight()){
            this.col++;
            this.listDotsForDraw.forEach((dot)=>{
                dot.col++;
            });
        }
    }
    moveLeft(){
        if (this.canMoveLeft()){
            this.col--;
            this.listDotsForDraw.forEach((dot)=>{
                dot.col--;
            });
        }
    }

    moveDown(){
        while (this.canFall()) this.fall();
    }

    fall(){
        if (this.canFall()){
            this.row++;
            this.listDotsForDraw.forEach((dot)=>{
                dot.row++;
            });
        }
        else {
            this.endFall();
        }
    }
    endFall(){
        this.appendToBoard();
        this.game.board.updateWall();
        this.checkEnd();
    }

    appendToBoard(){
        for(let i=0;i<this.listDotsForDraw.length;i++){
            if(this.listDotsForDraw[i].color===_ || this.listDotsForDraw[i].row < 3) continue;
            this.game.board.data[this.listDotsForDraw[i].row][this.listDotsForDraw[i].col] = this.listDotsForDraw[i].color;
        }
    }

    checkEnd(){
        let checkEnd = false;
        for (let col = 0; col < 10; col++){
            if(this.game.board.data[3][col]===_) continue;
            checkEnd = true;
        }
        if(checkEnd) {
            this.game.stopGame();
        }
        else {
            this.game.createNewBrick();
        }
    }



    draw(){
        for (let i=0;i<this.listDotsForDraw.length;i++){
            if(this.listDotsForDraw[i].color===_) continue;
            this.listDotsForDraw[i].draw();
        }
    }

    preview(){
        //draw board
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                let newDot = new Dot(this.game,i+4,j+preview_col,_);
                newDot.draw();
            }
        }

        //draw next Brick
        let row = Math.floor(2 - this.getBrick.length/2);
        let col = Math.floor(2 - this.getBrick[0].length/2);
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(i < this.getBrick.length && j < this.getBrick[0].length){
                    let drawDot = new Dot(this.game,row+i+4,col+j+preview_col,this.getBrick[i][j]);
                    drawDot.draw();
                }
            }
        }

    }
}