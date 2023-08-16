class Gun extends Shape{
    constructor(game) {
        super(game,baseGun);
    }

    randomRotate(brick) {
        return brick;
    }

    rotate(){
        if (this.random ===0){
            this.bulletDot = new Dot(this.game,this.row,this.col,0);
            this.bulletDot.moveDown();
            if(this.game.board.isBrickDot(this.bulletDot.row+1,this.bulletDot.col)){
                this.game.board.data[this.bulletDot.row+1][this.bulletDot.col] = _;
            }
        }
        else if(this.random ===1){
            this.bulletDot = new Dot(this.game,this.row,this.col,0);
            this.bulletDot.moveDown();
            this.game.board.data[this.bulletDot.row][this.bulletDot.col] = this.bulletDot.color;
            this.game.board.updateWall();
        }

    }
}

class HideDot extends Shape{
    constructor(game) {
        super(game,[[["hide"]]]);
    }
    canFall() {
        for (let i=this.row+1;i<NUM_ROWS;i++){
            if(this.game.board.isEmptyDot(i,this.col)) return true;
        }
        return false;
    }
    canMoveLeft() {
        for (let i=this.col-1;i>=0;i--){
            if(this.game.board.isEmptyDot(this.row,i)) return true;
        }
        return false;
    }
    canMoveRight() {
        for (let i=this.col+1;i<NUM_COLS;i++){
            if(this.game.board.isEmptyDot(this.row,i)) return true;
        }
        return false;
    }
    appendToBoard() {
        this.game.board.data[this.row][this.col] = "shadow";
    }
}

class ShadowBrick extends Shape{
    constructor(game,shape) {
        super(game,shape);
    }

    createBrick() {
        super.createBrick();
        let getShadowBrick = [];
        for(let row = 0; row < this.getBrick.length; row++){
            let rowArray = [];
            for(let col = 0; col < this.getBrick[0].length; col++){
                if(this.getBrick[row][col] ===_) rowArray.push(_);
                else rowArray.push("shadow");
            }
            getShadowBrick.push(rowArray);
        }
        this.getBrick = getShadowBrick;
    }
    appendToBoard() {
        for (let i = 0; i < this.listDotsForDraw.length; i++){
            for(let row = this.listDotsForDraw[i].row; row < NUM_ROWS; row++){
                if(this.game.board.isBrickDot(row,this.listDotsForDraw[i].col)){
                    this.game.board.data[row][this.listDotsForDraw[i].col] = _;
                    break;
                }
            }
        }
    }
}

class Brick{
    constructor(game) {
        this.game = game;
        this.myShape = null;
        this.createBrick();
    }
    createBrick(){
        let random = Math.floor(Math.random()*100)+1;
        if(addBehindRow.checked){
            if(random%20===0) this.addRowOnBottom();
            if(random%20===1) this.convertDot();
        }
        if(random===1 && moreWeapon.checked){
            new Bomb(this.game,null,null);
        }

        if(random===2 && moreWeapon.checked){
            this.myShape = new Bomb(this.game,0,0);
        }
        else if(random%20===2 && moreWeapon.checked && this.isDangerous()){
            this.myShape = new Bomb(this.game,0,0);
        }
        else if(random%40===3 && moreWeapon.checked){
            this.myShape = new Gun(this.game);
        }
        else if(random%40===4 && moreWeapon.checked){
            this.myShape = new HideDot(this.game);
        }
        else if(random%40===5 && moreWeapon.checked){
            this.myShape = new ShadowBrick(this.game,baseBrick);
        }
        else if(random%40===6 && moreWeapon.checked){
            this.myShape = new ShadowBrick(this.game,advanceBrick);
        }
        else if (random%4===0&&moreBrick.checked) {
            this.myShape = new Shape(this.game,advanceBrick);
        }
        else this.myShape = new Shape(this.game,baseBrick);
    }
    rotate(){
        this.myShape.rotate();
    }
    moveLeft(){
        this.myShape.moveLeft();
    }
    moveRight(){
        this.myShape.moveRight();
    }
    moveDown(){
        this.myShape.moveDown();
    }
    fall(){
        this.myShape.fall();
    }
    draw(){
        this.myShape.draw();
    }
    preview(){
        this.myShape.preview();
    }

    convertDot(){
        let random = Math.floor(Math.random()*120) + 120;
        this.row = Math.floor(random/10);
        this.col = random%10;

        //color have convert
        this.game.board.data[this.row][this.col] = "hide";
        setTimeout(()=>{
            let r = Math.floor(Math.random()*2);
            if(r===0) this.game.board.data[this.row][this.col] = 0;
            if(r===1) this.game.board.data[this.row][this.col] = _;
        },2000)
    }

    addRowOnBottom(){
        for(let row = 0; row < NUM_ROWS; row ++){
            for(let col = 0; col < NUM_COLS; col++){
                if(row === NUM_ROWS-1) this.game.board.data[row][col] = 0;
                else this.game.board.data[row][col] = this.game.board.data[row+1][col];
            }
        }
        let r = Math.floor(Math.random()*4) + 1;
        for(let i = 0; i < r; i++){
            let random = Math.floor(Math.random()*10);
            this.game.board.data[NUM_ROWS-1][random] = _;
        }
    }

    isDangerous(){
        for(let i = 0; i< NUM_COLS; i++){
            if(this.game.board.isBrickDot(12,i)) return true;
        }
        return false;
    }
}