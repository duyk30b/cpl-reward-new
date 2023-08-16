class Bomb extends Shape{
    constructor(game,row,col) {
        super(game, [[["bomb"]]]);

        let random = Math.floor(Math.random() * 4);
        switch (random) {
            case 0: this.typeBomb = 0; break;
            case 1: this.typeBomb = 1; break;
            case 2: this.typeBomb = 2; break;
            case 3: this.typeBomb = 3; break;
        }
        if(row===null&&col===null) {
            this.setBomb()
        }
        else {
            this.fall();
        }
    }

    moveLeft() {
        super.moveLeft();
        this.previewSpread();
    }

    moveRight() {
        super.moveRight();
        this.previewSpread();
    }

    rotate() {
        if(this.canFall()){
            this.typeBomb++;
            this.typeBomb%=4;
            this.previewSpread();
        }
    }

    fall() {
        if (this.canFall()){
            this.row++;
            this.listDotsForDraw.forEach((dot)=>{
                dot.row++;
            });
            this.previewSpread();
        }
        else {
            this.endFall();
        }
    }

    setBomb(){
        let random = Math.floor(Math.random()*120) + 120;
        this.row = Math.floor(random/10);
        this.col = random%10;
        this.game.board.data[this.row][this.col] = "bomb";
        this.autoStart();
    }

    endFall() {
        super.endFall();
        this.autoStart();
    }

    previewSpread(){
        this.listSpread = [];

        if (this.typeBomb === 0){
            for(let j = 0; j < NUM_COLS; j++) {
                if (this.col === j || j - this.col > 3 || this.col - j > 3) continue;
                let newDot = new Dot(this.game, this.row, j, "spreadBoom");
                this.listSpread.push(newDot);
            }
        }
        if(this.typeBomb === 1){
            for(let i = this.row - 1; i <= this.row + 1; i++){
                for(let j = this.col - 1; j <= this.col + 1; j++){
                    if (!this.game.board.isOnBoard(i,j)) continue;
                    if (this.row === i && this.col ===j) continue;
                    let newDot = new Dot(this.game,i,j,"spreadBoom");
                    this.listSpread.push(newDot);
                }
            }
        }
        if (this.typeBomb === 2){
            for(let i = 0; i < NUM_ROWS; i++){
                if (this.row === i || i - this.row > 3 || this.row - i > 3) continue;
                let newDot = new Dot(this.game,i,this.col,"spreadBoom");
                this.listSpread.push(newDot);
            }
        }
        if (this.typeBomb === 3){
            for(let i = this.row - 2; i <= this.row + 2; i = i + 4){
                for(let j = this.col - 2; j <= this.col + 2; j = j + 4){
                    if (!this.game.board.isOnBoard(i,j)) continue;
                    let newDot = new Dot(this.game,i,j,"spreadBoom");
                    this.listSpread.push(newDot);
                }
            }
        }

    }

    autoStart() {
        setTimeout(()=>{
            switch (this.typeBomb) {
                case 0: this.activeRowBomb(this.row); break;
                case 1: this.activeAreaBomb(this.row,this.col); break;
                case 2: this.activeColBomb(this.col); break;
                case 3: this.activeFireBomb(); break;
            }
        },500);
    }

    activeAreaBomb(rowBomb,colBomb){
        for(let i = rowBomb - 1; i <= rowBomb + 1; i++){
            for(let j = colBomb - 1; j <= colBomb + 1; j++){
                if (!this.game.board.isOnBoard(i,j)) continue;
                if (this.game.board.isBrickDot(i,j)){
                    this.game.board.data[i][j] = "bomb";
                }
            }
        }
        setTimeout(()=>{
            this.boom(_);
            for(let i = rowBomb - 2; i <= rowBomb + 2; i++){
                for(let j = colBomb - 2; j <= colBomb + 2; j++){
                    if (!this.game.board.isOnBoard(i,j)) continue;
                    if (this.game.board.isBrickDot(i,j)){
                        this.game.board.data[i][j] = 0;
                    }
                }
            }
        },2000)

    }

    activeFireBomb(){
        for(let i = 0; i < 8; i++){
            let random = Math.floor(Math.random()*90) + 150;
            let row = Math.floor(random/10);
            let col = random%10;
            this.game.board.data[row][col] = "bomb";
        }
        setTimeout(()=>{
            let r = Math.floor(Math.random()*2);
            if(r===0) this.boom(0);
            if(r===1) this.boom(_);
        },2000)
    }
    activeColBomb(colBomb){
        for(let i=4;i<24;i++){
            if (this.game.board.isBrickDot(i,colBomb)){
                this.game.board.data[i][colBomb] = "bomb";
            }
        }
        setTimeout(()=>this.boom(_),2000);
    }
    activeRowBomb(rowBomb){
        for(let i=0;i<10;i++){
            if (this.game.board.isBrickDot(rowBomb,i)){
                this.game.board.data[rowBomb][i] = "bomb";
            }
        }
        setTimeout(()=>{
            this.boom(_);
            this.game.board.removeOneRow(rowBomb);
        },2000);
    }

    boom(val){
        for(let i = 4; i < NUM_ROWS; i++){
            for(let j = 0; j < NUM_COLS; j++){
                if(this.game.board.data[i][j] === "bomb"){
                    this.game.board.data[i][j] = val;
                }
            }
        }
    }

    draw() {
        super.draw();
        for (let i=0;i<this.listSpread.length;i++){
            if(this.listSpread[i].color===_) continue;
            this.listSpread[i].draw();
        }
    }
}